import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {MatButtonModule, MatMenuModule} from '@angular/material';
import {RouterLinkStubDirective} from '../../testing/router-stubs';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let linkDes: DebugElement[];
  let links: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatMenuModule],
      declarations: [ HeaderComponent, RouterLinkStubDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates home when logo clicked', () => {
    linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
    links = linkDes.map(del => del.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);

    const homeLinkDe = linkDes[0];
    const homeLink = links[0];

    homeLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(homeLink.navigatedTo).toBe('/');
  });

  it('navigates to court', () => {
    de = fixture.debugElement.query(By.css('#manageButton'));
    el = de.nativeElement;
    el.click();
    fixture.detectChanges();

    fixture.whenStable().then( () => {
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(del => del.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
      const courtLinkDe = linkDes[1];
      const courtLink = links[1];

      courtLinkDe.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(courtLink.navigatedTo).toBe('/court');
    });
  });
});
