import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CourtComponent } from './court.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatIconModule, MatInputModule, MatToolbarModule, MatAutocompleteModule,
  MatRadioModule, MatDialog
} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, Input} from '@angular/core';

import {CourtsService} from '../services/courts.service';
import {Court} from '../models/court';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Judge} from '../models/judge';
import * as _ from 'lodash';
import {assertNotNull} from '@angular/compiler/src/output/output_ast';

enum PageAction {
  NONE,
  ADD,
  EDIT,
  DELETE
}

@Component({selector: 'app-judge', template: ''})
class JudgesStubComponent { @Input() judges: Judge[]; }

describe('CourtComponent', () => {
  let component: CourtComponent;
  let fixture: ComponentFixture<CourtComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const createCourt = function(id: number, name: string){
    const court = new Court();
    court.id = id;
    court.name = name;
    court.phone = '314.555.1212';
    court.latitude = 38.59729089;
    court.longitude = -90.54189364;

    return court;
  };

  const court1 = createCourt(1, 'First Court');
  const court2 = createCourt(2, 'Second Court');
  let courts: Court[];

  const courtsServiceStub = {
    getAll: function() {
      return new Observable(observer => {
        observer.next(courts);
      });
    },
    save: function(court: Court) {
      return new Observable(observer => {
        observer.next(court);
      });
    },
    delete: function(id: any) {
      return new Observable( observer => {
        observer.next(id);
      });
    }
  };

  const matDialogStub = {
    open: function() {},
    close: function() {}
  };

  const mockMatDialogRefConfirm = {
    afterClosed: function() {
      return new Observable(observer => {
        observer.next(true);
      });
    }
  };

  beforeEach(async(() => {
    courts  = [court1, court2];
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, FormsModule, MatInputModule, MatIconModule, MatToolbarModule, MatFormFieldModule,
                ReactiveFormsModule, MatAutocompleteModule, MatRadioModule],
      declarations: [ CourtComponent, JudgesStubComponent ],
      providers: [{provide: CourtsService, useValue: courtsServiceStub},
                  {provide: MatDialog, useValue: matDialogStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should assign courts', () => {
    expect(component.courts.length).toBe(2);
    expect(component.courts[0].name).toEqual(court1.name);
    expect(component.courts[1].name).toEqual(court2.name);
  });

  it('initializes correctly', () => {
    expect(component.showPageMessage).toBeFalsy();
    expect(component.showCourtForm).toBeFalsy();
    expect(component.showCourtSelector).toBeFalsy();
    expect(component.court.id).toBeNull();
    expect(component.court.name).toEqual('');
  });

  it('correctly sets up for adding court', async ( () => {
    de = fixture.debugElement.query(By.css('#addCourtIcon'));
    el = de.nativeElement;
    el.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.court.id).toBeNull();
      expect(component.currentAction).toBe(PageAction.ADD);
      expect(component.court.citationExpiresAfterDays).toBe(-1);
      expect(component.citationDoesNotExpire).toBeTruthy();
      expect(component.showPageMessage).toBeFalsy();
      expect(component.showCourtForm).toBeTruthy();
      expect(component.showCourtSelector).toBeFalsy();
    });
  }));

  it('correctly sets up for editing court', async ( () => {
    de = fixture.debugElement.query(By.css('#editCourtIcon'));
    el = de.nativeElement;
    el.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentAction).toBe(PageAction.EDIT);
      expect(component.courtSelectorPlaceholder).toEqual('Select court to be edited');
      expect(component.courtCtrl.value).toBe('');
      expect(component.showPageMessage).toBeFalsy();
      expect(component.showCourtForm).toBeFalsy();
      expect(component.showCourtSelector).toBeTruthy();
    });
  }));

  it('correctly sets up for deleting court', async ( () => {
    de = fixture.debugElement.query(By.css('#deleteCourtIcon'));
    el = de.nativeElement;
    el.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.currentAction).toBe(PageAction.DELETE);
      expect(component.courtSelectorPlaceholder).toEqual('Select court to be deleted');
      expect(component.courtCtrl.value).toBe('');
      expect(component.showPageMessage).toBeFalsy();
      expect(component.showCourtForm).toBeFalsy();
      expect(component.showCourtSelector).toBeTruthy();
    });
  }));

  it( 'correctly saves court', async( () => {
    component.showCourtForm = true;
    fixture.detectChanges();
    component.court = createCourt(4, 'created court');
    de = fixture.debugElement.query(By.css('#saveButton'));
    el = de.nativeElement;
    el.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.pageMessage).toEqual('created court saved');
      expect(component.showPageMessage).toBeTruthy();
      expect(component.showCourtForm).toBeFalsy();
      expect(component.showCourtSelector).toBeFalsy();
    });
  }));

  it( 'correctly saves and adds court new court', async( () => {
    component.showCourtForm = true;
    fixture.detectChanges();
    component.court = createCourt(null, 'created court');
    de = fixture.debugElement.query(By.css('#saveButton'));
    el = de.nativeElement;
    el.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.pageMessage).toEqual('created court saved');
      expect(component.showPageMessage).toBeTruthy();
      expect(component.showCourtForm).toBeFalsy();
      expect(component.showCourtSelector).toBeFalsy();
      const newCourt = _.find(component.courts, {'name': 'created court'});
      expect(newCourt.name).toEqual('created court');
    });
  }));

  it('correctly formats phone number', () => {
    component.court.phone = '(314) 222-6666';
    component.formatPhoneNumber();
    expect(component.court.phone).toEqual('314.222.6666');
  });

  it( 'correctly selects the court', async( () => {
    component.currentAction = PageAction.EDIT;
    component.showCourtSelector = true;
    fixture.detectChanges();

    const inputde = fixture.debugElement.query(By.css('#selectCourtInput'));
    inputde.triggerEventHandler('focusin', null);
    fixture.detectChanges();

    fixture.whenStable().then( () => {
      de = fixture.debugElement.query(By.css('mat-option'));
      el = de.nativeElement;
      el.click();
      fixture.detectChanges();
      expect(component.showPageMessage).toBeFalsy();
      expect(component.showCourtForm).toBeTruthy();
      expect(component.showCourtSelector).toBeFalsy();
    });
  }));

  it( 'should delete court', () => {
    spyOn(component.dialog, 'open').and.callFake(() => {
      return mockMatDialogRefConfirm;
    });

    component.currentAction = PageAction.DELETE;
    component.showCourtSelector = true;
    fixture.detectChanges();

    const inputde = fixture.debugElement.query(By.css('#selectCourtInput'));
    inputde.triggerEventHandler('focusin', null);
    fixture.detectChanges();

    fixture.whenStable().then( () => {
      de = fixture.debugElement.query(By.css('mat-option'));
      el = de.nativeElement;
      el.click();
      fixture.detectChanges();
      expect(component.pageMessage).toBe(court1.name + ' was removed');
      expect(component.courts.length).toBe(1);
      expect (component.courts[0].name).toEqual(court2.name);
      expect(component.showPageMessage).toBeTruthy();
      expect(component.showCourtForm).toBeFalsy();
      expect(component.showCourtSelector).toBeFalsy();
      expect(component.currentAction).toBe(PageAction.NONE);
    });
  });

  it( 'sets and resets daysUntilCitationExpires when radio group chages', () => {
    const court3 = createCourt(20, 'Third Court');
    court3.citationExpiresAfterDays = 10;
    courts  = [court1, court2, court3];

    component.showCourtSelector = true;
    fixture.detectChanges();

    const inputde = fixture.debugElement.query(By.css('#selectCourtInput'));
    inputde.triggerEventHandler('focusin', null);
    fixture.detectChanges();

    fixture.whenStable().then( () => {
      const des = fixture.debugElement.queryAll(By.css('mat-option'));
      el = des[2].nativeElement;
      el.click();
      fixture.detectChanges();
      expect(component.daysUntilCitationExpires).toEqual(10);
      fixture.debugElement.query(By.css('#shownTrueRB')).nativeElement.click();
      fixture.detectChanges();
      expect(component.daysUntilCitationExpires).toBeNull();
    });
  });
});
