import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { SalesService } from '../../services/sales.service';
import { Constants } from '../../commons/constant';
import { JournalOpenigBalanceService } from '../../services/journal-openig-balance.service';
import { OpeningBalanceDto } from '../../model/OpeningBalanceDto';
import { PaymentService } from '../../services/payment.service';
import { InventoryService } from '../../services/inventory.service';
import * as _ from 'underscore';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { Observable } from '../../../../node_modules/rxjs';
import { debounceTime, distinctUntilChanged, map } from '../../../../node_modules/rxjs/operators';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { AccMasterListSpecDto } from '../../model/AccMasterListSpecDto';
import { AccountsService } from '../../services/accounts.service';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-edit-journal-opening-balance',
  templateUrl: './edit-journal-opening-balance.component.html',
  styleUrls: ['./edit-journal-opening-balance.component.css']
})
export class EditJournalOpeningBalanceComponent implements OnInit {

  OpForm: FormGroup;
  ObDto: OpeningBalanceDto;
  status = this.constants.SAVED;

  journalVoucherForm: FormGroup;
  submitted: boolean = false;
  ContactNames: Array<string> = [];
  contactDto: any = [];
  contactSpecautoDto: ContactSpecDto;
  customerDto: any = [];
  customerName: Array<string> = [];
  bankDto: any = [];
  bankName: Array<string> = [];
  listofValDto: any = [];
  cashName: Array<string> = [];
  accountName : Array<any> = [];
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
  isReadOnly : boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alerts: AlertsService,
    private salesService: SalesService,
    private constants: Constants,
    private obServ: JournalOpenigBalanceService,
    private enquiryService: SalesService,
    private paymentService: PaymentService,
    private inventoryService: InventoryService,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private accServ : AccountsService,
    private uaServ : UserAccessService

  ) { }

  searchContact = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.fc.accounttype.value == this.constants.VENDOR ? this.ContactNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
          : this.fc.accounttype.value == this.constants.CUSTOMER ? this.customerName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
           : this.fc.accounttype.value ==this.constants.ACCOUNTS ? this.accountName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)  
             : this.bankName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  //bank or payment details on second row  
  searchPayment = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? [] :
        this.fc.saccounttype.value == this.constants.CASH_TYPE ? this.cashName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
          : this.bankName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

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
    if (this.fc.accounttype.value == this.constants.VENDOR) {
      this.contactDto.forEach(element => {
        if (element.displayName === cust.item) {
          this.fc.contactId.reset();
          this.fc.bankId.reset();
          this.fc.contactId.setValue(element.id);
        }
      });
    } else if (this.fc.accounttype.value == this.constants.CUSTOMER) {
      this.customerDto.forEach(element => {
        if (element.displayName === cust.item) {
          this.fc.contactId.reset();
          this.fc.bankId.reset();
          this.fc.contactId.setValue(element.id);
        }
      });
    }else  if(this.fc.accounttype.value === this.constants.ACCOUNTS){
      this.accList.forEach(element => {
        if (element.name === cust.item) {
          this.fc.contactId.reset();
          this.fc.bankId.reset();
          this.fc.accountId.setValue(element.id);
        }
      });
    } else {
      this.bankDto.forEach(element => {
        if (element.bankName === cust.item) {
          this.fc.contactId.reset();
          this.fc.bankId.reset();
          this.fc.bankId.setValue(element.id);
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
    if (this.fc.saccounttype.value == this.constants.BANK_TYPE) {
      this.bankDto.forEach(element => {
        if (element.bankName === cust.item) {
          this.fc.sbankId.setValue(element.id);
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

  public getAccList(){
    this.accServ.listAccounts(this.listSpec).subscribe(res=>{
      if(res.code === 200){
        this.accList = res.data.data;
        this.accountName = _.pluck(this.accList, 'name');
      }
    });
  }

  ngOnInit() {
    this.initForm();
    // this.getOpBalNo();
    this.typeAhedVendor();
    this.typeAhedCustomer();
    this.getBankList();
    this.getAccList();
    this.getEditData(this.activatedRoute.snapshot.params['id']);
    this.isReadOnly = !this.uaServ.getMasterModules().includes('journal entries-opening balance-date');
  };

  public getEditData(id) {
    this.obServ.getOpeningBalanceById(id).subscribe(res => {
      if (res.code === 200) {
        this.bindData(res.data);
      }
    });
  };

  public bindData(data) {
    this.fc.id.setValue(data.id);
    this.fc.openingno.setValue(data.openingno);
    if (data.openingdate != null) {
      this.fc.openingdate.setValue(this.constants.convert(data.openingdate));
    } else {
      this.fc.openingdate.setValue(data.openingdate);
    }
    this.fc.accounttype.setValue(data.accounttype);
    if (data.accounttype === this.constants.BANK_TYPE) {
      this.fc.bankId.setValue(data.bank.id);
    } else if(data.accounttype === this.constants.ACCOUNTS){
      this.fc.accountId.setValue(data.accountsubmst.id);
    } else {
      this.fc.contactId.setValue(data.contacts.id);
    }
    this.fc.accountname.setValue(data.accountname);
    this.fc.type.setValue(data.type);
    this.fc.narration.setValue(data.narration);
    this.fc.status.setValue(data.status);
    this.fc.amount.setValue(data.amount);
  }

  public initForm() {
    this.OpForm = this.fb.group({
      id: [null, []],
      openingno: ['', [Validators.required]],
      openingdate: [this.constants.convert(new Date), [Validators.required]],
      accounttype: ['', [Validators.required]],
      accountname: ['', [Validators.required]],
      type: ['', [Validators.required]],
      narration: ['', []],
      status: ['', []],
      amount: [null, [Validators.required]],
      contactId: [null, []],
      bankId: [null, []],
      accountId:[null,[]]
    });

    this.OpForm.get('accounttype').disable();
  };

  // public getOpBalNo() {
  //   this.salesService.getEntityId(this.constants.OPENING_BALANCE).subscribe(result => {
  //     if (result.code === 200) {
  //       this.fc.openingno.setValue(result.message);
  //     }
  //   })
  // };

  public assembleData() {
    this.ObDto = {
      id: this.fc.id.value,
      openingno: this.fc.openingno.value,
      openingdate: this.fc.openingdate.value,
      accounttype: this.fc.accounttype.value,
      accountname: this.fc.accountname.value,
      type: this.fc.type.value,
      narration: this.fc.narration.value,
      status: this.status,
      amount: this.fc.amount.value,
      contactId: this.fc.contactId.value,
      bankId: this.fc.bankId.value,
      accountId:this.fc.accountId.value
    }
  }

  public submit() {
    this.submitted = true;
    this.assembleData();
    if (this.submitted && this.OpForm.valid) {
      this.obServ.addOpeningBalance(this.ObDto).subscribe(res => {
        this.submitted = false;
        if (res.code === 200) {
          this.alerts.setMessage(res.message, 'success');
          this.router.navigate(['/journal/opening-balance']);
        }
      });
    }
  }

  public authorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_EMP || this.loginService.getLoggedRole() === AppConstants._ROLE_SALE) {
      this.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.AUTHORIZED;
    }
    this.submit();
  };

  public unauthorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.UNAUTHORIZED_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.UNAUTHORIZED_BY_DIRECTOR;
    }
    this.submit();
  };

  public showHide() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER || this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      return true
    } else {
      return false;
    }
  };

  get fc() { return this.OpForm.controls; }

  public reset() {
    this.fc.type.setValue('');
    this.fc.narration.setValue('');
    this.fc.status.setValue('');
    this.fc.amount.setValue('');
  }
}

