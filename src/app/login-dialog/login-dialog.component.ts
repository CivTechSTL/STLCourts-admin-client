import {Component} from '@angular/core';
import { MatDialogRef} from '@angular/material';
import {LogoutDialogComponent} from '../logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  constructor(public dialogRef: MatDialogRef<LogoutDialogComponent>) { }

}
