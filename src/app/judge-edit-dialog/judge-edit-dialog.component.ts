import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-judge-edit-dialog',
  templateUrl: './judge-edit-dialog.component.html',
  styleUrls: ['./judge-edit-dialog.component.scss']
})
export class JudgeEditDialogComponent implements OnInit {
  judgeNameOK = true;
  judgeName: string;
  test: any;

  constructor(
    public dialogRef: MatDialogRef<JudgeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  checkJudgeName(): void {
    const judge = _.find(this.data.judges, {judge: this.judgeName});
    this.test = judge;
    if (judge && (judge !== this.data.judge)) {
      this.judgeNameOK = false;
    }else {
      this.judgeNameOK = true;
      this.dialogRef.close(this.judgeName);
    }
  }

  ngOnInit() {
    this.judgeName = this.data.judge.judge;
  }

}
