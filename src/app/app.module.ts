import {Component, NgModule, VERSION} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {InfoComponent} from './info/info.component';
import {MapComponent} from './map/map.component';
import {SearchComponent} from './search/search.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [ AppComponent,
    InfoComponent,
    MapComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
