import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Subject } from "rxjs";
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }



  updateData(year: number, month: number, lat: number, long: number) {
    let updatedData = this.http
      .get(`https://data.police.uk/api/crimes-at-location?date=${year}-${month}&lat=${lat}&lng=${long}`).subscribe(res => {
        this.currentData.next(res);
      }, error => { // If non recognised location - revert back to default values
        console.log(`NO DATA FOUND AT LOCATION, DEFAULTING TO BUCKINGHAM PALACE IN JAN ${year}`);
        let updatedData = this.http
          .get(`https://data.police.uk/api/crimes-at-location?date=${year}-01&lat=${this.defaultLat}&lng=${this.defaultLng}`)
          .subscribe(res => {
            this.currentData.next(res);
          })
      });
  }

}

