// Map componenet creates a map and shows users location based on geo-location.
// If no location can be found, a default map is created

import { Component } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from '../app.component';

import { DataService } from "src/app/data.service";

import { trigger, style, animate, transition } from '@angular/animations';

import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  animations: [
    trigger(  // Loading bar animations - fade in / out smoothly
      'loadingAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms ease-in', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('1000ms ease-out', style({opacity: 0})),
        ])
      ]
    )
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent {
  map: any;
  apiData: any;  // stores all retrieved api data

  userLatCoord: number;
  userLngCoord: number;

  dataIsLoading: boolean;

  currentMapMarker: any; // reference to the current map marker

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // Subscribe to data Service loading variable changes - control spinner
    this.dataService.isLoading.subscribe( bool => {
      this.dataIsLoading = bool;
      console.log("Bool change", this.dataIsLoading);
    });

    this.getLocationPermissions()
      .then(this.findUserLocation)  // Attempt to get users initial geolocation info
      .then((coords) => {  // If get geo data, Setup the map from the resulting geolocation data
        console.log(coords);

        this.userLatCoord = coords[0];
        this.userLngCoord = coords[1];
        // Get current date
        let year = new Date().getFullYear();
        let month =  new Date().getMonth();

        this.dataService.updateData(year, coords[0], coords[1]);  // Make API call with geo data
      })
      .catch(error => {  // If no geo data avalaible, setup map with defaults
        console.log(error)
        // this.setupMap(this.dataService.defaultLat, this.dataService.defaultLng);
        this.dataService.updateData(new Date().getFullYear() -1, this.dataService.defaultLat, this.dataService.defaultLng);
        this.userLatCoord = this.dataService.defaultLat;
        this.userLngCoord = this.dataService.defaultLng;
      });

    // Subscribe to the dataService using first() so this only triggers once
    this.dataService.showCurrentData.pipe(take(1)).subscribe(data => {
      this.apiData = data;
      console.log("DATA!!!!", this.apiData);
      // BUILD NEW MAP WHEN API DATA IS CHANGED!
      console.log(this.apiData.length);
      if(this.apiData.length < 1){
        console.log("no crime data found");  // Get coords based on the users coords
        this.setupMap(this.userLatCoord, this.userLngCoord);
      }
      else{
        console.log("crime data found");
        this.setupMap(this.apiData[0].location.latitude, this.apiData[0].location.longitude);
      }
    });

        // Subscribe to the dataService currentData so that we always get upto date crime data
        this.dataService.showCurrentData.subscribe(data => {
          this.apiData = data;
          console.log("Editting MAPPPPP");
          console.log(data[0].location.latitude, data[0].location.longitude);
          // console.log("DATA!!!!", this.apiData);
          // BUILD NEW MAP WHEN API DATA IS CHANGED!
            console.log("crime data found");
              this.editMap(data[0].location.latitude, data[0].location.longitude);


        });
  }

  getLocationPermissions() {
    // console.log(this.userLocation);
    return new Promise((resolve, reject) => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          if (result.state === 'granted') {
            resolve(`Location aquired`);
          } else if (result.state === 'prompt') {
            console.log('Permissions requested. Waiting for user input...')
            resolve(`Location aquired`);
          } else if (result.state === 'denied') {
            reject(`Rejected, no user services`);
          }
        })
      }
    })
  }

  // Returns array containing location data
  findUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        if( position != null){
          console.log("Geodata found");
          console.log(position.coords);
          console.log("NEW LOCATIONS");
          console.log(position.coords.latitude, position.coords.longitude);
          resolve([position.coords.latitude, position.coords.longitude]);
        }
        else{
          console.log("no location found");
          reject([this.dataService.defaultLat, this.dataService.defaultLng]);
        }
      })
    })
  }

  // Function gets users starting user, pinning it to the map, if not default to London
  setupMap(userLat: number, userLong: number) {
    console.log("MAP SETUP");
    // console.log(this.user);
    const options: object = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([userLong, userLat]),
        zoom: 16
      })
    });

    var pos = olProj.fromLonLat([userLong, userLat]);
    console.log("pos ====", pos);

    // Marker of crime area
// https://openlayers.org/en/latest/examples/overlay.html
    this.currentMapMarker = new Overlay({
      position: pos,
      positioning: 'center-center',
      element: document.getElementById('marker'),
      stopEvent: false,
    });
    this.map.addOverlay(this.currentMapMarker);
    console.log("map loaded fully");
  }

  editMap(userLat: number, userLong: number){

    console.log("Editting map");
    console.log(userLat,userLong);

    // Setup new center location
    this.map.setView(new View({
      center: olProj.fromLonLat([userLong, userLat]),
      zoom: 16,
    }));
    var pos = olProj.fromLonLat([userLong, userLat]);
    console.log("pos ====", pos);

    // Set new map marker location
    this.currentMapMarker = new Overlay({
      position: pos,
      positioning: 'center-center',
      element: document.getElementById('marker'),
      stopEvent: false,
    });
    this.map.addOverlay(this.currentMapMarker);
  }


};
