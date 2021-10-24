import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';
import { CreateUserDto } from '../../model/createUserDto';
import { AdminPanelService } from '../../services/admin-panel.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  submitted = false;
  isMatched: boolean;
  userDto: CreateUserDto
  addUserForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private alerts: AlertsService,
    private router: Router,
    private aps: AdminPanelService,
  ) { }

  ngOnInit() {
    this.addUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      cPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }
  passwordConfirming() {

    if (this.addUserForm.controls.password.value === this.addUserForm.controls.cPassword.value) {
      this.isMatched = false;
      return true;
    } else {
      this.isMatched = true;
      return false;
    }
  }
  get f() { return this.addUserForm.controls; }

  addUser() {
    this.submitted = true;
    if (this.addUserForm.valid && this.passwordConfirming()) {
      this.makeData();
      this.aps.createUser(this.userDto).subscribe(response => {
        if (response.code == 201) {
          this.alerts.setMessage(response.message, 'success');
          this.router.navigate(['list/user']);
        }
      }, error => {
        this.alerts.setMessage(error.error.message,'error');
      })
    }
  }
  makeData() {
    this.userDto = {
      username: this.addUserForm.controls.username.value.toString(),
      password: this.addUserForm.controls.password.value.toString(),
      email: this.addUserForm.controls.email.value.toString(),
      mobile: this.addUserForm.controls.mobile.value.toString(),
      name: this.addUserForm.controls.name.value.toString(),
      roles: [this.addUserForm.controls.role.value.toString()],
      status: ''
    }
  }
}
