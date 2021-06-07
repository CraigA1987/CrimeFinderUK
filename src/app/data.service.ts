import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { BehaviorSubject, Subject } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl: string = "https://data.police.uk/api/crimes-at-location?";
  //date=2017-02&lat=51.50749&lng=0.1272";
  // NEED TO EDIT THIS Based on input from info.component. If no arguments, use a generic version based on central london at current year

  private currentData = new BehaviorSubject({});
  public showCurrentData = this.currentData.asObservable();

  constructor(private http: HttpClient) {}

  getInitialDataGeneric(){
    console.log("Hit");
    const currentYear = new Date().getFullYear();
    let updatedData = this.http
      .get(`https://data.police.uk/api/crimes-at-location?date=${currentYear - 1}-02&lat=51.50749&lng=0.1272`)
      .subscribe(res => {
        this.currentData.next(res);
      });
  }

  updateData(year: number, lat: number, long: number){
    let updatedData = this.http
    .get(`https://data.police.uk/api/crimes-at-location?date=${year}-02&lat=${lat}&lng=${long}`).subscribe(res => {
      this.currentData.next(res);
    });
  }

}

