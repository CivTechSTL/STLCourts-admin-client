import {NgModule} from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AppComponent} from './app.component';
import {CourtComponent} from './court/court.component';
import {NotLoggedInComponent} from './not-logged-in/not-logged-in.component';
import {UserGuardService} from './services/user-guard.service';

const routes: Routes = [
  {path: 'court', component: CourtComponent, canActivate: [UserGuardService]},
  {path: 'signin', component: NotLoggedInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
