import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataService } from "src/app/data.service";
import {NgForm} from '@angular/forms';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output('resetTabs') resetTabs: EventEmitter<any> = new EventEmitter();

// Object keeps track of the form input data for template driven form
  search = {
    location: null,
    year: new Date().getFullYear()
  };

  // Ensure form date is locaked down to current year as max, and 50 years ago as min year
  maxYearValue = new Date().getFullYear();
  minYearValue = this.maxYearValue - 50;

  locationFound = true; // Varaible controls message if location cannot be found via API

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log("search component created");
    // this.currentYear = new Date().getFullYear(); // get the current year
    // this.startYear = this.currentYear - 25;
  }

  // On form submit
  onFormSubmit(form: NgForm){
    // variables store geodata from api call
    let foundLat;
    let foundLng;
    let foundYear = form.value.year;
    console.log("YEAR!!!!!!", foundYear);

    this.resetTabs.emit(null); // pass event to parent (app.component.ts) - resets tabs back to map

    // let data service make API call
    let inputLocationGeocoded = this.dataService.doGeocoding(this.search.location)
    .then(locationData => {
      console.log(locationData)
      // If no data returns, let user know via a message
      if(locationData.length === 0){
        this.locationFound = false;
      }
       else{
         this.locationFound = true;
         console.log()
         console.log("else hit");
         let foundLat = Number(locationData[0].lat);
         console.log("else hit2");
         let foundLng = Number(locationData[0].lon);
         console.log("else hit3");
         console.log("lat === ", foundLat, "long === ", foundLng, "date ==== ", foundYear);
         console.log("else hit4");
         this.dataService.updateData(foundYear, foundLat, foundLng);
         console.log("else hit5");
      }
    }
    ).catch((err) => {this.locationFound = false;})
    // Reset each form control, clearing any errors on reset
    form.reset();
    Object.keys(form.controls).forEach(key =>{
      form.controls[key].setErrors(null)
     });
    };




    // if locatio is found
    //this.locationFound = true;

    // switch to map tab
    // this.dataService.updateData(new Date().getFullYear() -1, 1, this.dataService.defaultLat, this.dataService.defaultLng);
    // this.resetTabs.emit(null); // pass event to parent (app.component.ts);


}
