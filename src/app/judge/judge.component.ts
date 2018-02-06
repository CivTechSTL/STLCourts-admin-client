import {Component, Input, Inject, OnInit} from '@angular/core';
import {Judge} from '../models/judge';
import {MatChipInputEvent} from '@angular/material';
import {ENTER} from '@angular/cdk/keycodes';
import { find } from 'lodash';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {JudgesService} from '../services/judges.service';
import {JudgeEditDialogComponent} from '../judge-edit-dialog/judge-edit-dialog.component';


@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent {
  @Input() judges: Judge[];
  newJudgeValid = true;

  separatorKeysCodes = [ENTER];

  add(event: MatChipInputEvent): void {
    this.newJudgeValid = true;
    const input = event.input;
    const value = event.value.trim();

    if ((value || '').trim()) {
      const judgeName = value.trim();

      if (this.isUniqueJudge(judgeName)) {
        const j = new Judge(judgeName);
        this.judges.push(j);
        input.value = '';
      }else {
        this.newJudgeValid = false;
      }
    }
  }

  remove(judge: Judge): void {
    const index = this.judges.indexOf(judge);

    if (judge.id !== null) {
      // confirm that user wants to really delete the judge if so delete it from the actual database
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: {message: 'Remove \'' + judge.judge + '\'? This will remove the judge from the database immediately.' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.judgesService.delete(judge.id);
          this.removeJudgeFromArray(index);
        }
      });
    }else {
      this.removeJudgeFromArray(index);
    }
  }

  edit(judge: Judge): void {
    const dialogRef = this.dialog.open(JudgeEditDialogComponent, {
      width: '250px',
      data: {judge: judge, judges: this.judges}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
        judge.judge = result;
      }
    });
  }

  private removeJudgeFromArray(index: number): void {
    if (index >= 0) {
      this.judges.splice(index, 1);
    }
  }

  private isUniqueJudge(newJudge: string): boolean {
    return (find(this.judges, {judge: newJudge})) ? false : true;
  }

  constructor(public dialog: MatDialog, private judgesService: JudgesService) {}

}
