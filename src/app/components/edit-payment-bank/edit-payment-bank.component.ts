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
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { BankDto } from '../../model/bankDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBankModelComponent } from '../add-bank-model/add-bank-model.component';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AlertsService } from 'angular-alert-module';
import { AccMasterListSpecDto } from 'src/app/model/AccMasterListSpecDto';
import { AccountsService } from 'src/app/services/accounts.service';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-edit-payment-bank',
  templateUrl: './edit-payment-bank.component.html',
  styleUrls: ['./edit-payment-bank.component.css']
})

export class EditPaymentBankComponent implements OnInit {

  bankPaymentForm: FormGroup;
  submitted: boolean = false;
  contactSpecautoDto: ContactSpecDto;
  vendorDto: any = [];
  vendorName: Array<string> = [];
  paymentDto: PaymentDto;
  paymentSlaveDto: Array<PaymentSlaveDto> = [];
  dynamicpaymentSlaveDto: Array<PaymentSlaveDto> = [];
  slaveDto: PaymentSlaveDto;
  grnDto: Array<PurchaseInvoiceDto>;
  bankDto: Array<BankDto>;
  isAuthorized : boolean = false;
  totalAmounts : number=0;
  maindto : any;
  status:any = this.constants.SAVED;
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
    private modalService: NgbModal,
    private loginService :LoginService,
    private activatedRoute : ActivatedRoute,
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
    this.getEditData(this.activatedRoute.snapshot.params['id']);
    // this.typeAhedVendor();
    // this.getVoucherNo();
    this.getBankList();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('payments-bank-date');
  };

  public getEditData(id){
    this.paymentService.getPaymentById(id).subscribe(res=>{
      if(res.code===200){
        this.f.accounttype.setValue(res.data.accounttype);
        if(res.data.accounttype === this.constants.VENDOR){
          this.vendorSelected = true;
          this.accountsSelected = false;
          this.typeAhedVendor();
          this.maindto = res.data;
          this.f.id.setValue(res.data.id);
          this.f.paymentno.setValue(res.data.paymentno);
          if(this.maindto.paymentdate !== null){
            this.f.paymentdate.setValue(this.constants.convert(this.maindto.paymentdate));
          }else{
            this.f.paymentdate.setValue(this.maindto.paymentdate);  
          }
          this.f.contactName.setValue(this.maindto.contacts.displayName);
          this.f.contactId.setValue(this.maindto.contacts.id);
          this.f.bankId.setValue(this.maindto.bank.id);
          this.f.chequeno.setValue(this.maindto.chequeno);
          this.f.amount.setValue(this.maindto.amount);
          this.f.status.setValue(this.maindto.status);
          this.setallslave();
        }else if(res.data.accounttype === this.constants.ACCOUNTS){
          this.vendorSelected = false;
          this.accountsSelected = true;
          this.getAccList();
          this.f.id.setValue(res.data.id);
          this.f.paymentno.setValue(res.data.paymentno);
          this.f.accounttype.setValue(res.data.accounttype);
          if(res.data.paymentdate !== null){
            this.f.paymentdate.setValue(this.constants.convert(res.data.paymentdate));
          }else{
            this.f.paymentdate.setValue(res.data.paymentdate);  
          }
          this.f.bankId.setValue(res.data.bank.id);
          this.f.chequeno.setValue(res.data.chequeno);
          this.f.amount.setValue(res.data.amount);
          this.f.status.setValue(res.data.status);
          if(res.data.accountsubmst !== null){
            this.f.accountId.setValue(res.data.accountsubmst.id);
            this.f.accountName.setValue(res.data.accountsubmst.name);
          }
        }
    }
  });
}

  public setallslave() {
    this.maindto.paymentSlave.forEach(e => {
      this.addslave(e);
      this.totalAmounts += e.adjustmentAmt;
    })
  };

  addslave(e) {
    this.slaveDto = {
      id: e.id,
      adjustmentAmt: e.adjustmentAmt,
      amount: e.amount,
      balance: e.balance,
      advanceAmt: e.advanceAmt,
      total: e.total,
      grnId: e.grn.id,
      grnno: e.grn.grnno,
      grndate: (e.grn.grndate!==null) ? new Date (e.grn.grndate) : e.grn.grndate,
      paidAmt :e.grn.paidAmt,
      remainingAmt :e.grn.remainingAmt + e.adjustmentAmt
    }
    this.paymentSlaveDto.push(this.slaveDto);
    this.dynamicpaymentSlaveDto.push(this.slaveDto);
  };


  openFormModal() {
    const modalRef = this.modalService.open(AddBankModelComponent);
    
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      this.getBankList();
      console.log(error);
    });
  };

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
    this.bankPaymentForm = this.fb.group({
      id:[null,[]],
      paymentno: ['', [Validators.required]],
      paymentdate: [this.constants.convert(new Date), [Validators.required]],
      type_: ['', []],
      chequeno: ['', []],
      paymentmode: ['', []],
      amount: [null, [Validators.required]],
      discount: [null, []],
      paidAmt: [null, []],
      remainingAmt: [null, []],
      status: ['', []],
      contactId: [null, []],
      bankId: [null, [Validators.required]],
      contactName: ['', []],
      accountName: ['',[]],
      accountId: [null,[]],
      accounttype:['',[Validators.required]],
    });
  }

  public getBankList() {

    this.paymentService.getBankList().subscribe(result => {
      this.bankDto = result.data;
    })
  }
  public getVoucherNo() {
    this.enquiryService.getEntityId(this.constants.BANK_PAYMENT).subscribe(result => {
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
    this.paymentSlaveDto =[];
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
      //this.totalAmounts =this.totalAmounts + grn.adjustmentAmt;
      this.totalcalculation();
      this.dynamicpaymentSlaveDto.push(grn);
    } else {
      //this.totalAmounts =this.totalAmounts - grn.adjustmentAmt;
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
      //this.totalAmounts =this.totalAmounts - grn.adjustmentAmt;
      grn.adjustmentAmt = 0;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;
      this.totalcalculation();
      return;
    }
    
    grn.balance = grn.remainingAmt - grn.adjustmentAmt;
    this.totalcalculation();
    //this.totalAmounts =this.totalAmounts + grn.adjustmentAmt;
  }
  totalcalculation(){
    this.totalAmounts = 0;
    this.paymentSlaveDto.forEach(e =>{
      this.totalAmounts = this.totalAmounts + e.adjustmentAmt;
    })
  };

  public authorize(){
    this.isAuthorized = true;
      if(this.loginService.getLoggedRole()===AppConstants._ROLE_EMP || this.loginService.getLoggedRole()===AppConstants._ROLE_SALE){
        this.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
      }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
        this.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
      }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.status = this.constants.AUTHORIZED;
      }
    this.submit();
  };

  public unauthorize(){
    if(this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
      this.status = this.constants.UNAUTHORIZED_BY_MANAGER;
    }else if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
      this.status = this.constants.UNAUTHORIZED_BY_DIRECTOR;
    }
    this.submit();
  };

  submit() {
    this.submitted = true;
    if(this.vendorSelected){
      if (this.bankPaymentForm.valid && this.f.contactName.value !=='') {

        if (this.dynamicpaymentSlaveDto.length > 0) {
          if(this.f.contactId.value ==null){
            this.alerts.setMessage("Vendor Name Should Be Valid",'warn');
            return;
          }
          if( this.totalAmounts !== this.f.amount.value ){
            this.alerts.setMessage("Tally Amount with Total Amount It Should be equal!",'warn');
              return;
          }
          this.paymentDto = this.bankPaymentForm.value;
          this.paymentDto.status = this.status;
          this.paymentDto.type_ = this.constants.BANK_TYPE;
          this.paymentDto.paymentSlave = this.dynamicpaymentSlaveDto;
          if(this.submitted && this.bankPaymentForm.valid){
            this.paymentService.createPayment(this.paymentDto).subscribe((response: ResponseDto) => {
              this.submitted = false;
              this.isAuthorized = false;
              if(response.code === 201){
                this.alerts.setMessage('Payment Saved Successfully!','success');
              this.router.navigate(['payment/bank'])
              }
            })
          }
        } else {
          this.alerts.setMessage("Please Select one invoice for payment!",'warn');
        }
      }
    }else if(this.accountsSelected){
      if (this.bankPaymentForm.valid && this.f.accountName.value !=='') {
        if(this.f.accountId.value ==null){
          this.alerts.setMessage("Accounts Name Should Be Valid",'warn');
          return;
        }
          this.paymentDto = this.bankPaymentForm.value;
          this.paymentDto.status = this.status;
          this.paymentDto.type_ = this.constants.BANK_TYPE;
          if(this.submitted && this.bankPaymentForm.valid){
            this.paymentService.createPayment(this.paymentDto).subscribe((response: ResponseDto) => {
              this.submitted = false;
              this.isAuthorized = false;
              if(response.code === 201){
                this.alerts.setMessage('Payment Saved Successfully!','success');
              this.router.navigate(['payment/bank'])
              }
            })
          }
      }
    }

    
  }

  public showHide(){
    if(this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER || this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
      return true
    }else{
    return false;
    }
  }

  // public reset(){
  //   this.f.chequeno.setValue('');
  //   this.f.amount.setValue('');
  //   this.f.contactId.setValue('');
  //   this.f.bankId.setValue('');
  //   this.f.contactName.setValue('');
  //   this.totalAmounts =0;
  //   this.paymentSlaveDto = [];
  //   this.dynamicpaymentSlaveDto = [];

  // }

  get f() { return this.bankPaymentForm.controls; }

}

