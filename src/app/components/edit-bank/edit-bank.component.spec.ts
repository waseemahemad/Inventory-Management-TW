import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankComponent } from './edit-bank.component';

describe('EditBankComponent', () => {
  let component: EditBankComponent;
  let fixture: ComponentFixture<EditBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
