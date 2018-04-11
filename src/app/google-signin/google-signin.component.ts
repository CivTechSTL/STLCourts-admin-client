import {Component, NgZone} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LogOutDialogComponent} from '../log-out-dialog/log-out-dialog.component';
import {UserService} from '../services/user.service';
import {GoogleApiService} from 'ng-gapi';

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent {

  loggedIn(): boolean {
    return this.userService.getCurrentUser().isUserLoggedIn();
  }

  loggedInImage(): string {
    return this.userService.getCurrentUser().getUserImageUrl();
  }

  constructor(private userService: UserService,
              public dialog: MatDialog,
              private _ngZone: NgZone,
              private gapiService: GoogleApiService) {

    this.gapiService.onLoad().subscribe();
  }

  public signInWithGoogle() {
    this.userService.signIn();
  }

  logOutDialogClicked(): void {
    let dialogRef: any;

    // see: https://github.com/angular/material2/issues/9676
    this._ngZone.run(() => {
      dialogRef = this.dialog.open(LogOutDialogComponent, {
        minWidth: '250px',
      });

      dialogRef.updatePosition({ top: '20px', right: '20px' });
    });

    dialogRef.afterClosed().subscribe(logOut => {
        if (logOut.logOut) {
          this.userService.signOut();
        }
      },
      error => {
        console.log(error);
        this.userService.signOut();
      }
    );
  }
}
