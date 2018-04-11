import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef} from '@angular/material';
import {UserService} from '../services/user.service';
import {LogOutDialogComponent} from '../log-out-dialog/log-out-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LogOutDialogComponent>) { }

  ngOnInit() {
  }

}
