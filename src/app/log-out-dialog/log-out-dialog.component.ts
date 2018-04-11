import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UserService} from '../services/user.service';
import {User} from '../models/user';


@Component({
  selector: 'app-log-out-dialog',
  templateUrl: './log-out-dialog.component.html',
  styleUrls: ['./log-out-dialog.component.scss']
})
export class LogOutDialogComponent implements OnInit {
  public profileName: string;
  public profileImage: string;
  public userRole: string;

  constructor(
    public dialogRef: MatDialogRef<LogOutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
