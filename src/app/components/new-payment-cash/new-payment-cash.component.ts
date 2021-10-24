import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { Constants } from '../../commons/constant';
import { SalesService } from '../../services/sales.service';
import * as _ from 'underscore';
import { Observable } from '../../../../node_modules/rxjs';
import { debounceTime, distinctUntilChanged, map } from '../../../../node_modules/rxjs/operators';
import { PaymentDto } from '../../model/paymentDto';
import { PaymentSlaveDto } from '../../model/paymentSlaveDto';
import { PurchaseInvoiceDto } from '../../model/purchaseInvoiceDto';
import { PaymentService } from '../../services/payment.service';
import { ResponseDto } from '../../model/ResponseDto';
import { Router } from '../../../../node_modules/@angular/router';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AlertsService } from 'angular-alert-module';
import { AccMasterListSpecDto } from 'src/app/model/AccMasterListSpecDto';
import { AccountsService } from 'src/app/services/accounts.service';
import { UserAccessService } from 'src/app/user-access.service';


@Component({
  selector: 'app-new-payment-cash',
  templateUrl: './new-payment-cash.component.html',
  styleUrls: ['./new-payment-cash.component.css']
})
export class NewPaymentCashComponent implements OnInit {

  cashPaymentForm: FormGroup;
  submitted: boolean = false;
  contactSpecautoDto: ContactSpecDto;
  vendorDto: any = [];
  vendorName: Array<string> = [];
  paymentDto: PaymentDto;
  paymentSlaveDto: Array<PaymentSlaveDto> = [];
  dynamicpaymentSlaveDto: Array<PaymentSlaveDto> = [];
  slaveDto: PaymentSlaveDto;
  grnDto: Array<PurchaseInvoiceDto>;
  totalAmounts : number=0;
  isAuthorized : boolean = false;
  listSpec: AccMasterListSpecDto = {
    category: 'N',
    masterid: null,
    selfid: null,
    name: '',
    code: null,
    page: 1,
    size: 1000,
  };
  accList :Array<any> = [];
  accountsSelected : boolean = false;
  vendorSelected : boolean = false;
  accountName : Array<any> = [];
  isReadOnly : boolean = false;



  constructor(private fb: FormBuilder,
    private enquiryService: SalesService,
    private constants: Constants,
    private paymentService: PaymentService,
    private router: Router,
    private loginService : LoginService,
    private alerts : AlertsService,
    private accServ : AccountsService,
    private uaServ : UserAccessService
    ) { }

  // typeahed for Vendor NAME
  searchVendor = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.vendorName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
    searchAccount = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.accountName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  ngOnInit() {
    this.initForm();
    this.getVoucherNo();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('payments-cash-date');
  }

  public onTypeSelect(event){
    if(event.currentTarget.value === this.constants.ACCOUNTS){
      this.vendorSelected = false;
      this.accountsSelected = true;
      this.f.contactId.setValue(null);
      this.f.contactName.setValue('');
      this.getAccList();
    }else if(event.currentTarget.value === this.constants.VENDOR){
      this.accountsSelected = false;
      this.vendorSelected = true;
      this.f.accountId.setValue(null);
      this.f.accountName.setValue('');
      this.typeAhedVendor();
    }else{
      this.accountsSelected = false;
      this.vendorSelected = false;
    }
  }

  public getAccList(){
    this.accServ.listAccounts(this.listSpec).subscribe(res=>{
      if(res.code === 200){
        this.accList = res.data.data;
        this.accountName = _.pluck(this.accList, 'name');
      }
    });
  }

  public initForm() {
    this.cashPaymentForm = this.fb.group({
      paymentno: ['', [Validators.required]],
      paymentdate: [this.constants.convert(new Date), [Validators.required]],
      type_: ['', []],
      chequeno: ['', []],
      paymentmode: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      discount: [null, []],
      paidAmt: [null, []],
      remainingAmt: [null, []],
      status: ['', []],
      contactId: [null, []],
      bankId: [null, []],
      contactName: ['', []],
      totalamount :[null,[]],
      accountName: ['',[]],
      accountId: [null,[]],
      accounttype:['',[Validators.required]],
    });

  }

  public getVoucherNo() {
    this.enquiryService.getEntityId(this.constants.CASH_PAYMENT).subscribe(result => {
      this.f.paymentno.setValue(result.message);
    })
  }
  public typeAhedVendor() {
    this.contactSpecautoDto = {
      "contactname": "",
      "companyName": "",
      "displayName": "",
      "type": this.constants.VENDOR,
      "email": "",
      "page": 1,
      "size": 100
    }
    this.enquiryService.getCustomerList(this.contactSpecautoDto).subscribe(result => {
      this.vendorDto = result.data;
      this.vendorName = _.pluck(this.vendorDto, 'displayName');
    })
  };
  public selectedVendor(cust) {
    this.vendorDto.forEach(element => {
      if (element.displayName === cust.item) {
        this.f.contactId.setValue(element.id);
        this.getPendinginvoice(element.id);
      }
    });
  }

  public selectedAccount(acc) {
    this.accList.forEach(element => {
      if (element.name === acc.item) {
        this.f.accountId.setValue(element.id);
        // this.getPendinginvoice(element.id);
      }
    });
  }
  public getPendinginvoice(id) {
    this.paymentSlaveDto = [];
    this.paymentService.getPendingInvoice(id).subscribe(result => {
      this.grnDto = result.data;
      this.setpendingInvoice();
    })
  }
  public setpendingInvoice() {
    this.grnDto.forEach(e => {
      this.add(e);
    })
  };
  add(e) {
    this.slaveDto = {
      id: null,
      adjustmentAmt: 0,
      amount: e.netAmt,
      balance: e.remainingAmt,
      advanceAmt: e.advanceAmt,
      total: e.total,
      grnId: e.id,
      grnno: e.grnno,
      grndate: e.grndate,
      paidAmt :e.paidAmt,
      remainingAmt :e.remainingAmt

    }
    this.paymentSlaveDto.push(this.slaveDto);
  };
  toggeleItem(evnt, grn, idx) {
    if (evnt.currentTarget.checked) {
      grn.adjustmentAmt = grn.remainingAmt;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;
      this.totalcalculation();
      this.dynamicpaymentSlaveDto.push(grn);
    } else {
      grn.adjustmentAmt = 0;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;
      this.totalcalculation();
      var index = this.dynamicpaymentSlaveDto.indexOf(grn);
      this.dynamicpaymentSlaveDto.splice(index, 1);
    }
  };
  
  changeBalance(evnt, grn) {
    if (grn.adjustmentAmt > grn.remainingAmt) {
      this.alerts.setMessage("The adjustment amount shoulde be equal or less!",'warn');
      grn.adjustmentAmt = 0;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;
      this.totalcalculation();
      return;
    }
    grn.balance = grn.remainingAmt - grn.adjustmentAmt;
    this.totalcalculation();
  }
  totalcalculation(){
    this.totalAmounts = 0;
    this.paymentSlaveDto.forEach(e =>{
      this.totalAmounts = this.totalAmounts + e.adjustmentAmt;
    })
  };

  public authorize(){
    this.isAuthorized = true;
    this.submit();
  };

  submit() {
    this.submitted = true;

    if(this.vendorSelected){
      if (this.cashPaymentForm.valid && this.f.contactName.value !=='') {
        if (this.dynamicpaymentSlaveDto.length > 0) {
          if(this.f.contactId.value ==null){
            this.alerts.setMessage("Vendor Name Should Be Valid",'warn');
            return;
          }
          if( this.totalAmounts !== this.f.amount.value ){
            this.alerts.setMessage("Tally Amount with Total Amount It Should be equal!",'warn');
            return;
          }
          this.paymentDto = this.cashPaymentForm.value;
          if(this.isAuthorized){
            if(this.loginService.getLoggedRole()===AppConstants._ROLE_EMP || this.loginService.getLoggedRole()===AppConstants._ROLE_SALE){
              this.paymentDto.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
            }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
              this.paymentDto.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
            }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
              this.paymentDto.status = this.constants.AUTHORIZED;
            }
          }else{
            this.paymentDto.status = this.constants.SAVED;
          }
          this.paymentDto.type_ = this.constants.CASH_TYPE;
          this.paymentDto.paymentSlave = this.dynamicpaymentSlaveDto;
          if(this.submitted && this.cashPaymentForm.valid){
            this.paymentService.createPayment(this.paymentDto).subscribe((response: ResponseDto) => {
              this.isAuthorized = false;
              this.submitted = false;
              if(response.code === 201){
                this.alerts.setMessage('Payment Saved Successfully!','success');
                this.router.navigate(['payment/cash']);
              };
            })
          }
        } else {
          this.alerts.setMessage("Please Select one invoice for payment!",'warn');
        }
      }
    }else if(this.accountsSelected){
      if (this.cashPaymentForm.valid && this.f.accountName.value !=='') {
        if(this.f.accountId.value ==null){
          this.alerts.setMessage("Accounts Name Should Be Valid",'warn');
          return;
        }
          this.paymentDto = this.cashPaymentForm.value;
          if(this.isAuthorized){
            if(this.loginService.getLoggedRole()===AppConstants._ROLE_EMP || this.loginService.getLoggedRole()===AppConstants._ROLE_SALE){
              this.paymentDto.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
            }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
              this.paymentDto.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
            }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
              this.paymentDto.status = this.constants.AUTHORIZED;
            }
          }else{
            this.paymentDto.status = this.constants.SAVED;
          }
          this.paymentDto.type_ = this.constants.CASH_TYPE;
          if(this.submitted && this.cashPaymentForm.valid){
            this.paymentService.createPayment(this.paymentDto).subscribe((response: ResponseDto) => {
              this.isAuthorized = false;
              this.submitted = false;
              if(response.code === 201){
                this.alerts.setMessage('Payment Saved Successfully!','success');
                this.router.navigate(['payment/cash']);
              };
            })
          }
      }
    }

    
  }

    public reset(){
      this.f.amount.setValue('');
      this.f.contactId.setValue(null);
      this.f.contactName.setValue('');
      this.f.accountId.setValue(null);
      this.f.accountName.setValue('');
      this.f.accounttype.setValue('');
      this.f.paymentmode.setValue('');
      this.vendorSelected = false;
      this.accountsSelected = false;
      this.totalAmounts =0;
      this.paymentSlaveDto = [];
      this.dynamicpaymentSlaveDto = [];
    }


  get f() { return this.cashPaymentForm.controls; }

}

