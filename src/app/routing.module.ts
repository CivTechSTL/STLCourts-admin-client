import {NgModule} from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { AppComponent} from './app.component';
import {CourtComponent} from './court/court.component';

const routes: Routes = [
  {path: 'court', component: CourtComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
