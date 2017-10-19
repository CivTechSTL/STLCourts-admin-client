import { async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {MdButtonModule, MdMenuModule, MdIconModule} from '@angular/material';
import {Input} from '@angular/core';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {Location, CommonModule} from '@angular/common';
import { Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import { HeaderComponent } from './header.component';

@Component({
  template: ''
})
class DummyComponent {}

describe('HeaderComponent', function(){
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        MdButtonModule, MdMenuModule, MdIconModule,
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: '', component: DummyComponent}
        ])
      ],
      declarations: [ HeaderComponent, DummyComponent]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
  it('main logo click should route to home page',
    async(inject([Router, Location],( router: Router, location: Location) => {
      const fixture = TestBed.createComponent(HeaderComponent);
      fixture.detectChanges();

      fixture.debugElement.query(By.css('a')).nativeElement.click();
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/');
      });
    })));
});
