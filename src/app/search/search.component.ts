import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DataService } from "src/app/data.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output('resetTabs') resetTabs: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log("search component created");
  }

  onUpdate(){
    console.log("Updated");
    // switch to map tab
    this.resetTabs.emit(null); // pass event to parent (app.component.ts);
    this.dataService.updateData(new Date().getFullYear() -1, 1, this.dataService.defaultLat, this.dataService.defaultLng);
  }

}
