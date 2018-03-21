import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule} from '@angular/material';

import { ConfirmDialogComponent } from './confirm-dialog.component';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const mockDialogRef:  Object = {close: function(returnData){}};
  const dialogData: Object = {message: 'My Message'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MatDialogModule, MatInputModule],
      declarations: [ ConfirmDialogComponent ],
      providers: [{provide: MAT_DIALOG_DATA, useValue: dialogData},
        {provide: MatDialogRef, useValue: mockDialogRef}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should load passed message correctly', () => {
    de = fixture.debugElement.query(By.css('mat-dialog-content p'));
    el = de.nativeElement;
    fixture.detectChanges();
    expect(el.textContent).toEqual('My Message');
  });

  it( 'should close with false when No button is clicked', async( () => {
    de = fixture.debugElement.query(By.css('#confirmNoButton'));
    el = de.nativeElement;
    spyOn(component.dialogRef, 'close');
    el.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  }));

  it( 'should close with true when Yes button is clicked', async( () => {
    de = fixture.debugElement.query(By.css('#confirmYesButton'));
    el = de.nativeElement;
    spyOn(component.dialogRef, 'close');
    el.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  }));
});
