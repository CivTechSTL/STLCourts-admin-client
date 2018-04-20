import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule} from '@angular/forms';
import {
  MatInputModule, MatIconModule, MatChipsModule, MatDialog
} from '@angular/material';

import { JudgeComponent } from './judge.component';
import {JudgesService} from '../services/judges.service';
import {Judge} from '../models/judge';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

describe('JudgeComponent', () => {
  let component: JudgeComponent;
  let fixture: ComponentFixture<JudgeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const judge1: Judge = new Judge('Albert One');
  judge1.id = 1;
  judge1.courtId = 10;
  const judge2: Judge = new Judge('Robert Two');
  judge1.id = 2;
  judge1.courtId = 10;
  const judges: Judge[] = [judge1, judge2];

  const judgesServiceStub = {
    delete: function(){}
  };

  const matDialogStub = {
    open: function() {},
    close: function() {}
  };

  const mockMatDialogRefConfirm = {
    afterClosed: function(){
      return new Observable(observer => {
        observer.next(true);
      });
    }
  };

  const mockMatDialogRefEdit = {
    afterClosed: function(){
      return new Observable(observer => {
        observer.next('Edited Judge');
      });
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, MatInputModule, MatIconModule, MatChipsModule],
      declarations: [ JudgeComponent ],
      providers: [{provide: JudgesService, useValue: judgesServiceStub},
        {provide: MatDialog, useValue: matDialogStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgeComponent);
    component = fixture.componentInstance;

    component.judges = judges;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should set judges correctly', () => {
    expect (component.judges.length).toBe(2);
    expect (component.judges[0].judge).toEqual(judge1.judge);
    expect (component.judges[1].judge).toEqual(judge2.judge);
  });

  it( 'should remove judge', () => {
    spyOn(component.dialog, 'open').and.callFake(() => {
      return mockMatDialogRefConfirm;
    });

    component.remove(judge1);
    fixture.detectChanges();
    expect(component.judges.length).toBe(1);
    expect (component.judges[0].judge).toEqual(judge2.judge);
  });

  it( 'should edit judge', () => {
    spyOn(component.dialog, 'open').and.callFake(() => {
      return mockMatDialogRefEdit;
    });

    component.edit(judge1);
    fixture.detectChanges();
    expect(judge1.judge).toEqual('Edited Judge');
  });

  it ( 'should add judge', async( () => {
    de = fixture.debugElement.query(By.css('#addJudgeInput'));
    el = de.nativeElement;
    el.focus();
    el.textContent = 'new judge';
    fixture.detectChanges();
    de.triggerEventHandler('blur', null);

    fixture.whenStable().then( () => {
      setTimeout(() => {
        expect(component.judges.length).toBe(3);
      }, 1000);
    });
  }));

  it ( 'should trigger warnings when adding duplicate judge', async( () => {
    de = fixture.debugElement.query(By.css('#addJudgeInput'));
    el = de.nativeElement;
    el.focus();
    el.textContent = judge1.judge;
    fixture.detectChanges();
    de.triggerEventHandler('blur', null);

    fixture.whenStable().then( () => {
      setTimeout(() => {
        de = fixture.debugElement.query(By.css('.ff-for-chip-list'));
        el = de.nativeElement;
        expect(el.className).toContain('warn');
        de = fixture.debugElement.query(By.css('p'));
        el = de.nativeElement;
        expect(el.className).toContain('warn');
      }, 1000);
    });
  }));
});
