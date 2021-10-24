import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterModuleComponent } from './admin-master-module.component';

describe('AdminMasterModuleComponent', () => {
  let component: AdminMasterModuleComponent;
  let fixture: ComponentFixture<AdminMasterModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMasterModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMasterModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
