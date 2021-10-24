import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountTypeModalComponent } from './add-account-type-modal.component';

describe('AddAccountTypeModalComponent', () => {
  let component: AddAccountTypeModalComponent;
  let fixture: ComponentFixture<AddAccountTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAccountTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccountTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
