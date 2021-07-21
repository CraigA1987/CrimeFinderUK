import { Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { DataService } from "src/app/data.service";
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  // Output directive allows component parent component to listen for any resetTab events from the search component
  @Output('resetTabs') resetTabs: EventEmitter<any> = new EventEmitter();

  // ViewChild directive gives access to the html element in the template which matches the selector
  @ViewChild('form',{ static: true }) ngForm: NgForm;

  // Object keeps track of the form input data for template driven form
  search = {
    location: null,
    year: new Date().getFullYear()
  };

  formChangesSubscription: any;  // Observable used to detect any changes to form - used for validation purposes

  // Ensure form date is locaked down to current year as max, and 25 years ago as min year
  maxYearValue = new Date().getFullYear();
  minYearValue = this.maxYearValue - 25;

  locationFound = true; // Varaible controls message if location cannot be found via API

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.formChangesSubscription = this.ngForm.form.valueChanges.subscribe(form => {
      // Try / Catch block ensures form doesn't throw any error if its not fully created yet
      // Tabs cause issues with content rendering - ngAfterViewInit did not resolve unfortunately
      try{
        this.yearValidation(form.year);
      }
      catch{
      }
    })
  }

  // On form submit actions
  onFormSubmit(form: NgForm){
    let searchYear = this.search.year;  // stores search year to be used later in promise chain
    // variables store geodata from api call
    // let data service make call to Geocoding service API - https://nominatim.openstreetmap.org
    // API is used to convert place names into coordinates
    this.dataService.doGeocoding(this.search.location)
    .then(locationData => {  // If place converted into coords successfully
      // Convert coords into numbers, and push new coords to data service to search for crimes at that location
      this.locationFound = true;
      let foundLat = Number(locationData[0].lat);
      let foundLng = Number(locationData[0].lon);
      this.dataService.updateData(searchYear, foundLat, foundLng);
      this.resetTabs.emit(null); // emit event to parent (app.component.ts) via html template - resets tabs back to map tab
    }
    ).catch((err) => {  // Catch dataService geocoding API call returns an empty data array - location not found
      this.locationFound = false;})  // If place name cannot be converted into coords by API, dont update data
    // Reset each form control, clearing any errors on reset
    form.reset({
      "location": '',
      "year": new Date().getFullYear(),
    });
    Object.keys(form.controls).forEach(key =>{
      form.controls[key].setErrors(null)
     });
    };

    // Method ensures any types number entries are valid - 4 characters long and between the min and max years values
    yearValidation(year: number){
     if(String(year).length === 4){
        if(year > this.maxYearValue || year < this.minYearValue){
          this.ngForm.controls['year'].setErrors({'incorrect': true});
        }
      }
      else {  // If less than 4 characters or more than 4 characters - error
        this.ngForm.controls['year'].setErrors({'incorrect': true});
      }
    }

}
