import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Judge} from '../models/judge';
import { FormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule} from '@angular/material';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';



import { JudgeEditDialogComponent } from './judge-edit-dialog.component';

describe('JudgeEditDialogComponent', () => {
  let component: JudgeEditDialogComponent;
  let fixture: ComponentFixture<JudgeEditDialogComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const judge1: Judge = new Judge('Albert One');
  judge1.id = 1;
  judge1.courtId = 10;
  const judge2: Judge = new Judge('Robert Two');
  judge1.id = 2;
  judge1.courtId = 10;
  const judges: Judge[] = [judge1, judge2];
  const dialogData: Object = {judges: judges, judge: judge1};
  const mockDialogRef:  Object = {close: function(returnData){}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, MatDialogModule, MatInputModule],
      declarations: [ JudgeEditDialogComponent],
      providers: [{provide: MAT_DIALOG_DATA, useValue: dialogData},
                  {provide: MatDialogRef, useValue: mockDialogRef}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should set judges correctly', () => {
    expect (component.data.judges.length).toBe(2);
    expect (component.data.judges[0].judge).toEqual(judge1.judge);
    expect (component.data.judges[1].judge).toEqual(judge2.judge);
  });

  it ('should set judge name correctly', () => {
    expect (component.data.judge).toEqual(judge1);
  });

  it( 'should fail Judge check', () => {
    component.judgeName = 'Robert Two';
    fixture.detectChanges();
    component.checkJudgeName();
    expect( component.judgeNameOK).toBeFalsy();
  });

  it ('should pass Judge check', () => {
    component.judgeName = 'Test Name';
    fixture.detectChanges();
    spyOn(component.dialogRef, 'close');
    component.checkJudgeName();
    expect(component.judgeNameOK).toBeTruthy();
    expect(component.dialogRef.close).toHaveBeenCalledWith(component.judgeName);
  });

  it ('should trigger warnings', async(() => {
    component.judgeName = 'Robert Two';
    fixture.detectChanges();
    component.checkJudgeName();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      de = fixture.debugElement.query(By.css('p'));
      el = de.nativeElement;
      expect(el.className).toContain('warn');
      de = fixture.debugElement.query(By.css('mat-form-field'));
      el = de.nativeElement;
      expect(el.className).toContain('warn');
    });
  }));
});
