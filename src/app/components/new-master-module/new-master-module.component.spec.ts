import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMasterModuleComponent } from './new-master-module.component';

describe('NewMasterModuleComponent', () => {
  let component: NewMasterModuleComponent;
  let fixture: ComponentFixture<NewMasterModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMasterModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMasterModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
