import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenuModule, MatIconModule, MatToolbarModule, MatInputModule, MatRadioModule,
         MatTooltipModule, MatAutocompleteModule
} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import { FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { CourtsService } from './services/courts.service';


import { AppComponent } from './app.component';
import { CourtComponent } from './court/court.component';

import { AppRoutingModule} from './routing.module';
import { HeaderComponent } from './header/header.component';
import { JudgeComponent } from './judge/judge.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {JudgesService} from './services/judges.service';
import { JudgeEditDialogComponent } from './judge-edit-dialog/judge-edit-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { ApiGoogleSignInService} from './services/api-google-sign-in.service';
import { JwtService} from './services/jwt.service';

import {JwtHttpInterceptor} from './interceptors/jwt-http-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    CourtComponent,
    HeaderComponent,
    JudgeComponent,
    ConfirmDialogComponent,
    JudgeEditDialogComponent,
    FooterComponent,
    GoogleSigninComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatRadioModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    AppRoutingModule
  ],
  entryComponents: [
    ConfirmDialogComponent,
    JudgeEditDialogComponent
  ],
  providers: [
    JwtService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtHttpInterceptor,
      multi: true
    },
    CourtsService,
    JudgesService,
    ApiGoogleSignInService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
