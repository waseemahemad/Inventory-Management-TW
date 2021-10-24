import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from '../../services/admin-panel.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { EditUserDto } from '../../model/editUserDto';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})

export class EditUserComponent implements OnInit {
  userDetails  : any;
  editUserForm : FormGroup;
  editUserDto : EditUserDto;
  submitted : boolean = false;
  isMatched : boolean = false;
  constructor(
    private admServ : AdminPanelService,
    private fb : FormBuilder,
    private alerts : AlertsService,
    private router : Router
  ){}

  ngOnInit() {
    this.initForm();
    this.userDetails = JSON.parse(sessionStorage.getItem("euserInfo"));
    this.fc.id.setValue(this.userDetails[0].id);
    this.fc.username.setValue(this.userDetails[0].username);
    this.fc.name.setValue(this.userDetails[0].name);
    this.fc.email.setValue(this.userDetails[0].email);
    this.fc.mobile.setValue(this.userDetails[0].mobile);
    this.fc.roles.setValue(this.userDetails[0].roles[0]);
    this.fc.password.setValue(this.userDetails[0].password);
    this.fc.cPassword.setValue(this.userDetails[0].password);
    this.passwordConfirming();
  }

  passwordConfirming() {  
    if (this.editUserForm.controls.password.value === this.editUserForm.controls.cPassword.value) {
      this.isMatched =true;
    }else{
      this.isMatched =false;
    }
}

  initForm(){
    this.editUserForm = this.fb.group({
      id :['',[]],
      username :['',[Validators.required]],
      name :['',[Validators.required]],
      email :['',[Validators.required]],
      mobile :['',[Validators.required]],
      roles :['',[Validators.required]],
      password : ['',Validators.required],
      cPassword:['',[Validators.required]]
    });
  }

  public updateUser(){
    this.submitted =true;
    if(this.submitted && this.editUserForm.valid){
      let data ={
        id:this.userDetails[0].id,
        username : this.fc.username.value,
        name : this.fc.name.value,
        email : this.fc.email.value,
        mobile : this.fc.mobile.value,
        roles : [this.fc.roles.value],
        password : this.fc.password.value
      }
      this.admServ.updateUser(data).subscribe(res=>{
        if(res.code === 202){
          this.submitted = false;
          this.alerts.setMessage(res.message,'success');
          this.router.navigate(['list/user']);
        }
      },error=>{
        this.alerts.setMessage(error.error.message,'error');
      });
    }
  }

  get fc(){
    return this.editUserForm.controls;
  }
  
}

