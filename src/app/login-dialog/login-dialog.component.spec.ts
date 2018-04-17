import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogComponent } from './login-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialogRef} from '@angular/material';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

const matDialogStub = {
  close: function(obj: {}) {}
};

describe('LoginDialogComponent', () => {
  let component: LoginDialogComponent;
  let fixture: ComponentFixture<LoginDialogComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ LoginDialogComponent ],
      providers: [{provide: MatDialogRef, useValue: matDialogStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should return true when login is clicked', async( () => {
    spyOn(component.dialogRef, 'close');
    de = fixture.debugElement.query(By.css('#googleLoginBtn'));
    el = de.nativeElement;
    el.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  }));

  it ('should return false when cancel is clicked', async( () => {
    spyOn(component.dialogRef, 'close');
    de = fixture.debugElement.query(By.css('#loginDialogCancelButton'));
    el = de.nativeElement;
    el.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  }));
});
