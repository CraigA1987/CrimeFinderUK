import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DataService } from "src/app/data.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
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
    this.dataService.updateData(new Date().getFullYear() -1, 1, this.dataService.defaultLat, this.dataService.defaultLng);
    this.resetTabs.emit(null); // pass event to parent (app.component.ts);

  }

}
