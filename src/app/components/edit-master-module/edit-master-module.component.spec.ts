import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMasterModuleComponent } from './edit-master-module.component';

describe('EditMasterModuleComponent', () => {
  let component: EditMasterModuleComponent;
  let fixture: ComponentFixture<EditMasterModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMasterModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMasterModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
