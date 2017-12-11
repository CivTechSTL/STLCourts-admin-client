import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgeEditDialogComponent } from './judge-edit-dialog.component';

describe('JudgeEditDialogComponent', () => {
  let component: JudgeEditDialogComponent;
  let fixture: ComponentFixture<JudgeEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgeEditDialogComponent ]
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
});
