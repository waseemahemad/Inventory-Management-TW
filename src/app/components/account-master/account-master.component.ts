import { Component, OnInit } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccMasterListSpecDto } from 'src/app/model/AccMasterListSpecDto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-account-master',
  templateUrl: './account-master.component.html',
  styleUrls: ['./account-master.component.css']
})
export class AccountMasterComponent implements OnInit {
  list : Array<any> = [];
  totalCount : any;
  listSpec : AccMasterListSpecDto = {
    category : '',
    masterid : null,
    selfid : null,
    name : '',
    code : null,
    page : 1,
    size : 10,
  };
  searchForm : FormGroup;
  arrayOfAccounts : any = [];
  constructor(
    private accountService : AccountsService,
    private fb : FormBuilder,
    private router : Router,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getList();
  }

  public getList(){
    this.accountService.forAccountsMasterLIst(this.listSpec).subscribe(res=>{
      if(res.code===200){
        this.list = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  }

  public initForm(){
    this.searchForm = this.fb.group({
      category : ['',[]],
      name : ['',[]],
      code : [null,[]],
    });
  }

  public search(){
    this.listSpec.category = this.searchForm.controls.category.value;
    this.listSpec.name = this.searchForm.controls.name.value;
    this.listSpec.code = this.searchForm.controls.code.value;
    this.getList();
  }

  public clear(){
    this.searchForm.controls.category.setValue('');
    this.searchForm.controls.name.setValue('');
    this.searchForm.controls.code.setValue(null);
    this.search();
  }

  toggeleItem(evnt,acc){
    if(evnt.currentTarget.checked){
      this.arrayOfAccounts.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfAccounts = [];
      acc.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfAccounts.push(acc);
    }else{
      var index = this.arrayOfAccounts.indexOf(acc);
      this.arrayOfAccounts.splice(index, 1);
    }  
  };
  edit(){
    if(this.arrayOfAccounts.length === 1){
      let id;
      this.arrayOfAccounts.forEach(acc => {
        id = acc.id;
    });
    this.router.navigate(['/accounts/'+id+'/edit']);
  }else{
    this.alerts.setMessage("Please Select One Account !",'warn');
  }
  };

  pageChange(x){
    this.listSpec.page = x;
    this.search();
  }

}
