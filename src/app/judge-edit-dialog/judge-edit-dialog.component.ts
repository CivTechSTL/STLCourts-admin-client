import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { find } from 'lodash';

@Component({
  selector: 'app-judge-edit-dialog',
  templateUrl: './judge-edit-dialog.component.html',
  styleUrls: ['./judge-edit-dialog.component.scss']
})
export class JudgeEditDialogComponent implements OnInit {
  judgeNameOK = true;
  judgeName: string;

  constructor(
    public dialogRef: MatDialogRef<JudgeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  checkJudgeName(): void {
    const judge = find(this.data.judges, {judge: this.judgeName});
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
