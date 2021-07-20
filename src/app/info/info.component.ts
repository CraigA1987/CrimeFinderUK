// Info component is used to display all of the information about crimes in the area
// A table format is used, allowing users to explore the data

import { Component, Input, OnInit} from '@angular/core';
import { DataService } from "src/app/data.service";

import {MatTableDataSource} from '@angular/material/table';

// Interface gives a template of the data to be stored in a CrimeData object
interface CrimeData {
    id : number;
    date: string;
    category: string;
    outcome: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})


export class InfoComponent implements OnInit{
  apiData: any;  // stores all retrieved api data
  crimeDataArray: Array<CrimeData> = [];  // array of crime data objects
  crimeNumber: number = 0;  // data used by template to show / hide content

  // Table Setup
  displayedColumns: string[] = ['Id', 'Date', 'Category', 'Outcome'];
  dataSource = new MatTableDataSource<CrimeData>(this.crimeDataArray);

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Subscribe to the data service current data varaible, ensuring component gets all data updates
    this.dataService.showCurrentData.subscribe(data => {
      this.crimeDataArray.length = 0; // clears all elements from the array
      this.apiData = data;
      this.apiData.forEach(crime => {
        // Map the data to a new object
        let mappedCrimeData: CrimeData = {
          category: crime.category,
          id:crime.id,
          date: crime.month,
          outcome: null,
        }
        // If outcome is null from api request, try / catch prevents the error
        try{
        mappedCrimeData.outcome = crime.outcome_status.category;
        }
        catch{
          mappedCrimeData.outcome = "Status update unavaliable";
        }
        this.crimeDataArray.push(mappedCrimeData);  // Push the CrimeData object into the data array
      });
        this.dataSource.data = this.crimeDataArray;  // update the table datasource with new crime data
        this.crimeNumber = this.dataSource.data.length;  // Update the crime number to show / hide template data
  })}
}


