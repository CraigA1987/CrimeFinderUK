import {Component} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import { AppComponent } from '../app.component';

import { DataService } from "src/app/data.service";

import { Subscription } from "rxjs";

import Map from 'ol/Map';
import View from 'ol/View';
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
export class MapComponent{
  map: any;

  // object stores current location data - default values are central London
  location = {
    lat: 51.50749,
    long: 0.1272
  };

  constructor(private dataService: DataService){}

  navigationAllowed: boolean = false;

  private dataSubscription: Subscription;  // subscribe to the data service behaviour subject

  ngOnInit(){
    // LOOK INTO PROMISES TO MAKE THIS CODE ASYNC -> NEED TO GET THE COORDS FIRST BEFORE THE API CALL HAPPENS!
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
          if (result.state === 'granted') {
            this.findUserLocation();
            this.dataService.updateData( new Date().getFullYear() -1, this.location.lat, this.location.long);
          } else if (result.state === 'prompt') {
            console.log('Permissions requested. Waiting for user input...')
            this.findUserLocation();
          } else if (result.state === 'denied') {
            this.defaultMap();
            this.dataService.updateData( new Date().getFullYear() -1, this.location.lat, this.location.long);
          }
          this.dataService.showCurrentData.subscribe(data => {
            console.log(data);
          })
        })}
        console.log(this.location.lat, this.location.long);
    }

    findUserLocation(){
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords);
        this.location.lat = position.coords.latitude;
        this.location.long = position.coords.longitude;
        console.log("NEW LOCATIONS");
        console.log(this.location);
        this.setupMap();
    }
  )}


    // Function gets users starting location, pinning it to the map, if not default to London
    setupMap(){
      // console.log("MAP SETUP");
      // console.log(this.location);
      var options = {
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
          center: olProj.fromLonLat([this.location.long, this.location.lat]),
          zoom: 14
        })
      });

      // console.log(this.map);
    }

    defaultMap(){
      console.log("MAP SETUP");
      console.log(this.location);
      var options = {
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
          center: olProj.fromLonLat([0, 0]),
          zoom: 14
        })
      });

      // console.log(this.map);
    }


};
