import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { ReceiptDto } from '../../model/receiptDto';
import { ReceiptSlaveDto } from '../../model/receiptSlaveDto';
import { SalesInvoiceDto } from '../../model/invoiceDto';
import { ReceiptService } from '../../services/receipt.service';
import { Constants } from '../../commons/constant';
import { SalesService } from '../../services/sales.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Observable } from '../../../../node_modules/rxjs';
import { debounceTime, distinctUntilChanged, map } from '../../../../node_modules/rxjs/operators';
import * as _ from 'underscore';
import { ResponseDto } from '../../model/ResponseDto';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AlertsService } from 'angular-alert-module';
import { AccMasterListSpecDto } from 'src/app/model/AccMasterListSpecDto';
import { AccountsService } from 'src/app/services/accounts.service';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-edit-reciepts-cash',
  templateUrl: './edit-reciepts-cash.component.html',
  styleUrls: ['./edit-reciepts-cash.component.css']
})
export class EditRecieptsCashComponent implements OnInit {
  cashReceiptForm: FormGroup;
  submitted: boolean = false;
  contactSpecautoDto: ContactSpecDto;
  customerDto: any = [];
  customerName: Array<string> = [];
  receiptDto: ReceiptDto;
  receiptSlaveDto: Array<ReceiptSlaveDto> = [];
  dynamicreceiptSlaveDto: Array<ReceiptSlaveDto> = [];
  slaveDto: ReceiptSlaveDto;
  saleDto: Array<SalesInvoiceDto>;
  totalAmounts : number=0;
  isAuthorized : boolean = false;
  mainDto : any;
  status : any = this.constants.SAVED;
  listSpec: AccMasterListSpecDto = {
    category: 'N',
    masterid: null,
    selfid: null,
    name: '',
    code: null,
    page: 1,
    size: 1000,
  };
  accList: Array<any> = [];
  accountsSelected: boolean = false;
  customerSelected: boolean = false;
  accountName: Array<any> = [];
  isReadOnly : boolean = false;

  constructor(
    private fb: FormBuilder,
    private enquiryService: SalesService,
    private constants: Constants,
    private receiptService: ReceiptService,
    private router: Router,
    private loginService : LoginService,
    private activatedRoute : ActivatedRoute,
    private alerts : AlertsService,
    private accServ: AccountsService,
    private uaServ : UserAccessService
    ) { }
  // typeahed for Customer NAME
  searchCustomer = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.customerName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
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
    // this.typeAhedCustomer();
    this.getEditData(this.activatedRoute.snapshot.params['id']);
    // this.getVoucherNo();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('receipts-cash-date');
  }

  public onTypeSelect(event) {
    if (event.currentTarget.value === this.constants.ACCOUNTS) {
      this.customerSelected = false;
      this.accountsSelected = true;
      this.f.contactId.setValue(null);
      this.f.contactName.setValue('');
      this.getAccList();
    } else if (event.currentTarget.value === this.constants.CUSTOMER) {
      this.accountsSelected = false;
      this.customerSelected = true;
      this.f.accountId.setValue(null);
      this.f.accountName.setValue('');
      this.typeAhedCustomer();
    } else {
      this.accountsSelected = false;
      this.customerSelected = false;
    }
  }

  public getAccList() {
    this.accServ.listAccounts(this.listSpec).subscribe(res => {
      if (res.code === 200) {
        this.accList = res.data.data;
        this.accountName = _.pluck(this.accList, 'name');
      }
    });
  }

  public initForm() {
    this.cashReceiptForm = this.fb.group({
      id:[null,[]],
      receiptNo: ['', [Validators.required]],
      receiptDate: [this.constants.convert(new Date), [Validators.required]],
      type: ['', []],
      chequeNo: ['', []],
      paymentMode: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      discount: [null, []],
      paidAmt: [null, []],
      remainingAmt: [null, []],
      status: ['', []],
      contactId: [null, []],
      bankId: [null, []],
      contactName: ['', []],
      totalamount:[null,[]],
      accountName: ['', []],
      accountId: [null, []],
      accounttype: ['', [Validators.required]],
    });
  };

  public getEditData(id){
    this.receiptService.getRecById(id).subscribe(res=>{
      if(res.code===200){
        this.f.accounttype.setValue(res.data.accounttype);
        if(res.data.accounttype === this.constants.CUSTOMER){
          this.customerSelected = true;
          this.accountsSelected = false;
          this.typeAhedCustomer();
          this.mainDto = res.data;
          this.f.id.setValue(this.mainDto.id);
          this.f.receiptNo.setValue(this.mainDto.receiptNo);
          this.f.receiptDate.setValue(this.mainDto.receiptDate!==null ? new Date(this.mainDto.receiptDate) : this.mainDto.receiptDate);
          this.f.contactName.setValue(this.mainDto.contacts.displayName);
          this.f.contactId.setValue(this.mainDto.contacts.id);
          this.f.paymentMode.setValue(this.mainDto.paymentMode);
          this.f.amount.setValue(this.mainDto.amount);
          this.f.status.setValue(this.mainDto.status);
          this.setallslave();
        }else if(res.data.accounttype === this.constants.ACCOUNTS){
          this.customerSelected = false;
          this.accountsSelected = true;
          this.getAccList();
          this.mainDto = res.data;
          this.f.id.setValue(res.data.id);
          this.f.receiptNo.setValue(res.data.receiptNo);
          this.f.receiptDate.setValue(res.data.receiptDate!==null ? new Date(res.data.receiptDate) : res.data.receiptDate);
          this.f.contactName.setValue('');
          this.f.contactId.setValue(null);
          this.f.paymentMode.setValue(this.mainDto.paymentMode);
          this.f.amount.setValue(this.mainDto.amount);
          this.f.status.setValue(this.mainDto.status);
          if (res.data.accountsubmst !== null) {
            this.f.accountId.setValue(res.data.accountsubmst.id);
            this.f.accountName.setValue(res.data.accountsubmst.name);
          }
        }
      }
    });
  }

  public setallslave() {
    this.mainDto.receiptSlaves.forEach(e => {
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
      saleId: e.sale.id,
      saleno: e.sale.saleno,
      saledate: e.sale.saledate!==null ?new Date(e.sale.saledate) : e.sale.saledate,
      paidAmt :e.sale.paidAmt,
      remainingAmt :e.sale.remainingAmt + e.adjustmentAmt
    }
    this.receiptSlaveDto.push(this.slaveDto);
    this.dynamicreceiptSlaveDto.push(this.slaveDto);
  };

  public getVoucherNo() {
    this.enquiryService.getEntityId(this.constants.CASH_RECEIPT).subscribe(result => {
      this.f.receiptNo.setValue(result.message);
    })
  }
  public typeAhedCustomer() {
    this.contactSpecautoDto = {
      "contactname": "",
      "companyName": "",
      "displayName": "",
      "type": this.constants.CUSTOMER,
      "email": "",
      "page": 1,
      "size": 100
    }
    this.enquiryService.getCustomerList(this.contactSpecautoDto).subscribe(result => {
      this.customerDto = result.data;
      this.customerName = _.pluck(this.customerDto, 'displayName');
    })
  };
  public selectedCustomer(cust) {
    this.customerDto.forEach(element => {
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
    this.receiptSlaveDto =[];
    this.receiptService.getPendingInvoice(id).subscribe(result => {
      this.saleDto = result.data;
      this.setpendingInvoice();
    })
  }

  public setpendingInvoice() {
    this.saleDto.forEach(e => {
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
      saleId: e.id,
      saleno: e.saleno,
      saledate: e.saledate,
      paidAmt :e.paidAmt,
      remainingAmt :e.remainingAmt
    }
    this.receiptSlaveDto.push(this.slaveDto);
  };
  toggeleItem(evnt, sale, idx) {
    if (evnt.currentTarget.checked) {
      sale.adjustmentAmt = sale.remainingAmt;
      sale.balance = sale.remainingAmt - sale.adjustmentAmt;
      this.totalcalculation();
      this.dynamicreceiptSlaveDto.push(sale);
      
    } else {
      sale.adjustmentAmt = 0;
      sale.balance = sale.remainingAmt - sale.adjustmentAmt;
      this.totalcalculation();
      var index = this.dynamicreceiptSlaveDto.indexOf(sale);
      this.dynamicreceiptSlaveDto.splice(index, 1);
    }
  };
  changeBalance(evnt, sale){
    if(sale.adjustmentAmt > sale.remainingAmt){
      this.alerts.setMessage("The adjustment amount shoulde be equal or less!",'warn');
      sale.adjustmentAmt = 0;
      sale.balance = sale.remainingAmt -sale.adjustmentAmt;
      this.totalcalculation();
      return;
    }
    sale.balance = sale.remainingAmt -sale.adjustmentAmt;
    this.totalcalculation();
  }
  totalcalculation(){
    this.totalAmounts = 0;
    this.receiptSlaveDto.forEach(e =>{
      this.totalAmounts = this.totalAmounts + e.adjustmentAmt;
    })
  };

  public authorize(){
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
    if(this.customerSelected){
      if (this.cashReceiptForm.valid && this.f.contactName.value !== '') {
        if(this.dynamicreceiptSlaveDto.length>0){
          if(this.f.contactId.value ==null){
            this.alerts.setMessage("Customer Name Should Be Valid",'warn');
            return;
          }
          if( this.totalAmounts !== this.f.amount.value ){
            this.alerts.setMessage("Tally Amount with Total Amount It Should be equal!",'warn');
            return;
          }
          this.receiptDto = this.cashReceiptForm.value;
          this.receiptDto.status = this.status;
          this.receiptDto.type = this.constants.CASH_TYPE;
          this.receiptDto.receiptSlaves = this.dynamicreceiptSlaveDto;
          if(this.submitted && this.cashReceiptForm.valid){
            this.receiptService.createReceipt(this.receiptDto).subscribe((response: ResponseDto) => {
              this.submitted = false;
              this.alerts.setMessage('Receipt Saved Successfully!','success');
              this.router.navigate(['reciepts/cash'])
            })
          }
        }else{
          this.alerts.setMessage("Please Select one invoice for payment!",'warn');
        }
      }
    }else if(this.accountsSelected){
      if (this.cashReceiptForm.valid && this.f.accountName.value!== '') {
        if(this.f.accountId.value ==null){
          this.alerts.setMessage("Accounts Name Should Be Valid",'warn');
          return;
        }
          this.receiptDto = this.cashReceiptForm.value;
          this.receiptDto.status = this.status;
          this.receiptDto.type = this.constants.CASH_TYPE;
          if(this.submitted && this.cashReceiptForm.valid){
            this.receiptService.createReceipt(this.receiptDto).subscribe((response: ResponseDto) => {
              this.submitted = false;
              this.alerts.setMessage('Receipt Saved Successfully!','success');
              this.router.navigate(['reciepts/cash'])
            })
          }
      }
    }else{
      alert("Form");
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
  //   this.f.amount.setValue(null);
  //   this.f.contactId.setValue('');
  //   this.f.contactName.setValue('');
  //   this.f.paymentMode.setValue('');
  //   this.totalAmounts =0;
  //   this.receiptSlaveDto = [];
  //   this.dynamicreceiptSlaveDto = [];
  // }

  get f() { return this.cashReceiptForm.controls; }
}
