import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, forkJoin, of, Subject } from "rxjs";
import { map, catchError, } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currentData = new Subject();
  public showCurrentData = this.currentData.asObservable();
  // using asObservable() hides the data stream from components, preventing them from using .next(),
  // ensuring data is controlled from only this service

  // Default values for when no lat / long values are found - central london
  public defaultLat: number = 51.5014;
  public defaultLng: number = -0.1419;

  isLoading: Subject<boolean> = new Subject<boolean>(); // loading boolean to control loading spinner

  constructor(private http: HttpClient) { }



  updateData(year: number, lat: number, long: number) {
    // NEED TO PUT IN AN ALERT BOX WITH LOADING SPINNER DURING THIS!!!
    console.log("UPDATING DATA ACROSS APP");
    console.log("year === ", year, "lat ==== ", lat, "long =====", long);
    this.isLoading.next(true);
    const apiRequests = [];  // Hold all of the api request - one for each month
    for(let i = 1; i < 13; i++){  // loop 12 times
      // Crimes at a specific location, to the nearest pre-defined location
      apiRequests.push(this.http.get(`https://data.police.uk/api/crimes-at-location?date=${year}-${i}&lat=${lat}&lng=${long}`)
      // apiRequests.push(this.http.get(`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${long}&date=${year}-${i}`)
      .pipe(catchError(error => of(error))))
    }
    let crimeList: any = [];
    let crimeListFiltered: any = [];
    let completedCrimeList: any = [];
    let updatedData = forkJoin(apiRequests).subscribe(res => {
      console.log("Data from api", res);
      crimeList = res.filter(element => element.constructor === Array);  // remove error responses
      crimeListFiltered = crimeList.filter(element => element[0] !== undefined);  // remove null responses
      crimeListFiltered.forEach(crimeArray => {  // loop through each retreived crime array
        crimeArray.forEach(crime => {  // loop through each entry in each crime array, and push them into the one array
          completedCrimeList.push(crime);
        });
      });
      if(completedCrimeList === undefined){
        console.log(`NO DATA FOUND AT LOCATION, DEFAULTING TO BUCKINGHAM PALACE IN JAN ${year}`);
        let updatedData = this.http
          .get(`https://data.police.uk/api/crimes-at-location?date=${year}-01&lat=${this.defaultLat}&lng=${this.defaultLng}`)
          .subscribe(res => {
            this.currentData.next(res);
          })
      }
      else{
        this.currentData.next(completedCrimeList);
        console.log("CrimeList========", completedCrimeList);
        setTimeout(() => this.isLoading.next(false), 500);  // half a second delay on removal of loading bar
      }
      },
      // REMOVE ALL THIS CODE -> NEED TO PUT MESSAGES IN COMPONENETS IF NO CRIMES ARE FOUND NOT HERE!!!!
      error => { // If non recognised location - revert back to default values
        console.log(`NO DATA FOUND AT LOCATION, DEFAULTING TO BUCKINGHAM PALACE IN JAN ${year}`);
        let updatedData = this.http
          .get(`https://data.police.uk/api/crimes-at-location?date=${year}-01&lat=${this.defaultLat}&lng=${this.defaultLng}`)
          .subscribe(res => {
            this.currentData.next(res);
          })
      });
  }

  // Send string location to geocoding API
  doGeocoding(locationString: string): Promise<any>{
      console.log(locationString);
      let correctedString = locationString.split(' ').join('%20'); // API uses %20 as spaces
      correctedString = correctedString.split('+').join('%20'); // API uses %20 as spaces not '+'
      let geocodeRequest = new Promise((resolve, reject) => {
      this.http
          .get(`https://nominatim.openstreetmap.org/search/${correctedString}?format=json`)
          .toPromise()
          .then((res: any) => {
            console.log(res);
            // Success - return first array element returned from the API
            resolve(res);
          },
            err => {
              // Error - just send an empty array
              reject();
            }
          );
      });
      return geocodeRequest;

  }

}

