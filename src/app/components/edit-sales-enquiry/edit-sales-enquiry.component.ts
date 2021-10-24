import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'underscore';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResponseDto } from '../../model/ResponseDto';
import { SalesService } from '../../services/sales.service';
import { ItemDto } from '../../model/itemDto';
import { Constants } from '../../commons/constant';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { SalesEnquiryItemDto } from '../../model/salesEnquiryItemDto';
import { SaleEnquiryDto } from '../../model/saleEnquiryDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from '../add-customer-modal/add-customer-modal.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { LoginService } from '../../services/login.service';
import { AppConstants } from '../../commons/app-constant';
import { AlertsService } from 'angular-alert-module';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-edit-sales-enquiry',
  templateUrl: './edit-sales-enquiry.component.html',
  styleUrls: ['./edit-sales-enquiry.component.css']
})
export class EditSalesEnquiryComponent implements OnInit {
  salesEnquiryForm: FormGroup;
  total: number = 0;
  productDto: any = [];
  salesEnquiryDto: SaleEnquiryDto
  itemDto: Array<SalesEnquiryItemDto> = [];
  item: SalesEnquiryItemDto;
  customerDto: any = [];
  salesDto: any = [];
  contactSpecautoDto: ContactSpecDto;
  responseDto: ResponseDto
  productList: Array<ItemDto> = [];
  productCode: Array<string> = [];
  itemName: Array<string> = [];
  customerName: Array<string> = [];
  salesMan: Array<string> = [];
  submitted: boolean = false;
  productSubmit: boolean = false;
  productAdded: boolean = false;
  status = this.constants.SAVED;
  deletedProIds: Array<any> = [];
  temp: Array<any> = [];
  isReadOnly : boolean = false;
  // typeahed for productCode
  searchCode = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.productCode.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  // typeahed for productName
  searchName = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.itemName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  // typeahed for Customer NAME
  customerNme = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.customerName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  // typeahed for SALES MAN
  saleMan = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.salesMan.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  constructor(
    private fb: FormBuilder,
    private enquiryService: SalesService,
    private constants: Constants,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private confirmationAlert: ConfirmationDialogService,
    private loginService: LoginService,
    private alerts: AlertsService,
    private uaServ : UserAccessService
  ) { }

  ngOnInit() {
    this.initForm();
    const id = this.activatedRoute.snapshot.params['id'];
    this.getEnquiry(id);
    this.typeAhedProduct();
    this.typeAhedCustomer();
    this.typeAhedSales();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('sales-enquiry-date');
  }




  openFormModal() {
    const modalRef = this.modalService.open(AddCustomerModalComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      this.typeAhedCustomer();
      console.log(error);
    });
  }

  public initForm() {
    this.salesEnquiryForm = this.fb.group({
      id: [null, []],
      enqNo: ['', [Validators.required]],
      enqDate: [null, [Validators.required]],
      link: ['', []],
      paymentTerms: ['', [Validators.required]],
      warranty: ['', []],
      narration: ['', []],
      serviceNo: ['', []],
      status: ['', []],
      contactId: [null, [Validators.required]],
      contactName: ['', []],
      area: ['', [Validators.required]],
      userId: [null, [Validators.required]],
      userName: ['', []],
      itemId: ['', []],
      proId: [],
      sku: [''],
      productName: ['', []],
      qty: [null, []],
      unitPrice: [null, []],
      amount: [null, []],
      reference: ['', []],
      grossAmt: [null, []],
      netAmt: [null, []],
      uom: ['', []]

    });
    this.f.unitPrice.valueChanges.subscribe(val => {
      let amt = this.f.qty.value * val;
      this.f.amount.setValue(amt);

    });
    this.f.qty.valueChanges.subscribe(val => {
      let amt = val * this.f.unitPrice.value;
      this.f.amount.setValue(amt);

    });
    this.f.contactName.valueChanges.subscribe(val => {
      this.f.contactId.reset();
    });
    this.f.userName.valueChanges.subscribe(val => {
      this.f.userId.reset();
    });
  };

  public typeAhedProduct() {
    this.enquiryService.getProducts().subscribe(result => {
      this.responseDto = result;
      this.productDto = this.responseDto.data;
      this.productCode = _.pluck(this.responseDto.data, 'sku');
      this.itemName = _.pluck(this.responseDto.data, 'name');
    }, error => {
      console.log(error);
    });
  };
  public selectedProduct(item) {
    for (let p of this.productDto) {
      if (p.sku === item.item) {
        this.f.sku.setValue(p.sku);
        this.f.productName.setValue(p.name);
        this.f.qty.setValue(1);
        this.f.itemId.setValue(p.id);
        this.f.uom.setValue(p.uom);
      } else if (p.name === item.item) {
        this.f.sku.setValue(p.sku);
        this.f.productName.setValue(p.name);
        this.f.qty.setValue(1);
        this.f.itemId.setValue(p.id);
        this.f.uom.setValue(p.uom);
      }
    }
  };
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
      console.log(result.data);
    })
  };
  public selectedCustomer(cust) {
    this.customerDto.forEach(element => {
      if (element.displayName === cust) {
        this.f.contactId.setValue(element.id);
      }

    });
  }
  public typeAhedSales() {
    this.enquiryService.getSalesManList().subscribe(result => {
      this.salesDto = result.data;
      this.salesMan = _.pluck(this.salesDto, 'name');
    })
  }
  public selectedSale(sale) {
    this.salesDto.forEach(element => {
      if (element.name === sale) {
        this.f.userId.setValue(element.id);
      }

    });
  };

  //==================Add product code start=============================//
  checkProduct() {
    if (this.itemDto.length > 0) {
      this.productAdded = true;
    } else {
      this.productAdded = false;
    }
  }

  isProductValid() {
    if (this.f.qty.value <= 0 || this.f.unitPrice.value <= 0 || this.f.sku.value === '' || this.f.productName.value === '' || this.f.qty.value === null || this.f.unitPrice.value === null || this.f.amount.value === null || this.f.itemId.value === null) {
      if (this.f.itemId.value === null) {
        this.alerts.setMessage("Product Code And Name Invalid! Search For Product Via Code Or Name", 'warn')
      } else if (this.f.qty.value <= 0) {
        this.alerts.setMessage("Quantity can't be zero", 'warn')
      } else if (this.f.unitPrice.value <= 0) {
        this.alerts.setMessage("Unit price can't be zero", 'warn')
      }
      return false;
    } else {
      return true;
    }
  }
  addProduct() {
    this.productSubmit = true;
    if (this.productSubmit && this.isProductValid()) {
      this.item = {
        id: this.f.proId.value,
        itemId: this.f.itemId.value,
        qty: this.f.qty.value,
        unitPrice: this.f.unitPrice.value,
        amount: this.f.amount.value,
        reference: this.f.reference.value,
        name: this.f.productName.value,
        sku: this.f.sku.value,
        uom: this.f.uom.value

      }
      this.itemDto.push(this.item);
      this.total = this.total + this.f.amount.value;
      this.productSubmit = false;
      this.resetProduct();
    }
  };

  resetProduct() {
    this.f.itemId.reset(),
      this.f.qty.reset(),
      this.f.unitPrice.reset(),
      this.f.amount.reset(),
      this.f.reference.reset(),
      this.f.productName.reset(),
      this.f.sku.reset()
  };
  public calculate() {
    this.total = this.total;
  };

  editItem(item) {
    this.f.itemId.setValue(item.itemId);
    this.f.proId.setValue(item.id);
    this.f.qty.setValue(item.qty);
    this.f.unitPrice.setValue(item.unitPrice);
    this.f.amount.setValue(item.amount);
    this.f.reference.setValue(item.reference);
    this.f.productName.setValue(item.name);
    this.f.sku.setValue(item.sku);
    this.f.uom.setValue(item.uom);
    var index = this.itemDto.indexOf(item);
    this.total = this.total - this.f.amount.value;
    this.itemDto.splice(index, 1);
  }

  public authorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_EMP || this.loginService.getLoggedRole() === AppConstants._ROLE_SALE) {
      this.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.AUTHORIZED;
    }
    this.createEnquiry();
  }

  public unauthorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.UNAUTHORIZED_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.UNAUTHORIZED_BY_DIRECTOR;
    }
    this.createEnquiry();
  }

  public showHide() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER || this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      return true
    } else {
      return false;
    }
  }

  //=======================================Create Enquiry==========================//
  public createEnquiry() {
    if(this.itemDto.length > 0){
      this.delete();
    }else{
      this.alerts.setMessage("You need to add atleast one Product!!",'warn');
    }
    
  }
  public submitForm() {
    this.checkProduct();
    this.submitted = true;
    this.assembleData();
    if (this.salesEnquiryForm.valid && this.submitted && this.productAdded) {
      this.enquiryService.createEnquiry(this.salesEnquiryDto).subscribe(response => {
        this.submitted = false;
        if (response.code === 201) {
          this.alerts.setMessage(response.message, 'success');
          this.router.navigate(['/sales/enquiry']);
        }
      })
    } else {
      if (!this.productAdded) {
        this.alerts.setMessage("You need to add atleast one product!!", 'warn');
      }
      switch (this.f.contactId.value) {
        case null:
        case '':
        case undefined:
          this.alerts.setMessage("Invalid Contact Name! Search for valid contact Name", 'warn');
          break;
        default:
          console.log("Invalid Contact");
      }

      switch (this.f.userId.value) {
        case null:
        case '':
        case undefined:
          this.alerts.setMessage("Invalid Sales Man Name! Search for valid Sales Man", 'warn');
          break;
        default:
          console.log("Invalid Sales Man Name");
      }
    }
  }
  public assembleData() {
    this.selectedCustomer(this.f.contactName.value);
    this.selectedSale(this.f.userName.value);
    this.salesEnquiryDto = {
      id: this.f.id.value,
      enqNo: this.f.enqNo.value,
      enqDate: this.f.enqDate.value,
      link: this.f.link.value,
      paymentTerms: this.f.paymentTerms.value,
      warranty: this.f.warranty.value,
      narration: this.f.narration.value,
      serviceNo: this.f.serviceNo.value,
      status: this.status,
      contactId: this.f.contactId.value,
      userId: this.f.userId.value,
      grossAmt: this.total,
      netAmt: this.total,
      area: this.f.area.value,
      salesEnquiryItem: this.itemDto
    }
  };
  //==============================Delate Product Item========================//
  delete() {
    if (this.deletedProIds.length > 0) {
      this.deletedProIds.forEach(id => {
        this.enquiryService.deleteSalesEnquiryItemById(id).subscribe(res => {
          if (res.code === 200) {
            console.log("deleted item:: ");
          }
        });
        this.temp.push(id);
        if (this.deletedProIds.length === this.temp.length) {
          this.submitForm();
        }
      });
    } else {
      this.submitForm();
    }
  }

  deleteEnquiryItem(enq) {
    if (enq.id === null || enq.id === "") {
      var index = this.itemDto.indexOf(enq);
      this.itemDto.splice(index, 1);
      this.total -= enq.amount;
      console.log("delete Item ", index);
    } else {
      this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
        .then((confirmed) => {
          if (confirmed) {
            this.total -= enq.amount;
            var index = this.itemDto.indexOf(enq);
            this.itemDto.splice(index, 1);
            this.deletedProIds.push(enq.id);
          } else {
            console.log('Dismiss Alert');
          }
        });
    }
  };


  //==============================Get Enquiry By id ===============================//
  public getEnquiry(id) {
    this.enquiryService.getEnquiryById(id).subscribe(result => {
      if (result.code === 200) {
        this.bindingData(result.data);
      }
    })
  };
  public bindingData(data) {
    this.f.id.setValue(data.id);
    this.total = data.grossAmt;
    this.f.enqNo.setValue(data.enqNo);
    this.f.enqDate.setValue(this.constants.convert(data.enqDate));
    this.f.link.setValue(data.link);
    this.f.paymentTerms.setValue(data.paymentTerms);
    this.f.warranty.setValue(data.warranty);
    this.f.narration.setValue(data.narration);
    this.f.serviceNo.setValue(data.serviceNo);
    this.status = (data.status);
    this.f.contactId.setValue(data.contactId);
    this.f.contactName.setValue(data.customerName);
    this.f.userName.setValue(data.salesManName);
    this.f.userId.setValue(data.userId);
    this.f.grossAmt.setValue(data.grossAmt);
    this.f.area.setValue(data.area);
    this.itemDto = data.salesEnquiryItem;
  }
  get f() { return this.salesEnquiryForm.controls; }

  public reset() {
    this.f.enqDate.reset();
    this.f.link.reset();
    this.f.paymentTerms.reset();
    this.f.warranty.reset();
    this.f.narration.reset();
    this.f.serviceNo.reset();
    this.f.status.reset();
    this.f.contactId.reset();
    this.f.contactName.reset();
    this.f.area.reset();
    this.f.userId.reset();
    this.f.userName.reset();
    this.f.itemId.reset();
    this.f.sku.reset();
    this.f.productName.reset();
    this.f.qty.reset();
    this.f.unitPrice.reset();
    this.f.amount.reset();
    this.f.reference.reset();
    this.f.grossAmt.reset();
    this.f.netAmt.reset();
    this.f.uom.reset();
  }

}
