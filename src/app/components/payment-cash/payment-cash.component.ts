import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { PageDto } from '../../model/page-dto';
import { PaymentSlaveDto } from '../../model/paymentSlaveDto';
import { PaymentSpecDto } from '../../model/paymentSpecDto';
import { ResponseDto } from '../../model/ResponseDto';
import { Router } from '../../../../node_modules/@angular/router';
import * as _ from 'underscore';
import { Constants } from '../../commons/constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-payment-cash',
  templateUrl: './payment-cash.component.html',
  styleUrls: ['./payment-cash.component.css']
})
export class PaymentCashComponent implements OnInit {

  pageDto: any ={};
  paymentList : Array<any> = [];
  spec: any = {};
  payspec: PaymentSpecDto = {
    page:1 ,
    size:10 ,
    paymentno:'' ,
    grnno:'' ,
    contactname:'' ,
    status:'' ,
    bankname:'' ,
    type:this.constant.CASH_TYPE ,
    paymentmode:'' ,
    accounttype:''
  };
  searchForm : FormGroup;
  
  constructor(private paymentService : PaymentService,
    private router: Router,
    private constant : Constants,
    private fb : FormBuilder,
    private loginService : LoginService,
    private alerts  : AlertsService
    ) { }

  ngOnInit() {
    this.initForm();
    this.getList();
  }

  public initForm(){
    this.searchForm = this.fb.group({
      paymentno : ['',[]],
      contactname : ['',[]],
      status : ['',[]],
      paymentmode : ['',[]],
      accounttype : ['',[]],
    });
  };
  
  public getList(){
    this.paymentService.getPaymentList(this.payspec).subscribe((response: ResponseDto) =>{
      this.pageDto.data = response.data.data;
      this.pageDto.totalCount = response.data.totalCount;
    })
  }


  pageChange(x){
    this.payspec.page = x;
    this.getList();
  }

  public search(){
    this.payspec.paymentno = this.searchForm.controls.paymentno.value;
    this.payspec.contactname = this.searchForm.controls.contactname.value;
    this.payspec.status = this.searchForm.controls.status.value;
    this.payspec.paymentmode = this.searchForm.controls.paymentmode.value;
    this.payspec.accounttype = this.searchForm.controls.accounttype.value;
    this.getList();
  }

  public clearSearch(){
    this.payspec.page =1 ;
    this.payspec.size =10 ;
    this.searchForm.controls.paymentno.setValue('');
    this.searchForm.controls.contactname.setValue('');
    this.searchForm.controls.status.setValue('');
    this.searchForm.controls.paymentmode.setValue('');
    this.searchForm.controls.accounttype.setValue('');
    this.search();
  }

  stateChanged(evnt,payment){
    if(evnt.currentTarget.checked){
      this.paymentList.forEach(i=>{
        i.checked = false;
      });
      this.paymentList = [];
      payment.checked = true;
      evnt.currentTarget.checked = true;
      this.paymentList.push(payment);
    }else{
      var index = this.paymentList.indexOf(payment);
      this.paymentList.splice(index, 1);
    }
  
  }

  editpayment(){
    if(this.paymentList.length === 1){
      let id=  _.pluck(this.paymentList,'id');
      let status=  _.pluck(this.paymentList,'status');
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/payment/edit/'+id+'/cash']);
      }else if (status == this.constant.AUTHORIZED) {
        this.alerts.setMessage("Payment Can't Be Edited Once Authorized!",'warn');
        return;
      }else {
        this.router.navigate(['/payment/edit/'+id+'/cash']);
      }
    }else{
      this.alerts.setMessage('Please select one Payment','warn');
    }
  }

}
