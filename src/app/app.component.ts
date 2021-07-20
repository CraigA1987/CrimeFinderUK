import {Component, ViewChild} from '@angular/core'
import { MatTabGroup } from '@angular/material/tabs';
import {BrowserModule} from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('tabs') tabsGroup: MatTabGroup;  // Reference to tabsGroup in template

  constructor() { }

  // When reset tabs event is emitted from child search component (via @Output),
  // app.component calls the reset tabs function via the template
  resetTabs(){
    this.tabsGroup.selectedIndex = 0;   // Resets the tab choice back to the map tab
  }

}


