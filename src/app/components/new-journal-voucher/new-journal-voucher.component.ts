import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import { Constants } from '../../commons/constant';
import { JournalVoucherDto } from '../../model/JournalVoucherDto';
import { JournalVoucherSlave } from '../../model/JournalVoucherSlaveDto';
import { Observable } from '../../../../node_modules/rxjs';
import { debounceTime, distinctUntilChanged, map } from '../../../../node_modules/rxjs/operators';
import { SalesService } from '../../services/sales.service';
import { ContactSpecDto } from '../../model/contactSpecDto';
import * as _ from 'underscore';
import { PaymentService } from '../../services/payment.service';
import { InventoryService } from '../../services/inventory.service';
import { ListofValDto } from '../../model/listofValDto';
import { PurchaseInvoiceDto } from '../../model/purchaseInvoiceDto';
import { SalesInvoiceDto } from '../../model/invoiceDto';
import { ReceiptService } from '../../services/receipt.service';
import { JournalvoucherService } from '../../services/journalvoucher.service';
import { ResponseDto } from '../../model/ResponseDto';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AlertsService } from 'angular-alert-module';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccMasterListSpecDto } from 'src/app/model/AccMasterListSpecDto';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-new-journal-voucher',
  templateUrl: './new-journal-voucher.component.html',
  styleUrls: ['./new-journal-voucher.component.css']
})
export class NewJournalVoucherComponent implements OnInit {

  journalVoucherForm: FormGroup;
  submitted: boolean = false;
  journalVoucher: JournalVoucherDto;
  journalslave: Array<JournalVoucherSlave> = [];
  ContactNames: Array<string> = [];
  contactDto: any = [];
  contactSpecautoDto: ContactSpecDto;
  customerDto: any = [];
  customerName: Array<string> = [];
  bankDto: any = [];
  bankName: Array<string> = [];
  listofValDto: any = [];
  cashName: Array<string> = [];
  grnDto: Array<PurchaseInvoiceDto>;
  slaveDto: JournalVoucherSlave;
  saleDto: Array<SalesInvoiceDto>;
  dynamicJournalSlaveDto: Array<JournalVoucherSlave> = [];
  totalAmounts: number = 0;
  status = this.constants.SAVED;
  isAuthorize: boolean = false;
  accountName: Array<any> = [];
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
  isReadOnly : boolean = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private constants: Constants,
    private enquiryService: SalesService,
    private paymentService: PaymentService,
    private inventoryService: InventoryService,
    private receiptService: ReceiptService,
    private journalservice: JournalvoucherService,
    private loginService: LoginService,
    private alerts: AlertsService,
    private accServ: AccountsService,
    private uaServ : UserAccessService
  ) { }

  //Contact Details on first row
  searchContact = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.f.faccounttype.value == this.constants.VENDOR ? this.ContactNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
          : this.f.faccounttype.value == this.constants.CUSTOMER ? this.customerName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
            : this.f.faccounttype.value == this.constants.ACCOUNTS ? this.accountName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
              : this.bankName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  //bank or payment details on second row  
  searchPayment = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] :
        this.f.saccounttype.value == this.constants.CASH_TYPE ? this.cashName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
          : this.f.saccounttype.value == this.constants.ACCOUNTS ? this.accountName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
            : this.bankName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  ngOnInit() {
    this.initForm();
    this.typeAhedVendor();
    this.typeAhedCustomer();
    this.getBankList();
    this.getVoucherNo();
    this.getCashTypeList();
    this.getAccList();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('journal entries-voucher-date');
  }
  initForm() {
    this.journalVoucherForm = this.fb.group({
      id: [null, []],
      jvno: ['', [Validators.required]],
      jvdate: [this.constants.convert(new Date), [Validators.required]],
      faccounttype: ['', [Validators.required]],
      ftype: ['', [Validators.required]],
      fnarration: ['', []],
      famount: [null, [Validators.required]],
      saccounttype: ['', [Validators.required]],
      stype: ['', [Validators.required]],
      snarration: ['', []],
      samount: [null, [Validators.required]],
      fcontactId: [null, []],
      // fbankId: [null, []],
      scontactId: [null, []],
      sbankId: [null, []],
      contactName: ['', [Validators.required]],
      scontactName: ['', [Validators.required]],
      accountId: [null, []],
      saccountId: [null, []],
    });
    this.f.ftype.valueChanges.subscribe(val=>{
      if(val==="Credit"){
        this.f.stype.setValue("Debit");
      }else if(val==="Debit"){
        this.f.stype.setValue("Credit");
      }
    });
  }

  public getAccList() {
    this.accServ.listAccounts(this.listSpec).subscribe(res => {
      if (res.code === 200) {
        this.accList = res.data.data;
        this.accountName = _.pluck(this.accList, 'name');
      }
    });
    ;
  }

  //getting voucher number
  public getVoucherNo() {
    this.enquiryService.getEntityId(this.constants.JOURNAL_VOUCHER).subscribe(result => {
      this.f.jvno.setValue(result.message);
    })
  }

  //vendor list
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
      this.contactDto = result.data;
      this.ContactNames = _.pluck(this.contactDto, 'displayName');
    })
  };

  //select the contacts from list
  public selectedContact(cust) {
    if (this.f.faccounttype.value == this.constants.VENDOR) {
      this.contactDto.forEach(element => {
        if (element.displayName === cust.item) {
          this.f.accountId.reset();
          this.f.fcontactId.setValue(element.id);
          this.getPendinginvoice(element.id);
        }
      });
    } else if (this.f.faccounttype.value == this.constants.CUSTOMER) {
      this.customerDto.forEach(element => {
        if (element.displayName === cust.item) {
          this.f.accountId.reset();
          this.f.fcontactId.setValue(element.id);
          this.getPendingCustomerinvoice(element.id);
        }
      });
    } else if (this.f.faccounttype.value === this.constants.ACCOUNTS) {
      this.accList.forEach(element => {
        if (element.name === cust.item) {
          this.f.fcontactId.reset();
          this.f.accountId.setValue(element.id);
        }
      });
    } else {
      this.bankDto.forEach(element => {
        if (element.bankName === cust.item) {
          this.f.fbankId.setValue(element.id);
        }
      });
    }

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
  public getBankList() {

    this.paymentService.getBankList().subscribe(result => {
      this.bankDto = result.data;
      this.bankName = _.pluck(this.bankDto, 'bankName');
    })
  }
  selectedPayment(cust) {
    if (this.f.saccounttype.value == this.constants.BANK_TYPE) {
      this.bankDto.forEach(element => {
        if (element.bankName === cust.item) {
          this.f.saccountId.reset();
          this.f.sbankId.setValue(element.id);
        }
      });
    } else if (this.f.saccounttype.value === this.constants.ACCOUNTS) {
      this.accList.forEach(element => {
        if (element.name === cust.item) {
          this.f.sbankId.reset();
          this.f.saccountId.setValue(element.id);
        }
      });
    } else {
      this.listofValDto.forEach(element => {
        if (element.display === cust.item) {
          //this.f.sbankId.setValue(element.id);
        }
      });
    }
  }
  public getCashTypeList() {
    this.inventoryService.getUOMList(this.constants.CASH_TYPE_JV).subscribe(result => {
      this.listofValDto = result.data;
      this.cashName = _.pluck(this.listofValDto, 'display');
    })
  }

  public getPendinginvoice(id) {
    this.journalslave = [];
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
      saleId: null,
      saledate: e.grndate,
      saleno: null,
      grnno: e.grnno,
      grndate: e.grndate,
      paidAmt: e.paidAmt,
      remainingAmt: e.remainingAmt,
      voucherdate: e.grndate,
      voucherno: e.grnno
    }
    this.journalslave.push(this.slaveDto);
  };


  public getPendingCustomerinvoice(id) {
    this.journalslave = [];
    this.receiptService.getPendingInvoice(id).subscribe(result => {
      this.saleDto = result.data;
      this.setCustomerpendingInvoice();
    })
  }
  public setCustomerpendingInvoice() {
    this.saleDto.forEach(e => {
      this.addCust(e);
    })
  };
  addCust(e) {
    this.slaveDto = {
      id: null,
      adjustmentAmt: 0,
      amount: e.netAmt,
      balance: e.remainingAmt,
      advanceAmt: e.advanceAmt,
      total: e.total,
      saleId: e.id,
      saleno: e.saleno,
      grnId: null,
      grnno: null,
      grndate: e.saledate,
      saledate: e.saledate,
      paidAmt: e.paidAmt,
      remainingAmt: e.remainingAmt,
      voucherdate: e.saledate,
      voucherno: e.saleno
    }
    this.journalslave.push(this.slaveDto);
  };

  toggeleItem(evnt, grn, idx) {
    if (evnt.currentTarget.checked) {
      grn.adjustmentAmt = grn.remainingAmt;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;

      this.totalcalculation();
      this.dynamicJournalSlaveDto.push(grn);
    } else {

      grn.adjustmentAmt = 0;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;
      this.totalcalculation();
      var index = this.dynamicJournalSlaveDto.indexOf(grn);
      this.dynamicJournalSlaveDto.splice(index, 1);
    }
  };
  changeBalance(evnt, grn) {
    if (grn.adjustmentAmt > grn.remainingAmt) {
      this.alerts.setMessage("The adjustment amount shoulde be equal or less!", 'warn');

      grn.adjustmentAmt = 0;
      grn.balance = grn.remainingAmt - grn.adjustmentAmt;
      this.totalcalculation();
      return;
    }

    grn.balance = grn.remainingAmt - grn.adjustmentAmt;
    this.totalcalculation();

  }
  totalcalculation() {
    this.totalAmounts = 0;
    this.journalslave.forEach(e => {
      this.totalAmounts = this.totalAmounts + e.adjustmentAmt;
    })
  }

  public authorize() {
    this.isAuthorize = true;
    this.submit();
  }
  submit() {
    this.submitted = true;
    if (this.f.faccounttype.value === this.constants.ACCOUNTS) {
      if (this.journalVoucherForm.valid) {
        this.journalVoucher = this.journalVoucherForm.value;
        if (this.isAuthorize) {
          if (this.loginService.getLoggedRole() === AppConstants._ROLE_EMP || this.loginService.getLoggedRole() === AppConstants._ROLE_SALE) {
            this.journalVoucher.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
          } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
            this.journalVoucher.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
          } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
            this.journalVoucher.status = this.constants.AUTHORIZED;
          }
        } else {
          this.journalVoucher.status = this.status;
        }
        if (this.submitted && this.journalVoucherForm.valid) {
          this.journalservice.createJournalVoucher(this.journalVoucher).subscribe((response: ResponseDto) => {
            this.submitted = false;
            this.isAuthorize = false;
            if (response.code === 200) {
              this.alerts.setMessage('Payment Saved Successfully!', 'success');
              this.router.navigate(['/journal/voucher']);
            }
          })
        }
      }
    } else {
      if (this.journalVoucherForm.valid) {
        if (this.dynamicJournalSlaveDto.length > 0) {
          // if( this.totalAmounts !== this.f.famount.value ){
          //   alert("Tally Amount with Total Amount It Should be equal!");
          //   return;
          // }
          this.journalVoucher = this.journalVoucherForm.value;
          if (this.isAuthorize) {
            if (this.loginService.getLoggedRole() === AppConstants._ROLE_EMP || this.loginService.getLoggedRole() === AppConstants._ROLE_SALE) {
              this.journalVoucher.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
            } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
              this.journalVoucher.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
            } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
              this.journalVoucher.status = this.constants.AUTHORIZED;
            }
          } else {
            this.journalVoucher.status = this.status;
          }
          this.journalVoucher.journalslave = this.dynamicJournalSlaveDto;
          if (this.submitted && this.journalVoucherForm.valid) {
            this.journalservice.createJournalVoucher(this.journalVoucher).subscribe((response: ResponseDto) => {
              this.submitted = false;
              this.isAuthorize = false;
              if (response.code === 200) {
                this.alerts.setMessage('Payment Saved Successfully!', 'success');
                this.router.navigate(['/journal/voucher']);
              }
            })
          }
        } else {
          this.alerts.setMessage("Please Select one invoice for Journal Entry!", 'warn');
        }
      }
    }


  };

  public reset() {
    this.journalVoucherForm.controls.faccounttype.setValue('');
    this.journalVoucherForm.controls.ftype.setValue('');
    this.journalVoucherForm.controls.fnarration.setValue('');
    this.journalVoucherForm.controls.famount.setValue(null);
    this.journalVoucherForm.controls.saccounttype.setValue('');
    this.journalVoucherForm.controls.stype.setValue('');
    this.journalVoucherForm.controls.snarration.setValue('');
    this.journalVoucherForm.controls.samount.setValue(null);
    this.journalVoucherForm.controls.fcontactId.setValue(null);
    this.journalVoucherForm.controls.scontactId.setValue(null);
    this.journalVoucherForm.controls.sbankId.setValue(null);
    this.journalVoucherForm.controls.contactName.setValue('');
    this.journalVoucherForm.controls.scontactName.setValue('');
    this.journalVoucherForm.controls.accountId.setValue(null);
    this.journalVoucherForm.controls.saccountId.setValue(null);
    this.totalAmounts = 0;
    this.dynamicJournalSlaveDto = [];
    this.journalslave = [];

  }
  get f() { return this.journalVoucherForm.controls; }
}
