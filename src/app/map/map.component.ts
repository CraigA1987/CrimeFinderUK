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

  constructor(private dataService: DataService){}


  ngOnInit(){
    // Subscribe to the dataService currentData so that we always get upto date crime data
    this.dataService.showCurrentData.subscribe(data => {
      console.log(data);
    })


    this.getLocationPermissions()
    .then( this.findUserLocation)
    .then((coords) => {
      console.log("Map setup");
      this.setupMap(coords[0], coords[1])
      this.dataService.updateData( new Date().getFullYear() -1, coords[0], coords[1]);
    })
    .catch(error => {console.log(error)
      this.setupMap(51.50749, 0.1272)});
      this.dataService.updateData( new Date().getFullYear() -1, 51.50749, 0.1272);
    }

    getLocationPermissions(){
            // console.log(this.userLocation);
      return new Promise( (resolve, reject) => {
        if (navigator.permissions) {
          navigator.permissions.query({ name: 'geolocation' }).then(result => {
            if (result.state === 'granted') {
              // this.findUserLocation();
              resolve( `Location aquired`);
            } else if (result.state === 'prompt') {
              console.log('Permissions requested. Waiting for user input...')
              // this.findUserLocation();
              resolve( `Location aquired`);
            } else if (result.state === 'denied') {
              // this.defaultMap();
              reject( `Rejected, no user services`);
            }
          })}
      })
    }

    findUserLocation(){
      return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(position => {
            console.log(position.coords);
            console.log("NEW LOCATIONS");
            console.log(position.coords.latitude, position.coords.longitude);
            resolve([position.coords.latitude, position.coords.longitude]);
            // this.setupMap(position.coords.latitude, position.coords.longitude);
          })})
      }

    // Function gets users starting user, pinning it to the map, if not default to London
    setupMap(userLat: number, userLong: number){
      console.log("MAP SETUP");
      // console.log(this.user);
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
          center: olProj.fromLonLat([userLong, userLat]),
          zoom: 14
        })
      });

      // console.log(this.map);
    }

    defaultMap(){
      console.log("DEFAULT MAP SETUP");
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
