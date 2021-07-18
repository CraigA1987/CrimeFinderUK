import {Component, ViewChild} from '@angular/core'
import { MatTabGroup } from '@angular/material/tabs';
import {BrowserModule} from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('tabs') tabsGroup: MatTabGroup;

  constructor() { }

  // Function is passed to child component
  resetTabs(){
    this.tabsGroup.selectedIndex = 0;
  }

}


