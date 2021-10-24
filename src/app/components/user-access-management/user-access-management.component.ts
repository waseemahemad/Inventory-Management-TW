import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from 'src/app/services/admin-panel.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ModuleManagementService } from 'src/app/module-management.service';
import { moduleMasterSpecDto } from 'src/app/model/moduleMasterSpec';
import { UserAccessSlaveDto } from '../../model/userAccessSlaveDto';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { UserAccessSpecDto } from 'src/app/model/userAccessSpecDto';

@Component({
  selector: 'app-user-access-management',
  templateUrl: './user-access-management.component.html',
  styleUrls: ['./user-access-management.component.css']
})
export class UserAccessManagementComponent implements OnInit {
  public slaveTab: number = 44;
  public slash = "-";
  submitted: boolean = false;
  constructor(
    private aps: AdminPanelService,
    private fb: FormBuilder,
    private mmServ: ModuleManagementService,
    private router: Router,
    private alerts: AlertsService

  ) { }
  accessSpec: UserAccessSpecDto;
  masterListSpec: moduleMasterSpecDto = {
    page: 1,
    size: 1000,
    name: '',
    code: '',
  };

  listSpec = {
    page: 1,
    size: 1000,
  };
  userList: any;
  listMasters: any = [];
  subMasts: any = [];
  accessForm: FormGroup;

  ngOnInit() {
    this.initForm();
    this.getUserList();
    this.getMasterList();
    this.fc.useraccessslave.reset();
  }

  public initForm() {
    this.accessForm = this.fb.group({
      id: [null, []],
      userId: [null, [Validators.required]],
      moduleId: [null, [Validators.required]],
      masteraccess : [1,[]],
      useraccessslave: this.fb.array([this.initAccessSlave()])
    });
    this.fc.moduleId.valueChanges.subscribe(val => {
      // this.fc.userId.setValue(null);
      if(this.fc.userId.value === null){
        this.getSubMasters(val);
      }else{
        this.getAssignedAccess();
      }
    });
    this.fc.userId.valueChanges.subscribe(val => {
      if (this.fc.moduleId.value !== null && this.fc.moduleId.value !== '' && this.fc.moduleId.value !== undefined) {
        this.getAssignedAccess();
      }
    });
  }

  public initAccessSlave(): FormGroup {
    return this.fb.group({
      id: [null,[]],
      view: [0,[]],
      create: [0,[]],
      edit: [0,[]],
      canDelete: [0,[]],
      print: [0,[]],
      authorize: [0,[]],
      unAuthorize: [0,[]],
      ctq: [0,[]],
      cto: [0,[]],
      ctdn: [0,[]],
      cti: [0,[]],
      date: [0,[]],
      userAccessId: [null,[]],
      moduleSubMasterId: [null,[]],
      subModName: ['',[]]
    });
  }

  public getAssignedAccess() {
    this.accessSpec = {
      userId: this.fc.userId.value,
      moduleId: this.fc.moduleId.value,
    }

    this.mmServ.getUserAccessByModuleId(this.accessSpec).subscribe(res => {
      this.fc.id.reset();
      if (res.code === 200) {
        if( res.data.length > 0){
          this.fc.id.setValue(res.data[0].id);
          this.fc.masteraccess.setValue(res.data[0].masteraccess);
          // this.fc.userId.setValue(res.data[0].user.id);
          // this.fc.moduleId.setValue(res.data[0].master.id);
          this.bindData(res.data[0].useraccessslave,'getGrantedAccess');
        }else{
          this.getSubMasters(this.fc.moduleId.value);
        }
      }
    });
  }

  public getMasterList() {
    this.mmServ.listMasterModules(this.masterListSpec).subscribe(res => {
      if (res.code === 200) {
        this.listMasters = res.data;
      }
    });
  }

  public getUserList() {
    this.aps.getUserList(this.listSpec).subscribe(result => {
      this.userList = result.data.data;
    }, error => {
      console.log(error);
    });
  }

  public getSubMasters(id) {
    this.mmServ.getSubMasterModuleByMasterId(id).subscribe(res => {
      if (res.code === 200) {
        this.subMasts = res.data;
        this.fc.id.reset();
        this.bindData(this.subMasts,'getSubMasters');
      }
    });
  }

  public makeData() {
    return {
      id: this.fc.id.value,
      userId: this.fc.userId.value,
      moduleId: this.fc.moduleId.value,
      masteraccess: this.fc.masteraccess.value,
      useraccessslave: this.fc.useraccessslave.value
    }
  }
  public submit() {
    this.submitted = true;
    if(this.accessForm.valid)
    this.mmServ.assignUserAccess(this.makeData()).subscribe(res => {
      if (res.code === 201) {
        this.alerts.setMessage(res.message, 'success');
        // this.router.navigate(['']);
      }
    });
  }
  public bindData(data,from) {
    //this.initAccessSlave();
    let useraccessslaveDto: FormArray = <FormArray>this.accessForm.controls.useraccessslave;
    // useraccessslaveDto.reset();
    // let index = 0;
    // useraccessslaveDto.controls.forEach(e => {
    //   useraccessslaveDto.removeAt(index);
    //   index++;
    // });
    while (useraccessslaveDto.length !== 0) {
      useraccessslaveDto.removeAt(0)
    }
    console.log(useraccessslaveDto.controls);
    data.forEach(element => {
      let group = this.initAccessSlave();
      
      let id: FormControl = <FormControl>group.controls['id'];
      from==='getGrantedAccess'  ? id.setValue(element.id) : id.setValue(null);;
      
      let view: FormControl = <FormControl>group.controls['view'];
      view.setValue(element.view);
      
      let create: FormControl = <FormControl>group.controls['create'];
      create.setValue(element.create);
      
      let edit: FormControl = <FormControl>group.controls['edit'];
      edit.setValue(element.edit);
      
      let canDelete: FormControl = <FormControl>group.controls['canDelete'];
      from==='getGrantedAccess' ? canDelete.setValue(element.canDelete) : canDelete.setValue(element.delete);
      
      
      let print: FormControl = <FormControl>group.controls['print'];
      print.setValue(element.print);
      
      let authorize: FormControl = <FormControl>group.controls['authorize'];
      authorize.setValue(element.authorize);
      
      let unAuthorize: FormControl = <FormControl>group.controls['unAuthorize'];
      unAuthorize.setValue(element.unAuthorize);
      
      let ctq: FormControl = <FormControl>group.controls['ctq'];
      ctq.setValue(element.ctq);
      
      let cto: FormControl = <FormControl>group.controls['cto'];
      cto.setValue(element.cto);
      
      let ctdn: FormControl = <FormControl>group.controls['ctdn'];
      ctdn.setValue(element.ctdn);
      
      let cti: FormControl = <FormControl>group.controls['cti'];
      cti.setValue(element.cti);
      
      let date: FormControl = <FormControl>group.controls['date'];
      date.setValue(element.date);
      
      let userAccessId: FormControl = <FormControl>group.controls['userAccessId'];
      userAccessId.setValue(element.userAccessId);
      
      let moduleSubMasterId: FormControl = <FormControl>group.controls['moduleSubMasterId'];
      from==='getGrantedAccess' ? moduleSubMasterId.setValue(element.moduleSubMasterId) : moduleSubMasterId.setValue(element.id);
      
      let subModName: FormControl = <FormControl>group.controls['subModName'];
      subModName.setValue(element.name);
      
      useraccessslaveDto.push(group);
    });
  };

  get fc() { return this.accessForm.controls; }

}
