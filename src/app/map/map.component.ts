// Map component creates a map and shows users the location of the search.
// If no location can be found on initialisation, a default map is created based on central London

import { Component, Input, HostBinding } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from '../app.component';
import { DataService } from "src/app/data.service";

// import * as L from 'leaflet';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

import { trigger, style, animate, transition } from '@angular/animations';
import { take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  animations: [
    trigger(  // Loading bar animations - fade angular material loading bar in / out smoothly
      'loadingAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('10ms ease-in', style({opacity: 1}))
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
  map: any;  // stores reference to created map object
  marker: any; // stores reference to created map marker object
  currentMapMarker: any; // reference to the current map marker

  // Holds upto date location data
  userLat: number;
  userLong: number;

  dataIsLoading: boolean;  // Boolean value used to show / hide Angular material loading bar in template
  constructor(private dataService: DataService) { }

  private tabsSubscription: Subscription;  // Store subscription of map tab change from parent
  @Input() tabChange: Observable<any>;  // Gets the input from parent component on each change to map tab
  @HostBinding('class.hidden') visible: boolean = true;  // True when visible

  ngAfterViewInit() {
    // Subscribe to data Service loading variable changes
    // When dataIsLoading = true, loading bar will be shown. Varaible changes to false once data is retreived from API
    // which then hides the loading bar
    this.dataService.isLoading.subscribe( bool => {
      this.dataIsLoading = bool;
    });

    this.getLocationPermissions()  // Get users geolocation permissions - if denied, error is caught and default map loaded
      .then(this.findUserLocation)  // Attempt to get users initial geolocation information
      .then((coords) => {  //Setup the map from the resulting geolocation data
        let year = new Date().getFullYear(); // Starting year is always the current year
        this.dataService.updateData(year, coords[0], coords[1]);  // Make API call with found user geodata and current year
      })
      .catch(error => {  // If no geo data avalaible, setup map with defaults
        // Use the default location data set to central London and previous year if no geodata is given
        // This gives a high chance of returning crimes
        this.dataService.updateData(new Date().getFullYear() -1, this.dataService.userLat, this.dataService.userLng);
      });

    // Subscribe to the dataService using first() so this only triggers once during ngOnIt
    this.dataService.showCurrentData.pipe(take(1)).subscribe(data => {
      this.setupMap(this.dataService.userLat, this.dataService.userLng);  // Setup map based on geodata given to the data service
    });

    // Subscribe to the dataService currentData so that we always get upto date crime data
    this.dataService.showCurrentData.subscribe(data => {
      // Each time data is updated in the data service, it is pushed here, and the map is updated accordingly
      this.editMap(this.dataService.userLat, this.dataService.userLng);
    });

    // Subscription triggered on any tab change to maps tab
    // Used to ensure a map is always displayed
    this.tabsSubscription = this.tabChange.subscribe(() => {
      setTimeout(() => {  // Give delay to allow time for content render
        if(this.map.frameIndex_ === 0){  // If map was not setup, set up first
          this.setupMap(this.userLat, this.userLong);
        }
      }, 1000)
    });
  }

  getLocationPermissions() {
    return new Promise((resolve, reject) => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          if (result.state === 'granted') {
            resolve(`Location aquired`);
          } else if (result.state === 'prompt') {
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
    return new Promise((resolve, reject) => {  // A Promise is returned, allowing a promise chain to be formed
      navigator.geolocation.getCurrentPosition(position => {  // Try to get broswer navigation API data
        if( position != null){  // If browser has API data, return the location coordinates
          resolve([position.coords.latitude, position.coords.longitude]);
        }
        else{  // If no coordinates are found, retunr the default coordinates
          reject([this.dataService.userLat, this.dataService.userLng]);
        }
      })
    })
  }

  // Function takes users starting location and creates a map from it
  // The open street map library is used to render the map
  setupMap(userLat: number, userLong: number) {
    this.userLat = userLat;
    this.userLong = userLong;
    try{
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

  // https://openlayers.org/en/latest/examples/overlay.html
      this.currentMapMarker = new Overlay({
        position: pos,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false,
      });
      this.map.addOverlay(this.currentMapMarker);
      this.map.updateSize();
    }
    catch{
      // If map is not created incase a tab is changed during loading, prevents app from breaking
    }

  }

  // Method is used to edit the map, creating a new center point and marker based on input coordinates
  editMap(userLat: number, userLong: number){
    try{
      this.map.setView(new View({
        center: olProj.fromLonLat([userLong, userLat]),
        zoom: 16,
      }));
      var pos = olProj.fromLonLat([userLong, userLat]);

      // Set new map marker location
      this.currentMapMarker = new Overlay({
        position: pos,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false,
      });
      this.map.addOverlay(this.currentMapMarker);
      this.map.updateSize();
    }
    catch{
      // Prevents error being shown in console to user
    }
   }

};
