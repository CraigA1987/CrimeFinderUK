import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataService } from "src/app/data.service";

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

// Interface gives a template of how CrimeData should act
interface CrimeData {
    id : number;
    date: string;
    category: string;
    outcome: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})


export class InfoComponent implements OnInit, AfterViewInit{

  apiData: any;  // stores all retrieved api data
  crimeDataArray: Array<CrimeData> = [];  // array of crime data

  // Table Setup
  displayedColumns: string[] = ['Id', 'Date', 'Category', 'Outcome'];
  dataSource = new MatTableDataSource<CrimeData>(this.crimeDataArray);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private dataService: DataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
 }

  ngOnInit(): void {
    this.dataService.showCurrentData.subscribe(data => {
      console.log("DATA!!!!!!", data);
      this.crimeDataArray.length = 0; // clears all elements from the array
      this.apiData = data;
      this.apiData.forEach(crime => {
        // Map the data to a new object, passing this into an array to work as table data
        let mappedCrimeData: CrimeData = {
          category: crime.category,
          id:crime.id,
          date: crime.month,
          outcome: null,
        }
        // If outcome is null from api request, try / catch prevents the error
        try{
          mappedCrimeData.outcome = crime.outcome_status.category
        }
        catch{
          mappedCrimeData.outcome = "Status update unavaliable";
        }
        this.crimeDataArray.push(mappedCrimeData);
        this.dataSource.data = this.crimeDataArray;  // update the table datasource
      });
    })
    console.log("crime array data ====", this.crimeDataArray);
  }
}


