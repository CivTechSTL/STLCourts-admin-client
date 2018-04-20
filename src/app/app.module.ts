import {BrowserModule, Title} from '@angular/platform-browser';
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

import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from 'ng-gapi';

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
import { UserService} from './services/user.service';
import { RefreshTokenService} from './services/refresh-token.service';
import { ApiPrivilegesService} from './services/api-privileges.service';
import {JwtHttpInterceptor} from './interceptors/jwt-http-interceptor';
import { NotLoggedInComponent } from './not-logged-in/not-logged-in.component';

import { UserGuardService} from './services/user-guard.service';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '473553693292-s73tvaovrej8gfiijto1mk8ag30g8ck9.apps.googleusercontent.com',
  discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  scope: [
    'profile',
    'email'
  ].join(' ')
};

@NgModule({
  declarations: [
    AppComponent,
    CourtComponent,
    HeaderComponent,
    JudgeComponent,
    ConfirmDialogComponent,
    JudgeEditDialogComponent,
    FooterComponent,
    GoogleSigninComponent,
    NotLoggedInComponent,
    LoginDialogComponent,
    LogoutDialogComponent
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
    AppRoutingModule,
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
  ],
  entryComponents: [
    ConfirmDialogComponent,
    JudgeEditDialogComponent,
    LogoutDialogComponent,
    LoginDialogComponent
  ],
  providers: [
    Title,
    JwtService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtHttpInterceptor,
      multi: true
    },
    UserService,
    CourtsService,
    JudgesService,
    ApiGoogleSignInService,
    RefreshTokenService,
    ApiPrivilegesService,
    UserGuardService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
