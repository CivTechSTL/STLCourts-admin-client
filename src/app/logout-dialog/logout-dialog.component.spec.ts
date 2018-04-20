import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutDialogComponent } from './logout-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialogRef} from '@angular/material';
import {UserService} from '../services/user.service';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

const mockUser = {
  getUserName: function() { return 'someUserName'; },
  getUserImageUrl: function() { return 'someUrl'; },
  getUserRole: function() {
    return {
      role: 'someRole'
    };
  }
};

const userServiceStub = {
  getCurrentUser: function() {
    return mockUser;
  }
};

const matDialogStub = {
  close: function(val: any) {}
};

describe('LogoutDialogComponent', () => {
  let component: LogoutDialogComponent;
  let fixture: ComponentFixture<LogoutDialogComponent>;
  let de: DebugElement;
  let imgEl: HTMLImageElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ LogoutDialogComponent ],
      providers: [ {provide: UserService, useValue: userServiceStub},
                   {provide: MatDialogRef, useValue: matDialogStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it( 'should initialize correctly', async(() => {
    de = fixture.debugElement.query(By.css('#logoutDialogProfileImage'));
    imgEl = de.nativeElement;
    expect(imgEl.src).toContain('someUrl');

    de = fixture.debugElement.query(By.css('#logoutDialogUserName'));
    el = de.nativeElement;
    expect(el.textContent).toEqual('someUserName');

    de = fixture.debugElement.query(By.css('#logoutDialogUserRole'));
    el = de.nativeElement;
    expect(el.textContent).toEqual('somerole privileges');
  }));

  it ('should logout when logout is clicked', async( () => {
    spyOn(component.dialogRef, 'close');
    de = fixture.debugElement.query(By.css('#logoutDialogLogoutButton'));
    el = de.nativeElement;
    el.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith({logOut: true});
  }));
});
