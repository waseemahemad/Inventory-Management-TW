import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMasterSubModuleComponent } from './new-master-sub-module.component';

describe('NewMasterSubModuleComponent', () => {
  let component: NewMasterSubModuleComponent;
  let fixture: ComponentFixture<NewMasterSubModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMasterSubModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMasterSubModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
