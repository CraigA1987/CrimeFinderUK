import {Component, NgModule, VERSION} from '@angular/core'
import { HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser'
import {InfoComponent} from './info/info.component';
import {MapComponent} from './map/map.component';
import {SearchComponent} from './search/search.component';

// Angular Material
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [ AppComponent,
    InfoComponent,
    MapComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
