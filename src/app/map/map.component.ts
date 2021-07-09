import { Component } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from '../app.component';

import { DataService } from "src/app/data.service";

import { Subscription } from "rxjs";

import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  map: any;
  apiData: any;  // stores all retrieved api data

  constructor(private dataService: DataService) { }

  ngOnInit() {
    // Subscribe to the dataService currentData so that we always get upto date crime data
    this.dataService.showCurrentData.subscribe(data => {
      this.apiData = data;
      console.log("DATA!!!!", this.apiData);
      // BUILD NEW MAP WHEN API DATA IS CHANGED!
      console.log(this.apiData.length);
      if(this.apiData.length < 1){
        console.log("no crime data found");
        this.setupMap(this.dataService.defaultLat, this.dataService.defaultLng);
      }
      else{
        console.log("crime data found");
        this.setupMap(this.apiData[0].location.latitude, this.apiData[0].location.longitude);
      }
    })

    this.getLocationPermissions()
      .then(this.findUserLocation)  // Attempt to get users initial geolocation info
      .then((coords) => {  // If get geo data, Setup the map from the resulting geolocation data
        // this.setupMap(coords[0], coords[1])
        console.log(coords);
        this.dataService.updateData(new Date().getFullYear() - 1, coords[0], coords[1]);  // Make API call with geo data
      })
      .catch(error => {  // If no geo data avalaible, setup map with defaults
        console.log(error)
        // this.setupMap(this.dataService.defaultLat, this.dataService.defaultLng);
        this.dataService.updateData(new Date().getFullYear() - 1, this.dataService.defaultLat, this.dataService.defaultLng);
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

    // IF CRIME DATA - PLOT ON MAP AS HOTSPOTS

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
        zoom: 14
      })
    });

    var pos = olProj.fromLonLat([userLong, userLat]);

    // Marker of crime area
// https://openlayers.org/en/latest/examples/overlay.html
    var marker = new Overlay({
      position: pos,
      positioning: 'center-center',
      element: document.getElementById('marker'),
      stopEvent: false,
    });
    this.map.addOverlay(marker);

  }


};
