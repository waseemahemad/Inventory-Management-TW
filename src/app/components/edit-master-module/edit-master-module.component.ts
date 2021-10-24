import { Component, OnInit } from '@angular/core';
import { ModuleManagementService } from 'src/app/module-management.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';
import { Router, ActivatedRoute } from '@angular/router';
import { addModuleMasterDto } from 'src/app/model/addModuleMasterDto';

@Component({
  selector: 'app-edit-master-module',
  templateUrl: './edit-master-module.component.html',
  styleUrls: ['./edit-master-module.component.css']
})
export class EditMasterModuleComponent implements OnInit {

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
    private router : Router,
    private activatedRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    this.initForm();
    let id = this.activatedRoute.snapshot.params['id'];
    this.getEditData(id);
  }

  public getEditData(id){
    this.mmServ.getMasterModuleById(id).subscribe(res=>{
      if(res.code===200){
        this.fc.name.setValue(res.data.name);
        this.fc.code.setValue(res.data.code);
        this.fc.id.setValue(res.data.id);
      }
    });
  }

  public initForm(){
    this.masterForm = this.fb.group({
      id : [null,[]],
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
    this.dto.id = this.fc.id.value;
    this.dto.name = this.fc.name.value;
    this.dto.code = this.fc.code.value;
  }

  get fc(){return this.masterForm.controls;}

}

