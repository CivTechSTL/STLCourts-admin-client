import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-judge-edit-dialog',
  templateUrl: './judge-edit-dialog.component.html',
  styleUrls: ['./judge-edit-dialog.component.scss']
})
export class JudgeEditDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JudgeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
