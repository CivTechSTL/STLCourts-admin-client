import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSigninComponent } from './google-signin.component';
import {UserService} from '../services/user.service';
import {MatDialog} from '@angular/material';
import {GoogleApiService} from 'ng-gapi';
import {DebugElement} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {By} from '@angular/platform-browser';

describe('GoogleSigninComponent', () => {
  const userServiceStub = {
    getCurrentUser: function() {
      return {
        isUserLoggedIn: function () {},
        getUserImageUrl: function() {}
      };
    },
    signIn: function() {},
    signOut: function() {}
  };

  const matDialogStub = {
    open: function() {},
    close: function() {}
  };

  const mockMatDialogRefConfirmTrue = {
    updatePosition: function(posObj: {}) {},
    afterClosed: function() {
      return new Observable(observer => {
        observer.next({logOut: true});
      });
    }
  };

  const mockMatDialogRefConfirmFalse = {
    updatePosition: function(posObj: {}) {},
    afterClosed: function() {
      return new Observable(observer => {
        observer.next({logOut: false});
      });
    }
  };

  const googleApiServiceStub = {
    onLoad: function () {
      return new Observable(observer => {
        observer.next();
      });
    }
  };

  let component: GoogleSigninComponent;
  let fixture: ComponentFixture<GoogleSigninComponent>;
  let de: DebugElement;
  let imgEl: HTMLImageElement;
  let el: HTMLElement;
  let injectedUserService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleSigninComponent ],
      providers: [ {provide: UserService, useValue: userServiceStub},
                   {provide: MatDialog, useValue: matDialogStub},
                   {provide: GoogleApiService, useValue: googleApiServiceStub}]
    })
    .compileComponents();
    injectedUserService = TestBed.get(UserService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the image in the html', async(() => {
    spyOn(component, 'loggedIn').and.returnValue(true);
    spyOn(component, 'loggedInImage').and.returnValue('someUrl');

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#loggedInProfileImage'));
    imgEl = de.nativeElement;
    expect(imgEl.src).toContain('someUrl');
  }));

  it( 'properly logs out', async( () => {
    spyOn(component, 'loggedIn').and.returnValue(true);
    spyOn(component.dialog, 'open').and.callFake(() => {
      return mockMatDialogRefConfirmTrue;
    });
    spyOn(injectedUserService, 'signOut');
    spyOn(mockMatDialogRefConfirmTrue, 'updatePosition');

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#loggedInProfileImage'));
    imgEl = de.nativeElement;
    imgEl.click();
    fixture.detectChanges();
    expect(component.dialog.open).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(mockMatDialogRefConfirmTrue.updatePosition).toHaveBeenCalled();
      expect(injectedUserService.signOut).toHaveBeenCalled();
    });
  }));

  it( 'should do nothing if logout dialog is canceled', async( () => {
    spyOn(component, 'loggedIn').and.returnValue(true);
    spyOn(component.dialog, 'open').and.callFake(() => {
      return mockMatDialogRefConfirmFalse;
    });
    spyOn(injectedUserService, 'signOut');
    spyOn(mockMatDialogRefConfirmFalse, 'updatePosition');

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#loggedInProfileImage'));
    imgEl = de.nativeElement;
    imgEl.click();
    fixture.detectChanges();
    expect(component.dialog.open).toHaveBeenCalled();
    fixture.whenStable().then(() => {
      expect(mockMatDialogRefConfirmFalse.updatePosition).toHaveBeenCalled();
      expect(injectedUserService.signOut).toHaveBeenCalledTimes(0);
    });
  }));

  it( 'properly logs in', async( () => {
    spyOn(component, 'loggedIn').and.returnValue(false);
    spyOn(injectedUserService, 'signIn');

    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#googleBtn'));
    el = de.nativeElement;
    el.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(injectedUserService.signIn).toHaveBeenCalled();
    });
  }));
});
