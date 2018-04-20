import {Component, NgZone} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LogoutDialogComponent} from '../logout-dialog/logout-dialog.component';
import {UserService} from '../services/user.service';
import {GoogleApiService} from 'ng-gapi';

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})

export class GoogleSigninComponent {
  constructor(private userService: UserService,
              public dialog: MatDialog,
              private _ngZone: NgZone,
              private gapiService: GoogleApiService) {

    this.gapiService.onLoad().subscribe();
  }

  loggedIn(): boolean {
    return this.userService.getCurrentUser().isUserLoggedIn();
  }

  loggedInImage(): string {
    return this.userService.getCurrentUser().getUserImageUrl();
  }

  public signInWithGoogle() {
    this.userService.signIn();
  }

  logOutDialogClicked(): void {
    let dialogRef: any;

    // see: https://github.com/angular/material2/issues/9676
    this._ngZone.run(() => {
      dialogRef = this.dialog.open(LogoutDialogComponent, {
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
