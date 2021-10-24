import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SalesOrderDto } from '../../model/salesOrderDto';
import { SalesOrderItemDto } from '../../model/salesOrdeItemDto';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { ResponseDto } from '../../model/ResponseDto';
import { ItemDto } from '../../model/itemDto';
import { Observable } from 'rxjs';
import * as _ from 'underscore';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SalesService } from '../../services/sales.service';
import { Constants } from '../../commons/constant';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from '../add-customer-modal/add-customer-modal.component';
import { DocumentDto } from '../../model/documentDto';
import { DocumentService } from '../../services/document.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-new-sales-order',
  templateUrl: './new-sales-order.component.html',
  styleUrls: ['./new-sales-order.component.css']
})
export class NewSalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  productForm: FormGroup;
  amt: number = 0;
  total: number = 0;
  totalAfterDis: number = 0;
  grandTotal: number = 0;
  productDto: any = [];
  salesOrderDto: SalesOrderDto;
  itemDto: Array<SalesOrderItemDto> = [];
  itemDtos: Array<SalesOrderItemDto> = [];
  item: SalesOrderItemDto;
  customerDto: any = [];
  salesDto: any = [];
  contactSpecautoDto: ContactSpecDto;
  responseDto: ResponseDto
  productList: Array<ItemDto> = [];
  productCode: Array<string> = [];
  itemName: Array<string> = [];
  customerName: Array<string> = [];
  salesMan: Array<string> = [];
  documents: Array<DocumentDto> = [];
  docs: Array<DocumentDto> = [];
  document: DocumentDto;
  submitted: boolean = false;
  psubmitted: boolean = false;
  productAdded: boolean = false;
  status = this.constants.SAVED;
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
    private orderService: SalesService,
    private constants: Constants,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alerts: AlertsService,
    private modalService: NgbModal,
    private documentService: DocumentService,
    private confirmationAlert: ConfirmationDialogService,
    private loginService: LoginService,
    private spinner: SpinnerVisibilityService,
    private uaServ : UserAccessService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initFormProduct();
    if (this.activatedRoute.snapshot.params['id']) {
      const id = this.activatedRoute.snapshot.params['id'];
      this.getQuotation(id);
    }
    this.getPoNumber();
    this.typeAhedProduct();
    this.typeAhedCustomer();
    this.typeAhedSales();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('sales-order-date');
  };

  openFormModal() {
    const modalRef = this.modalService.open(AddCustomerModalComponent);

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      this.typeAhedCustomer();
      console.log(error);
    });
  };

  public initForm() {
    this.salesOrderForm = this.fb.group({
      id: [null, []],
      orderno: ['', [Validators.required]],
      orderdate: [this.constants.convert(new Date), [Validators.required]],
      link: ['', []],
      paymentTerms: ['', [Validators.required]],
      warranty: ['', []],
      naration: ['', []],
      sqtNo: [null, []],
      serviceno: ['', []],
      vatApplicable: ['', []],
      grossAmt: [null, []],
      discount: [null, []],
      vatperc: [null, []],
      vat: [null, []],
      netAmt: [null, []],
      paidAmt: [null, []],
      remainingAmt: [null, []],
      status: ['', []],
      contactId: [null, [Validators.required]],
      contactName: ['', [Validators.required]],
      quotId: [null, []],
      userId: [null, [Validators.required]],
      userName: ['', [Validators.required]],
      sqtItem: ['', []],
      enquaryId: ['', []],
      area: ['', [Validators.required]],
      customerpono : [null,[]],
    });
    this.f.discount.valueChanges.subscribe(val => {
      if (val > this.total) {
        this.f.discount.setValue(0);
      }
      this.calculateGrandTotal();
    });
    this.f.contactName.valueChanges.subscribe(val => {
      this.f.contactId.reset();
    });
    this.f.userName.valueChanges.subscribe(val => {
      this.f.userId.reset();
    });
  };
  initFormProduct() {
    this.productForm = this.fb.group({
      unitPrice: [null, [Validators.required]],
      sku: ['', [Validators.required]],
      amount: [null, [Validators.required]],
      productName: ['', [Validators.required]],
      reference: ['', []],
      qty: [null, [Validators.required]],
      itemId: [null, []],
      id: [null, []],
      uom: ['', []]
    });
    this.fc.unitPrice.valueChanges.subscribe(val => {
      this.fc.amount.setValue(val * this.fc.qty.value);
    });
    this.fc.qty.valueChanges.subscribe(val => {
      this.fc.amount.setValue(val * this.fc.unitPrice.value);
    });
  }

  public typeAhedProduct() {
    this.orderService.getProducts().subscribe(result => {
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
        this.fc.sku.setValue(p.sku);
        this.fc.productName.setValue(p.name);
        this.fc.qty.setValue(1);
        this.fc.itemId.setValue(p.id);
        this.fc.uom.setValue(p.uom);
      } else if (p.name === item.item) {
        this.fc.sku.setValue(p.sku);
        this.fc.productName.setValue(p.name);
        this.fc.qty.setValue(1);
        this.fc.itemId.setValue(p.id);
        this.fc.uom.setValue(p.uom);
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
    this.orderService.getCustomerList(this.contactSpecautoDto).subscribe(result => {
      this.customerDto = result.data;
      this.customerName = _.pluck(this.customerDto, 'displayName');
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
    this.orderService.getSalesManList().subscribe(result => {
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

  addProduct() {
    this.psubmitted = true;
    if (this.productForm.valid && this.psubmitted && this.fc.itemId.value !== null && this.fc.qty.value > 0 && this.fc.unitPrice.value > 0) {
      this.item = {
        id: this.fc.id.value,
        itemId: this.fc.itemId.value,
        qty: this.fc.qty.value,
        unitPrice: this.fc.unitPrice.value,
        amount: this.fc.amount.value,
        reference: this.fc.reference.value,
        name: this.fc.productName.value,
        sku: this.fc.sku.value,
        uom: this.fc.uom.value
      }
      this.itemDto.push(this.item);
      this.total += this.fc.amount.value;
      this.calculate();
      this.psubmitted = false;
      this.resetProduct();
    } else {
      if (this.fc.itemId.value === null) {
        this.alerts.setMessage("Invalid Product!! Search Product Either By Name Or code", 'warn');
      }
      if (this.fc.qty.value <= 0) {
        this.alerts.setMessage("Quantity can't be zero", 'warn');
      }
      if (this.fc.unitPrice.value <= 0) {
        this.alerts.setMessage("Unit price can't be zero", 'warn');
      }
    }
  };

  resetProduct() {
    this.fc.itemId.reset(),
      this.fc.id.reset(),
      this.fc.qty.reset(),
      this.fc.unitPrice.reset(),
      this.fc.amount.reset(),
      this.fc.reference.reset(),
      this.fc.productName.reset(),
      this.fc.sku.reset()
  };
  public calculate() {
    this.f.vatperc.setValue(this.constants.VAT_PERCENTAGE);
    this.calculateGrandTotal();
  };
  public calculateGrandTotal() {
    this.totalAfterDis = this.total - this.f.discount.value;
    let vat = (this.totalAfterDis * this.constants.VAT_PERCENTAGE) / 100;
    this.f.vat.setValue(vat);
    this.grandTotal = this.totalAfterDis + vat;

  };

  editItem(quote) {
    this.fc.itemId.setValue(quote.itemId);
    this.fc.id.setValue(quote.id);
    this.fc.qty.setValue(quote.qty);
    this.fc.unitPrice.setValue(quote.unitPrice);
    this.fc.amount.setValue(quote.amount);
    this.fc.reference.setValue(quote.reference);
    this.fc.productName.setValue(quote.name);
    this.fc.sku.setValue(quote.sku);
    this.fc.uom.setValue(quote.uom);
    this.total -= quote.amount;
    this.calculate();
    var index = this.itemDto.indexOf(quote);
    this.itemDto.splice(index, 1);
  };
  //================================================Get Po Number====================//
  public getPoNumber() {
    this.orderService.getEntityId(this.constants.SALE_ORDER).subscribe(response => {
      this.f.orderno.setValue(response.message);
    })
  }

  //=======================================Create Order==========================//
  public createOrder() {
    this.checkProduct();
    this.submitted = true;
    this.uploadDocument();
  };
  submitForm() {
    if (this.submitted && this.salesOrderForm.valid && this.productAdded) {
      this.orderService.createSalesOrder(this.salesOrderDto).subscribe(response => {
        this.submitted = false;
        if (response.code === 201) {
          this.alerts.setMessage(response.message, 'success');
          this.router.navigate(['/sales/order']);
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

  uploadDocument() {
    if (this.docs.length > 0) {
      this.docs.forEach(val => {
        var index = this.docs.indexOf(val);
        setTimeout(() => {
          this.documentService.uploadDocument(this.docs[index]).subscribe(response => {
            if (response.code === 201) {
              this.documents.push(response.data);
              if (this.documents.length === this.docs.length) {
                this.assembleData();
                this.submitForm();
              }
            }
          })
        }, 3000);

      })
    } else {
      this.assembleData();
      this.submitForm();
    }
  }

  public assembleData() {
    this.selectedCustomer(this.f.contactName.value);
    this.selectedSale(this.f.userName.value);
    this.salesOrderDto = {
      id: this.f.id.value,
      orderno: this.f.orderno.value,
      orderdate: this.f.orderdate.value,
      link: this.f.link.value,
      paymentTerms: this.f.paymentTerms.value,
      warranty: this.f.warranty.value,
      naration: this.f.naration.value,
      serviceno: this.f.serviceno.value,
      vatApplicable: this.f.vatApplicable.value,
      grossAmt: this.total,
      discount: this.f.discount.value,
      vatperc: this.constants.VAT_PERCENTAGE,
      vat: this.f.vat.value,
      netAmt: this.grandTotal,
      paidAmt: this.f.paidAmt.value,
      remainingAmt: this.f.remainingAmt.value,
      status: this.status,
      contactId: this.f.contactId.value,
      userId: this.f.userId.value,
      enquaryId: this.f.enquaryId.value,
      quotId: this.f.quotId.value,
      sqtNo: this.f.sqtNo.value,
      soItem: this.itemDto,
      documents: this.documents,
      area: this.f.area.value,
      customerpono: this.f.customerpono.value
      
    }
  };

  //==============================Delate Product Item========================//
  deleteQuoteItem(quote) {
    if (quote.id === null || quote.id === "") {
      var index = this.itemDto.indexOf(quote);
      this.total -= quote.amount;
      if (this.total <= this.f.discount.value) {
        this.f.discount.setValue(0);
      }
      this.itemDto.splice(index, 1);
      if (this.itemDto.length === 0) {
        this.f.vat.setValue(0);
        this.f.discount.setValue(0);
      }
      this.calculate();
      console.log("delete Item ", index);
    } else {
      this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
        .then((confirmed) => {
          if (confirmed) {
            this.orderService.deleteSalesOrderItem(quote.id).subscribe(result => {
              this.alerts.setMessage(result.message, 'success');
              var index = this.itemDto.indexOf(quote);
              this.total -= quote.amount;
              this.itemDto.splice(index, 1);
              if (this.itemDto.length === 0) {
                this.f.vat.setValue(0);
                this.f.discount.setValue(0);
              }
              this.calculate();
            });
          } else {
            console.log('Dismiss Alert');
          }
        });
    }
  };
  //==============================Get Quotation By id ===============================//
  public getQuotation(id) {
    this.orderService.getSalesQuotationById(id).subscribe(result => {
      if (result.code === 200) {
        this.bindingData(result.data);
        this.calculate();
      }
    })
  };
  public bindingData(data) {
    this.total = data.grossAmt;
    this.f.enquaryId.setValue(data.enquiryId);
    this.f.sqtNo.setValue(data.quoteno);
    this.f.link.setValue(data.link);
    this.f.quotId.setValue(data.id);
    this.f.paymentTerms.setValue(data.paymentTerms);
    this.f.warranty.setValue(data.warranty);
    this.f.naration.setValue(data.naration);
    this.f.discount.setValue(data.discount);
    this.f.serviceno.setValue(data.serviceno);
    this.f.status.setValue('');
    this.f.contactId.setValue(data.contactId);
    this.f.contactName.setValue(data.customerName);
    this.f.userId.setValue(data.userId);
    this.f.userName.setValue(data.salesManName);
    this.f.grossAmt.setValue(data.grossAmt);
    this.f.area.setValue(data.area);
    this.f.customerpono.setValue(data.customerpono);
    
    data.sqtItem.forEach(item => {
      this.item = {
        id: null,
        qty: item.qty,
        unitPrice: item.unitPrice,
        amount: item.amount,
        reference: item.reference,
        itemId: item.itemId,
        name: item.name,
        sku: item.sku,
        uom: item.uom,
      }
      this.itemDto.push(this.item);
    });

  }
  get f() { return this.salesOrderForm.controls; }
  get fc() { return this.productForm.controls; }

  //==================================Upload Document Drop Zone==============================//
  public onUploadError(args: any): void {
    console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    console.log('onUploadSuccess:', args);
    this.docs.push(args[0]);
  };

  onFileRemoved(event: any) {
    console.log('Removed.');
    console.log(event);
    if (event.accepted === true) {
      var index = this.docs.indexOf(event);
      this.docs.splice(index, 1);
    }
  };

  //===================================================================================================////
  reset() {
    this.resetProduct();
    this.f.orderdate.reset();
    this.f.link.reset();
    this.f.paymentTerms.reset();
    this.f.warranty.reset();
    this.f.naration.reset();
    this.f.sqtNo.reset();
    this.f.serviceno.reset();
    this.f.status.reset();
    this.f.contactId.reset();
    this.f.contactName.reset();
    this.f.quotId.reset();
    this.f.userId.reset();
    this.f.userName.reset();
    this.f.sqtItem.reset();
    this.f.enquaryId.reset();
    this.f.area.reset();
  }

  public authorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_EMP || this.loginService.getLoggedRole() === AppConstants._ROLE_SALE) {
      this.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.AUTHORIZED;
    }
    this.createOrder();
  }
}
