import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccessManagementComponent } from './user-access-management.component';

describe('UserAccessManagementComponent', () => {
  let component: UserAccessManagementComponent;
  let fixture: ComponentFixture<UserAccessManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccessManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
