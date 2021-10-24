import { Component, OnInit } from '@angular/core';
import { JournalvoucherService } from '../../services/journalvoucher.service';
import { JournalVoucherSpecDto } from '../../model/journalVoucherSpecDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-journal-voucher',
  templateUrl: './journal-voucher.component.html',
  styleUrls: ['./journal-voucher.component.css']
})
export class JournalVoucherComponent implements OnInit {
  jvSpecDto : JournalVoucherSpecDto = {
    page : 1,
    size : 10,
    jvno : '',
    accounttype : '',
    contactname : '',
    status : '',
  };
  searchForm : FormGroup;
  journalVouchers : Array<any> = [];
  totalCount : any;
  arrayOfVouchers : Array<any> = [];
  constructor(
    private jvserv : JournalvoucherService,
    private fb : FormBuilder,
    private router : Router,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.listJournalVouchers();
  }

  public listJournalVouchers(){
    this.jvserv.listJournalEntries(this.jvSpecDto).subscribe(res=>{
      if(res.code===200){
        this.journalVouchers = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  };

  public initForm(){
    this.searchForm = this.fb.group({
      jvno :['',[]],
      accounttype :['',[]],
      contactname :['',[]],
      status :['',[]]
    });
  };

  pageChange(x){
    this.jvSpecDto.page = x;
    this.search();
  };

  public search(){
    this.jvSpecDto.jvno = this.sf.jvno.value;
    this.jvSpecDto.accounttype = this.sf.accounttype.value;
    this.jvSpecDto.contactname = this.sf.contactname.value;
    this.jvSpecDto.status = this.sf.status.value;
    this.listJournalVouchers();
  };

  public clearSearch(){
    this.sf.jvno.setValue('');
    this.sf.accounttype.setValue('');
    this.sf.contactname.setValue('');
    this.sf.status.setValue('');
    this.jvSpecDto.page = 1,
    this.jvSpecDto.size = 10,
    this.search();
  }


  toggeleItem(evnt,enq){
    if(evnt.currentTarget.checked){
      this.arrayOfVouchers.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfVouchers = [];
      enq.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfVouchers.push(enq);
    }else{
      var index = this.arrayOfVouchers.indexOf(enq);
      this.arrayOfVouchers.splice(index, 1);
    }  
  };
  
  
  edit(){
    if(this.arrayOfVouchers.length === 1){
      let id;
      this.arrayOfVouchers.forEach(element => {
        id = element.id;
      });
      this.router.navigate(['/journal/edit/'+id+'/voucher']);
    }else{
      this.alerts.setMessage("Please Select One Voucher !",'warn');
    }
  };

  get sf(){return this.searchForm.controls;}

}
