/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import {Title} from '@angular/platform-browser';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: `app.component.html`
})
export class AppComponent implements OnInit {
  public name = 'STLCourts Admin App';

  constructor(
    public appState: AppState,
    private titleService: Title
  ) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
    this.titleService.setTitle(this.name);
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
