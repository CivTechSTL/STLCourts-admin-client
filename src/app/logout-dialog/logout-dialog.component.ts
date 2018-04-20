import {Component, OnInit} from '@angular/core';
import { MatDialogRef} from '@angular/material';
import { UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss']
})
export class LogoutDialogComponent implements OnInit {
  public profileName: string;
  public profileImage: string;
  public userRole: string;

  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>,
    private userService: UserService) { }

  logOut(): void {
    this.dialogRef.close({logOut: true});
  }

  ngOnInit() {
    const user: User = this.userService.getCurrentUser();
    this.profileName = user.getUserName();
    this.profileImage = user.getUserImageUrl();
    this.userRole = user.getUserRole().role;
  }
}

