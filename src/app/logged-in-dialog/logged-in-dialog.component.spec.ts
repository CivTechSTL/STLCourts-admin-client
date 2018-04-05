import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInDialogComponent } from './logged-in-dialog.component';

describe('LoggedInCardComponent', () => {
  let component: LoggedInDialogComponent;
  let fixture: ComponentFixture<LoggedInDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedInDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
