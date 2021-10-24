import { Component, OnInit } from '@angular/core';
import { JournalOpenigBalanceService } from '../../services/journal-openig-balance.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OpeningBalanceSpec } from '../../model/OpeningBalanceSpec';
import { Constants } from '../../commons/constant';
import { LoginService } from '../../services/login.service';
import { AppConstants } from '../../commons/app-constant';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-journal-opening-balance',
  templateUrl: './journal-opening-balance.component.html',
  styleUrls: ['./journal-opening-balance.component.css']
})
export class JournalOpeningBalanceComponent implements OnInit {
  
  searchForm : FormGroup;
  spec : OpeningBalanceSpec = {
    page : 1,
    size : 10,
    openingno : '',
    accounttype : '',
    accountname : '',
    status : '',
  };
  list :any;
  arrayOfOb : Array<any> = [];
  totalCount : any;

  constructor(
    private obServ : JournalOpenigBalanceService,
    private fb : FormBuilder,
    private constants : Constants,
    private loginService : LoginService,
    private router : Router,
    private alerts : AlertsService

  ) { }

  ngOnInit() {
    this.initForm();
    this.getList();
  }

  public initForm(){
    this.searchForm = this.fb.group({
      openingno : ['',[]],
      accounttype : ['',[]],
      accountname : ['',[]],
      status : ['',[]],
    });
  };

  public getList(){
    this.obServ.listOpeningBalance(this.spec).subscribe(res=>{
      if(res.code===200){
        this.list = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  };

  public pageChange(x){
    this.spec.page = x;
    this.search();
  }
  public search(){
    this.spec.openingno = this.fc.openingno.value;
    this.spec.accountname = this.fc.accountname.value;
    this.spec.accounttype = this.fc.accounttype.value;
    this.spec.status = this.fc.status.value;
    this.getList();
  };

  toggeleItem(evnt, opbl) {
    if (evnt.currentTarget.checked) {
      this.arrayOfOb.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfOb = [];
      opbl.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfOb.push(opbl);
    } else {
      var index = this.arrayOfOb.indexOf(opbl);
      this.arrayOfOb.splice(index, 1);
    }
  };

  edit(){
    if(this.arrayOfOb.length === 1){
      let id;
      let status;
      this.arrayOfOb.forEach(ob => {
        id = ob.id;
        status= ob.status;
      });
      
      if(status == this.constants.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/journal/edit/'+id+'/opening-balance']);
      }else if(status == this.constants.AUTHORIZED){
        this.alerts.setMessage("Opening Balance Can't Be Edited Once Authorized!",'warn');
        return;
      }
      else{
        this.router.navigate(['/journal/edit/'+id+'/opening-balance']);
      }
    }else{
      this.alerts.setMessage("Please Select One Opening Balance !",'warn');
    }
  };

  public clearSearch(){
    this.spec.page = 1;
    this.fc.openingno.setValue('');
    this.fc.accounttype.setValue('');
    this.fc.accountname.setValue('');
    this.fc.status.setValue('');
    this.search();
  }
  get fc(){return this.searchForm.controls}


}
