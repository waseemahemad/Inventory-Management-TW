import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccountGroupSpecDto } from 'src/app/model/accountGroupSpecDto';
import * as _ from 'underscore';
import { AccountSubDto } from 'src/app/model/AccountSubDto';
import { AccountSubSpecDto } from 'src/app/model/AccSubSpecDto';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { AccTypeSpecDto } from 'src/app/model/AccTypeSpecDto';


@Component({
  selector: 'app-edit-account-master',
  templateUrl: './edit-account-master.component.html',
  styleUrls: ['./edit-account-master.component.css']
})
export class EditAccountMasterComponent implements OnInit {
  accountForm : FormGroup;
  spec : AccountGroupSpecDto = {
    name : '',
    code : '',
    type : '',
    page : 0,
    size : 0,
    typeId : null
  };
    cat : any;
    value: number[]=[];
    accountList : any;
    dynamiccat:Array<any>=[];
    dataDto : any={};
    catSpec : AccountSubSpecDto ={
      category : '',
      masterid : null,
      selfid : null,
    };
    
    editData : any;
    accTypes : Array<any> =[];
    accTypeSpec : AccTypeSpecDto = {
      name : '',
      code : '',
      page : 0,
      size : 0,
    };

    submitted : boolean = false;
   
  constructor(
    private fb : FormBuilder,
    private accountService : AccountsService,
    private router : Router,
    private alerts : AlertsService,
    private activatedRoute : ActivatedRoute

  ) { }

  ngOnInit() {
    this.initForm();
    // this.getAccGroup();
    let id = this.activatedRoute.snapshot.params['id'];
    this.getEditData(id);
    this.getAccTypes();
  }
  public getAccTypes(){
    this.accountService.listAccountType(this.accTypeSpec).subscribe(res=>{
      if(res.code===200){
        this.accTypes = res.data;
      }
    });
  }

  public getEditData(id){
    this.accountService.getSubAccById(id).subscribe(res=>{
      if(res.code===200){
        this.editData = res.data;
        this.bindEditData(this.editData);
      }
    });
  }

  public bindEditData(data){
    this.fc.id.setValue(data.id);
    this.fc.name.setValue(data.name);
    this.fc.code.setValue(data.code);
    this.fc.category.setValue(data.category);
    this.fc.accTypeId.setValue(data.accmst.accountType.id);
    this.dynamiccat.push(data.accmst);
    data.setsubacct.forEach(item=>{
        this.dynamiccat.push(item);
    });
    this.getCategories();
  }

  public initForm(){
    this.accountForm = this.fb.group({
      id :[null,[]],
      name :['',[Validators.required]],
      code :['',[Validators.required]],
      category :['',[Validators.required]],
      accmstId :[null,[]],
      selfjoinid :[null,[]],
      accTypeId:[null,[Validators.required]]
    });
  };

  public getAccGroup(){
    this.accountService.listAccGroup(this.spec).subscribe(res=>{
      if(res.code===200){
        this.accountList = res.data;
        this.cat =_.pluck(res.data,'name');
      }
    });
  };

  public update(e){
    var id=Number(e.target.value) ;
    this.accountList.forEach(e => {
        if(e.id === id){
            this.dynamiccat.push({id:e.id,name:e.name});
            this.getCategories();
        }
    });
    
  }

  public getCategories(){
    this.catSpec.masterid = this.dynamiccat[0].id;
    if(this.dynamiccat.length > 1){
      this.catSpec.selfid = this.dynamiccat[this.dynamiccat.length - 1].id;
    }else{
      this.catSpec.selfid = 0;
    }
    this.catSpec.category ="Y";
    this.accountService.getCategories(this.catSpec).subscribe(val=>{
      if(val.code===200){
        this.accountList = [];
        this.accountList = val.data;
      }
    });
  }

  public remove(e,idx){
    var length =Number(this.dynamiccat.length);
    if(idx === 0 ){
      this.dynamiccat = [];
      this.getAccGroup();
    }else if(idx === length-1){
      this.dynamiccat.splice(idx,1);
      if(this.dynamiccat.length===0){
        this.getAccGroup();
      }else{
        this.getCategories();
      }
    }else{
      this.dynamiccat.splice(idx,length-idx);
      if(this.dynamiccat.length===0){
        this.getAccGroup();
      }else{
        this.getCategories();
      }
    }
      
  }

  public assembleData(){
    this.dataDto.type = null;
    this.dataDto.id = this.fc.id.value;
    this.dataDto.name = this.fc.name.value;
    this.dataDto.code = this.fc.code.value;
    this.dataDto.category = this.fc.category.value;
    this.dataDto.accmstId = this.dynamiccat[0].id;
    if(this.dynamiccat.length > 1){
      this.dataDto.selfjoinid = this.dynamiccat[this.dynamiccat.length - 1].id;
    }else{
      this.dataDto.selfjoinid = 0;
    }
    this.dataDto.accmst = null;
    this.dataDto.accTypeId = this.fc.accTypeId.value;
  }

  public submit(){
    this.submitted = true;
    this.assembleData();
    if(this.submitted && this.accountForm.valid){
      this.accountService.createSubAccount(this.dataDto).subscribe(res=>{
        this.submitted = false;
        if(res.code===201){
          this.alerts.setMessage(res.message,'success');
          this.router.navigate(['/accounts/list']);
        }
      });
    }
    
  }

  get fc(){return this.accountForm.controls;}
}