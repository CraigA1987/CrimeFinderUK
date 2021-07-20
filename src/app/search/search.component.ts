import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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

  // Ensure form date is locaked down to current year as max, and 50 years ago as min year
  maxYearValue = new Date().getFullYear();
  minYearValue = this.maxYearValue - 50;

  locationFound = true; // Varaible controls message if location cannot be found via API

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.formChangesSubscription = this.ngForm.form.valueChanges.subscribe(form => {
      this.yearValidation(form.year)
    })
  }

  // On form submit
  onFormSubmit(form: NgForm){
    // variables store geodata from api call
    // let data service make API call
    this.dataService.doGeocoding(this.search.location)
    .then(locationData => {
      this.resetTabs.emit(null); // pass event to parent (app.component.ts) - resets tabs back to map
      console.log(locationData)
      // If no data returns, let user know via a message
      if(locationData.length === 0){
        this.locationFound = false;
      }
       else{
         this.locationFound = true;
         let foundLat = Number(locationData[0].lat);
         let foundLng = Number(locationData[0].lon);
         this.dataService.updateData(this.search.year, foundLat, foundLng);
      }
    }
    ).catch((err) => {this.locationFound = false;})
    // Reset each form control, clearing any errors on reset
    form.reset({
      "location": '',
      "year": new Date().getFullYear(),
    });
    Object.keys(form.controls).forEach(key =>{
      form.controls[key].setErrors(null)
     });
    };

    yearValidation(year: number){
      if(String(year).length > 4){
        console.log("Make input error");
      }
      else if(String(year).length == 4){
        if(year > this.maxYearValue || year < this.minYearValue){
          this.ngForm.controls['year'].setErrors({'incorrect': true});
        }

      }
    }

}
