import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModuleManagementService } from 'src/app/module-management.service';
import { moduleMasterSpecDto } from 'src/app/model/moduleMasterSpec';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-master-sub-module',
  templateUrl: './new-master-sub-module.component.html',
  styleUrls: ['./new-master-sub-module.component.css']
})
export class NewMasterSubModuleComponent implements OnInit {
  masters : any = [];
  masterSpec : moduleMasterSpecDto = {
    page : 1,
    size : 1000, 
    name : '',
    code : '',
  };
  submitted : boolean = false;
  subForm : FormGroup;
  constructor(
    private fb : FormBuilder,
    private mmServ : ModuleManagementService,
    private alerts : AlertsService,
    private router : Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.getMasters();
  }

  public initForm(){
    this.subForm = this.fb.group({
      id : [null,[]],
      name : ['',[Validators.required]],
      code : ['',[]],
      view : [0,[]],
      create : [0,[]],
      edit : [0,[]],
      delete : [0,[]],
      print : [0,[]],
      authorize : [0,[]],
      unAuthorize : [0,[]],
      ctq : [0,[]],
      cto : [0,[]],
      ctdn : [0,[]],
      cti : [0,[]],
      date : [0,[]],
      mmId : [null,[Validators.required]],
    });
  }

  public getMasters(){
    this.mmServ.listMasterModules(this.masterSpec).subscribe(res=>{
      if(res.code === 200){
        this.masters = res.data;
      }
    });
  }

  public addSubMod(){
    this.submitted = true;
    if(this.submitted && this.subForm.valid){
      this.mmServ.addSubMasterModule(this.subForm.value).subscribe(res=>{
        if(res.code===200){
          this.alerts.setMessage(res.message,'success');
          this.router.navigate(['/admin/sub-master']);
        }
      });
    }
  }

  get fc(){return this.subForm.controls};


}
