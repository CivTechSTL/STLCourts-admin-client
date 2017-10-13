import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdMenuModule, MdIconModule, MdToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { CourtComponent } from './court/court.component';

import { AppRoutingModule} from './routing.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    CourtComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MdButtonModule,
    MdMenuModule,
    MdIconModule,
    MdToolbarModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
