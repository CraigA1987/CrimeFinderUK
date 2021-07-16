import { Component, OnInit } from '@angular/core';
import { DataService } from "src/app/data.service";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  apiData: any;  // stores all retrieved api data
  crimeArray: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.showCurrentData.subscribe(data => {
      this.crimeArray.length = 0; // clears all elements from the array
      this.apiData = data;
      this.apiData.forEach(crime => {
        this.crimeArray.push(crime);  // push
      });
    })
    console.log("crime array data ====", this.crimeArray);
  }

}
