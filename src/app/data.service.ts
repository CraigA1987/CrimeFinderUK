import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { BehaviorSubject, Subject } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private currentData = new BehaviorSubject({});
  public showCurrentData = this.currentData.asObservable();

  constructor(private http: HttpClient) {}

  updateData(year: number, lat: number, long: number){
    let updatedData = this.http
    .get(`https://data.police.uk/api/crimes-at-location?date=${year}-02&lat=${lat}&lng=${long}`).subscribe(res => {
      this.currentData.next(res);
    }, error => { // If non recognised location - revert back to central london
      let updatedData = this.http
      .get(`https://data.police.uk/api/crimes-at-location?date=${year}-02&lat=${51.50749}&lng=${0.1272}`).subscribe(res => {
        this.currentData.next(res);
      })
    });
  }

}

