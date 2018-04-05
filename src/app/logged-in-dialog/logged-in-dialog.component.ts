import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ApiGoogleSignInService} from '../services/api-google-sign-in.service';
import {ApiPrivilegesService} from '../services/api-privileges.service';


@Component({
  selector: 'app-logged-in-dialog',
  templateUrl: './logged-in-dialog.component.html',
  styleUrls: ['./logged-in-dialog.component.scss']
})
export class LoggedInDialogComponent implements OnInit {
  public profileName: string;
  public profileImage: string;
  public userRole: string;

  constructor(
    public dialogRef: MatDialogRef<LoggedInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiGoogleSignInService: ApiGoogleSignInService,
    private privilegeService: ApiPrivilegesService) { }

  logOut(): void {
      this.dialogRef.close({logOut: true});
  }

  ngOnInit() {
     this.profileName = this.apiGoogleSignInService.getUserName();
     this.profileImage = this.apiGoogleSignInService.getUserImage();
     this.privilegeService.getUserPrivilege().subscribe( result => {
       this.userRole = result.role;
     });
  }

}
