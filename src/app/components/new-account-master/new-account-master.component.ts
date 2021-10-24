import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccountGroupSpecDto } from 'src/app/model/accountGroupSpecDto';
import * as _ from 'underscore';
import { AccountSubDto } from 'src/app/model/AccountSubDto';
import { AccountSubSpecDto } from 'src/app/model/AccSubSpecDto';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAccountTypeModalComponent } from '../add-account-type-modal/add-account-type-modal.component';
import { AddAccountGroupComponent } from '../add-account-group/add-account-group.component';
import { AccTypeSpecDto } from 'src/app/model/AccTypeSpecDto';


@Component({
  selector: 'app-new-account-master',
  templateUrl: './new-account-master.component.html',
  styleUrls: ['./new-account-master.component.css']
})
export class NewAccountMasterComponent implements OnInit {
  accountForm : FormGroup;
  spec : AccountGroupSpecDto = {
    name : '',
    code : '',
    type : '',
    page : 0,
    size : 0,
    typeId:null
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
    private modalService: NgbModal,

  ) { }

  ngOnInit() {
    this.initForm();
    this.getAccGroup();
    this.getAccTypes();
  }

  public getAccTypes(){
    this.accountService.listAccountType(this.accTypeSpec).subscribe(res=>{
      if(res.code===200){
        this.accTypes = res.data;
      }
    });
  }
openAccountModal(){
  const modalRef = this.modalService.open(AddAccountTypeModalComponent);
    
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      this.getAccTypes();
      console.log(error);
    });
}
openGroupModal(){
  const modalRef = this.modalService.open(AddAccountGroupComponent);
    
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      this.getAccGroup();
      console.log(error);
    });
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

  public bind(){
    this.dataDto.type = null;
    this.dataDto.id = null;
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
    this.bind();
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

  public getGroupwithType(){
    if(this.dynamiccat.length>0){

    }else{
      this.spec.typeId = this.fc.accTypeId.value;
      this.getAccGroup();
    }
    
  }
  get fc(){return this.accountForm.controls;}
}