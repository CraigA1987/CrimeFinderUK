import {Component, EventEmitter, Output, ViewChild} from '@angular/core'
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

  // Code deals with ensuring map renders - If user clicks off first tab before map loads, blocks rendering
  // This code block ensures the map will load next time its tab is in the view
  mapTabPressed = new EventEmitter<any>();  // Emit event when map tab is pressed, ensuring map is always created

  // When tab is changed, function calls. If the tab is the map tab, event triggers passing data to map component
  tabClick(eventData: any) {
    if(eventData.index === 0){
      this.mapTabPressed.emit();  // Emit event so subscribed components know about the map tab being pressed
    }
  }

}


