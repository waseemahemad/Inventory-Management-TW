import { Component, OnInit } from '@angular/core';
import { ModuleManagementService } from 'src/app/module-management.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';
import { addModuleMasterDto } from 'src/app/model/addModuleMasterDto';

@Component({
  selector: 'app-new-master-module',
  templateUrl: './new-master-module.component.html',
  styleUrls: ['./new-master-module.component.css']
})
export class NewMasterModuleComponent implements OnInit {

  masterForm : FormGroup;
  dto : addModuleMasterDto={
    id : null,
    name : '',
    code : ''
  };
  submitted : boolean = false;
  constructor(
    private mmServ : ModuleManagementService,
    private fb : FormBuilder,
    private alerts : AlertsService,
    private router : Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  public initForm(){
    this.masterForm = this.fb.group({
      name : ['',[Validators.required]],
      code : ['',[]],
    });
  }

  public addModMaster(){
    this.submitted = true;
    this.assemble();
    if(this.submitted && this.masterForm.valid){
      this.mmServ.addMasterModule(this.dto).subscribe(res=>{
        this.submitted = false;
        if(res.code===201){
          this.alerts.setMessage(res.message,'success');
          this.router.navigate(['/admin/master']);
        }
      });
    }
  }

  public assemble(){
    this.dto.id = null;
    this.dto.name = this.fc.name.value;
    this.dto.code = this.fc.code.value;
  }

  get fc(){return this.masterForm.controls;}

}
