import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModuleManagementService } from 'src/app/module-management.service';
import { moduleMasterSpecDto } from 'src/app/model/moduleMasterSpec';
import { AlertsService } from 'angular-alert-module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-master-sub-module',
  templateUrl: './edit-master-sub-module.component.html',
  styleUrls: ['./edit-master-sub-module.component.css']
})
export class EditMasterSubModuleComponent implements OnInit {
  masters : any = [];
  masterSpec : moduleMasterSpecDto = {
    page : 1,
    size : 1000, 
    name : '',
    code : '',
  };
  submitted : boolean = false;
  subForm : FormGroup;
  subMasterData : any ;
  constructor(
    private fb : FormBuilder,
    private mmServ : ModuleManagementService,
    private alerts : AlertsService,
    private router : Router,
    private activatedRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    this.initForm();
    this.getMasters();
    let id = this.activatedRoute.snapshot.params['id'];
    this.getEditData(id);

  }

  public getEditData(id){
    this.mmServ.getSubMasterModuleById(id).subscribe(res=>{
      if(res.code===200){
        this.subMasterData = res.data;
        this.bindData(this.subMasterData);
      }
    });
  }

  public bindData(data){
    this.fc.id.setValue(data.id);
    this.fc.name.setValue(data.name);
    this.fc.code.setValue(data.code);
    this.fc.view.setValue(data.view);
    this.fc.create.setValue(data.create);
    this.fc.edit.setValue(data.edit);
    this.fc.delete.setValue(data.delete);
    this.fc.print.setValue(data.print);
    this.fc.authorize.setValue(data.authorize);
    this.fc.unAuthorize.setValue(data.unAuthorize);
    this.fc.ctq.setValue(data.ctq);
    this.fc.cto.setValue(data.cto);
    this.fc.ctdn.setValue(data.ctdn);
    this.fc.cti.setValue(data.cti);
    this.fc.date.setValue(data.date);
    this.fc.mmId.setValue(data.master.id);
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

