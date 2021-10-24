import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMasterSubModuleComponent } from './edit-master-sub-module.component';

describe('EditMasterSubModuleComponent', () => {
  let component: EditMasterSubModuleComponent;
  let fixture: ComponentFixture<EditMasterSubModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMasterSubModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMasterSubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
