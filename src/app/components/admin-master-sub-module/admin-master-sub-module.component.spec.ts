import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMasterSubModuleComponent } from './admin-master-sub-module.component';

describe('AdminMasterSubModuleComponent', () => {
  let component: AdminMasterSubModuleComponent;
  let fixture: ComponentFixture<AdminMasterSubModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMasterSubModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMasterSubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
