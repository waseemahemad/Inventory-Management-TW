import { Component, OnInit } from '@angular/core';
import { BankDto } from '../../model/bankDto';
import { PageDto } from '../../model/page-dto';
import { ReceiptService } from '../../services/receipt.service';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { PaymentService } from '../../services/payment.service';
import { ResponseDto } from '../../model/ResponseDto';
import { ReceiptSpecDto } from '../../model/receiptSpecDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-reciepts-bank',
  templateUrl: './reciepts-bank.component.html',
  styleUrls: ['./reciepts-bank.component.css']
})
export class RecieptsBankComponent implements OnInit {

  bankDto :Array<BankDto>;
  pageDto: PageDto = new PageDto(1, 10);
  receiptList : Array<any> = [];
  spec: any = {};
  searchForm : FormGroup;
  payspec: ReceiptSpecDto = {
    page :1 ,
    size :10 ,
    receiptNo :'' ,
    customerName :'' ,
    status :'' ,
    bankname :'' ,
    type :this.constant.BANK_TYPE ,
    paymentmode :'' ,
    accounttype:''
  }
  
  constructor(
    private receiptService : ReceiptService,
    private paymentService : PaymentService,
    private router: Router,
    private constant : Constants,
    private fb : FormBuilder,
    private loginService : LoginService,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getBankList();
    this.getList();
  };

  public initForm (){
    this.searchForm = this.fb.group({
      receiptNo : ['',[]],
      customerName : ['',[]],
      status : ['',[]],
      bankname : ['',[]],
      accounttype : ['',[]]
    });
  }

  public getBankList(){
    this.paymentService.getBankList().subscribe(result => {
      this.bankDto=result.data;
    })
  };
  public getList(){
    this.receiptService.getReceiptList(this.payspec).subscribe((response: ResponseDto) =>{
      this.pageDto.data = response.data.data;
      this.pageDto.totalCount = response.data.totalCount;
    })
  }

  pageChange(x){
    this.payspec.page = x;
    this.getList();
  }

  public search(){
    this.payspec.receiptNo = this.searchForm.controls.receiptNo.value;
    this.payspec.customerName = this.searchForm.controls.customerName.value;
    this.payspec.status = this.searchForm.controls.status.value;
    this.payspec.bankname = this.searchForm.controls.bankname.value;
    this.payspec.accounttype = this.searchForm.controls.accounttype.value;
    this.getList();
  }

  public clearSearch(){
    this.payspec.page =1 ;
    this.payspec.size =10 ;
    this.searchForm.controls.receiptNo.setValue('');
    this.searchForm.controls.customerName.setValue('');
    this.searchForm.controls.status.setValue('');
    this.searchForm.controls.bankname.setValue('');
    this.searchForm.controls.accounttype.setValue('');
    this.search();
  }

  stateChanged(evnt,payment){
    if(evnt.currentTarget.checked){
      this.receiptList.forEach(i=>{
        i.checked = false;
      });
      this.receiptList = [];
      payment.checked = true;
      evnt.currentTarget.checked = true;
      this.receiptList.push(payment);
    }else{
      var index = this.receiptList.indexOf(payment);
      this.receiptList.splice(index, 1);
    }
  }

  public editItem(){
    if(this.receiptList.length===1){
      let id;
      let status ;
      this.receiptList.forEach(rec=>{
          id = rec.id;
          status = rec.status;
      });
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['reciepts/edit/'+id+'/bank']);
      }else if (status == this.constant.AUTHORIZED) {
        this.alerts.setMessage("Receipt Can't Be Edited Once Authorized!",'warn');
        return;
      }else {
        this.router.navigate(['reciepts/edit/'+id+'/bank']);
      }
    }else{
      this.alerts.setMessage("Select One Reciept",'warn');
    }
  }

  
}
