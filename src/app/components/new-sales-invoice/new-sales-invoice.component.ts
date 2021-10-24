import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SalesInvoiceDto } from '../../model/invoiceDto';
import { SalesInvoiceItemDto } from '../../model/invoiceItemDto';
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
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-new-sales-invoice',
  templateUrl: './new-sales-invoice.component.html',
  styleUrls: ['./new-sales-invoice.component.css']
})
export class NewSalesInvoiceComponent implements OnInit {
  deliveryForm: FormGroup;
  productForm: FormGroup;
  amt: number = 0;
  total: number = 0;
  totalAfterDis: number = 0;
  grandTotal: number = 0;
  productDto: any = [];
  invoiceDto: SalesInvoiceDto;
  itemDto: Array<SalesInvoiceItemDto> = [];
  itemDtos: Array<SalesInvoiceItemDto> = [];
  item: SalesInvoiceItemDto;
  customerDto: any = [];
  salesDto: any = [];
  contactSpecautoDto: ContactSpecDto;
  responseDto: ResponseDto;
  productList: Array<ItemDto> = [];
  productCode: Array<string> = [];
  itemName: Array<string> = [];
  customerName: Array<string> = [];
  salesMan: Array<string> = [];
  documents: Array<DocumentDto> = [];
  docs: Array<DocumentDto> = [];
  document: DocumentDto;
  documentsZone: Array<DocumentDto> = [];
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
    private invoiceService: SalesService,
    private constants: Constants,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alerts: AlertsService,
    private modalService: NgbModal,
    private documentService: DocumentService,
    private confirmationAlert: ConfirmationDialogService,
    private loginService: LoginService,
    private uaServ : UserAccessService
  ) { }

  ngOnInit() {
    this.initForm();
    this.initFormProduct();
    if (this.activatedRoute.snapshot.params['id']) {
      const id = this.activatedRoute.snapshot.params['id'];
      this.f.updatestock.setValue(false);
      if (localStorage.getItem('convFrom') === 'quotation') {
        this.getQuote(id);
      } else if (localStorage.getItem('convFrom') === 'order') {
        this.getOrder(id);
      } else if (localStorage.getItem('convFrom') === 'deliveryNote') {
        this.getDN(id);
      }
    }
    this.getInvoiceNO();
    this.typeAhedProduct();
    this.typeAhedCustomer();
    this.typeAhedSales();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('sales-invoice-date');
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
    this.deliveryForm = this.fb.group({
      id: [null, []],
      saleno: ['', [Validators.required]],
      saledate: [this.constants.convert(new Date), [Validators.required]],
      link: ['', []],
      paymentTerms: ['', [Validators.required]],
      warranty: ['', []],
      naration: ['', []],
      serviceno: ['', []],
      vatApplicable: ['', []],
      grossAmt: [null, []],
      discount: [null, []],
      vatperc: [null, []],
      sqtNo: [null, []],
      soNo: [null, []],
      deliveryNo: [null, []],
      salesEnquiryId: [null, []],
      quotId: [null, []],
      vat: [null, []],
      narration: ['', []],
      netAmt: [null, []],
      paidAmt: [null, []],
      remainingAmt: [null, []],
      status: ['', []],
      contactId: [null, [Validators.required]],
      contactName: ['', [Validators.required]],
      userId: [null, [Validators.required]],
      userName: ['', [Validators.required]],
      saleItem: ['', []],
      enquaryId: [null, []],
      orderId: [null, []],
      deliveryId: [null, []],
      updatestock: [true, []],
      advanceAmt: [null, []],
      area: ['', [Validators.required]],
      customerpono: ['', []]
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
    this.invoiceService.getProducts().subscribe(result => {
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
    this.invoiceService.getCustomerList(this.contactSpecautoDto).subscribe(result => {
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
    this.invoiceService.getSalesManList().subscribe(result => {
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
    if (this.psubmitted && this.productForm.valid && this.fc.itemId.value !== null && this.fc.qty.value > 0 && this.fc.unitPrice.value > 0) {
      this.item = {
        id: null,
        qty: this.fc.qty.value,
        unitPrice: this.fc.unitPrice.value,
        amount: this.fc.amount.value,
        discountPerc: null,
        discount: null,
        total: null,
        reference: this.fc.reference.value,
        productname:this.fc.productName.value,
        item: {
          id: this.fc.itemId.value,
          type: '',
          name: this.fc.productName.value,
          unit: null,
          sku: this.fc.sku.value,
          saleRate: null,
          saleAccount: '',
          saleDiscription: '',
          purchaseRate: null,
          purchaseAccount: '',
          purchaseDiscription: '',
          inventoryAccount: '',
          openingStock: null,
          stockRateperunit: null,
          uom: this.fc.uom.value,
        }
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

  editItem(item) {
    this.fc.itemId.setValue(item.item.id);
    this.fc.id.setValue(item.id);
    this.fc.qty.setValue(item.qty);
    this.fc.unitPrice.setValue(item.unitPrice);
    this.fc.amount.setValue(item.amount);
    this.fc.reference.setValue(item.reference);
    this.fc.productName.setValue(item.item.name);
    this.fc.sku.setValue(item.item.sku);
    this.fc.uom.setValue(item.item.uom);
    this.total -= item.amount;
    this.calculate();
    var index = this.itemDto.indexOf(item);
    this.itemDto.splice(index, 1);
  };

  //=======================================Get Delivery NO ======================//
  public getInvoiceNO() {
    this.invoiceService.getEntityId(this.constants.SALE_INVOICE).subscribe(result => {
      this.f.saleno.setValue(result.message);
    })
  }
  //=======================================Create Delovery Note==========================//
  public createInvoice() {
    this.checkProduct();
    this.uploadDocument();
  };

  submitForm() {
    this.submitted = true;
    this.assembleData();
    if (this.submitted && this.deliveryForm.valid && this.productAdded) {
      this.invoiceService.createSalesInvoice(this.invoiceDto).subscribe(response => {
        if (response.code === 201) {
          this.submitted = false;
          this.alerts.setMessage(response.message, 'success');
          this.router.navigate(['/sales/invoice']);
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
        this.documentService.uploadDocument(this.docs[index]).subscribe(response => {
          if (response.code === 201) {
            this.documentsZone.push(response.data);
            if (this.documentsZone.length === this.docs.length) {
              this.assembleData();
              this.assembleDocument();
              this.submitForm();
            }
          }
        })
      })
    } else {
      this.assembleData();
      this.submitForm();
    }
  };
  public assembleDocument() {
    this.documentsZone.forEach(val => {
      this.document = {
        id: val.id,
        name: val.name,
        fileName: val.fileName,
        fileType: val.fileType,
        path: val.path,
        store: val.store,
      };
      this.documents.push(this.document);
    })
  }
  public assembleData() {
    this.selectedCustomer(this.f.contactName.value);
    this.selectedSale(this.f.userName.value);
    this.invoiceDto = {
      id: this.f.id.value,
      saleno: this.f.saleno.value,
      saledate: this.f.saledate.value,
      link: this.f.link.value,
      paymentTerms: this.f.paymentTerms.value,
      warranty: this.f.warranty.value,
      naration: this.f.naration.value,
      serviceno: this.f.serviceno.value,
      vatApplicable: this.f.vatApplicable.value,
      grossAmt: this.total,
      discount: this.f.discount.value,
      vatperc: this.f.vatperc.value,
      vat: this.f.vat.value,
      netAmt: this.grandTotal,
      paidAmt: this.f.paidAmt.value,
      remainingAmt: this.f.remainingAmt.value,
      status: this.status,
      contactId: this.f.contactId.value,
      userId: this.f.userId.value,
      saleItem: this.itemDto,
      enquaryId: this.f.enquaryId.value,
      quotId: this.f.quotId.value,
      orderId: this.f.orderId.value,
      deliveryId: this.f.deliveryId.value,
      updatestock: this.f.updatestock.value,
      advanceAmt: this.f.advanceAmt.value,
      documents: this.documents,
      area: this.f.area.value,
      customerpono: this.f.customerpono.value
    }
  };
  //==============================Delate Product Item========================//
  deleteInvItem(item) {
    if (item.id === null || item.id === "") {
      var index = this.itemDto.indexOf(item);
      this.total -= item.amount;
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
            this.invoiceService.deleteSalesInvoiceItemById(item.id).subscribe(result => {
              this.alerts.setMessage(result.message, 'success');
              var index = this.itemDto.indexOf(item);
              this.total -= item.amount;
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
  //==============================Get Order By id ===============================//
  public getDN(id) {
    this.invoiceService.getDeliveryNoteById(id).subscribe(result => {
      if (result.code === 200) {
        this.bindDnData(result.data);
        this.calculate();
      }
    })
  };
  public bindDnData(data) {
    this.total = data.grossAmt;
    this.f.sqtNo.setValue(data.sqtNo);
    // if (data.deliveryDate) {
    //   this.f.saledate.setValue(new Date(data.deliveryDate));
    // } else {
    //   this.f.saledate.setValue(data.deliveryDate);
    // }
    this.documents = data.documents;
    this.f.deliveryNo.setValue(data.deliveryNo);
    this.f.soNo.setValue(data.soNo);
    this.f.link.setValue(data.link);
    this.f.deliveryId.setValue(data.id);
    this.f.salesEnquiryId.setValue(data.salesEnquiryId);
    this.f.quotId.setValue(data.quotId);
    this.f.paymentTerms.setValue(data.paymentTerms);
    this.f.warranty.setValue(data.warranty);
    this.f.discount.setValue(data.discount);
    this.f.naration.setValue(data.narration);
    this.f.serviceno.setValue(data.serviceNo);
    this.f.status.setValue('');
    this.f.contactName.setValue(data.customerName);
    this.selectedCustomer(data.customerName);
    this.selectedSale(data.salesManName);
    this.f.userName.setValue(data.salesManName);
    this.f.grossAmt.setValue(data.grossAmt);
    this.f.area.setValue(data.area);
    this.f.customerpono.setValue(data.customerpono);
    // this.itemDto = data.soItem;
    for (let p of data.deliveryNoteItems) {
      this.item = {
        id: null,
        qty: p.qty,
        unitPrice: p.unitPrice,
        amount: p.amount,
        discountPerc: p.discountPerc,
        discount: p.discount,
        total: p.total,
        reference: p.reference,
        productname:p.name,
        item: {
          id: p.itemId,
          type: '',
          name: p.name,
          unit: null,
          sku: p.sku,
          saleRate: null,
          saleAccount: '',
          saleDiscription: '',
          purchaseRate: null,
          purchaseAccount: '',
          purchaseDiscription: '',
          inventoryAccount: '',
          openingStock: null,
          stockRateperunit: null,
          uom: p.uom,
        }
      }
      this.itemDto.push(this.item);
    }
  };

  public getOrder(id) {
    this.invoiceService.getSalesOrderById(id).subscribe(res => {
      if (res.code === 200) {
        this.bindOrderData(res.data);
        this.calculate();
      }
    });
  }

  public bindOrderData(data) {
    this.total = data.grossAmt;
    this.f.sqtNo.setValue('');
    // if (data.orderdate) {
    //   this.f.saledate.setValue(new Date(data.orderdate));
    // } else {
    //   this.f.saledate.setValue(data.orderdate);
    // }
    this.documents = data.documents;
    this.f.deliveryNo.setValue('');
    this.f.soNo.setValue(data.orderno);
    this.f.link.setValue(data.link);
    this.f.deliveryId.setValue(null);
    this.f.orderId.setValue(data.id);
    this.f.salesEnquiryId.setValue(data.enquiryId);
    this.f.quotId.setValue(data.quotId);
    this.f.paymentTerms.setValue(data.paymentTerms);
    this.f.warranty.setValue(data.warranty);
    this.f.discount.setValue(data.discount);
    this.f.naration.setValue(data.naration);
    this.f.serviceno.setValue(data.serviceno);
    this.f.status.setValue('');
    this.f.contactName.setValue(data.customerName);
    this.selectedCustomer(data.customerName);
    this.selectedSale(data.salesManName);
    this.f.userName.setValue(data.salesManName);
    this.f.grossAmt.setValue(data.grossAmt);
    this.f.area.setValue(data.area);
    this.f.customerpono.setValue(data.customerpono);
    // this.itemDto = data.soItem;
    for (let p of data.soItem) {
      this.item = {
        id: null,
        qty: p.qty,
        unitPrice: p.unitPrice,
        amount: p.amount,
        discountPerc: p.discountPerc,
        discount: p.discount,
        total: p.total,
        reference: p.reference,
        productname:p.name,
        item: {
          id: p.itemId,
          type: '',
          name: p.name,
          unit: null,
          sku: p.sku,
          saleRate: null,
          saleAccount: '',
          saleDiscription: '',
          purchaseRate: null,
          purchaseAccount: '',
          purchaseDiscription: '',
          inventoryAccount: '',
          openingStock: null,
          stockRateperunit: null,
          uom: p.uom,
        }
      }
      this.itemDto.push(this.item);
    }
  };

  public getQuote(id) {
    this.invoiceService.getSalesQuotationById(id).subscribe(res => {
      if (res.code === 200) {
        this.bindQuoteData(res.data);
        this.calculate();
      }
    });
  }

  public bindQuoteData(data) {
    this.total = data.grossAmt;
    this.f.sqtNo.setValue(data.quoteno);
    // if (data.quoteDate) {
    //   this.f.saledate.setValue(new Date(data.quoteDate));
    // } else {
    //   this.f.saledate.setValue(data.quoteDate);
    // }
    this.documents = data.documents;
    this.f.deliveryNo.setValue('');
    this.f.soNo.setValue('');
    this.f.link.setValue(data.link);
    this.f.deliveryId.setValue(null);
    this.f.salesEnquiryId.setValue(data.enquiryId);
    this.f.quotId.setValue(data.id);
    this.f.paymentTerms.setValue(data.paymentTerms);
    this.f.warranty.setValue(data.warranty);
    this.f.discount.setValue(data.discount);
    this.f.naration.setValue(data.naration);
    this.f.serviceno.setValue(data.serviceno);
    this.f.status.setValue('');
    this.f.contactName.setValue(data.customerName);
    this.selectedCustomer(data.customerName);
    this.selectedSale(data.salesManName);
    this.f.userName.setValue(data.salesManName);
    this.f.grossAmt.setValue(data.grossAmt);
    this.f.area.setValue(data.area);
    // this.itemDto = data.soItem;
    for (let p of data.sqtItem) {
      this.item = {
        id: null,
        qty: p.qty,
        unitPrice: p.unitPrice,
        amount: p.amount,
        discountPerc: p.discountPerc,
        discount: p.discount,
        total: p.total,
        reference: p.reference,
        productname:p.name,
        item: {
          id: p.itemId,
          type: '',
          name: p.name,
          unit: null,
          sku: p.sku,
          saleRate: null,
          saleAccount: '',
          saleDiscription: '',
          purchaseRate: null,
          purchaseAccount: '',
          purchaseDiscription: '',
          inventoryAccount: '',
          openingStock: null,
          stockRateperunit: null,
          uom: p.uom,
        }
      }
      this.itemDto.push(this.item);
    }
  };


  get f() { return this.deliveryForm.controls; }
  get fc() { return this.productForm.controls; }
  //new//

  //=======================================Drop Zone Code =========================//
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

  public removeFile(image) {
    var index = this.documents.indexOf(image);
    this.documents.splice(index, 1);
    this.documentService.deleteDocument(image.id).subscribe(response => {
      if (response.code === 200) {
        console.log("document deleted Softly :: ");
      }
    })
  }

  public download(doc) {
    let byteCharacters = atob(doc.doc);
    let byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], { "type": doc.fileType });
    if (navigator.msSaveBlob) {
      let filename = doc.fileName.split(".");
      navigator.msSaveBlob(blob, filename);
    } else {
      let link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute('visibility', 'hidden');
      link.download = doc.fileName.split(".", 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  reset() {
    this.resetProduct();
    this.f.saledate.reset();
    this.f.link.reset();
    this.f.paymentTerms.reset();
    this.f.warranty.reset();
    this.f.naration.reset();
    this.f.serviceno.reset();
    this.f.sqtNo.reset();
    this.f.soNo.reset();
    this.f.deliveryNo.reset();
    this.f.salesEnquiryId.reset();
    this.f.quotId.reset();
    this.f.narration.reset();
    this.f.status.reset();
    this.f.contactId.reset();
    this.f.contactName.reset();
    this.f.userId.reset();
    this.f.userName.reset();
    this.f.saleItem.reset();
    this.f.enquaryId.reset();
    this.f.quotId.reset();
    this.f.orderId.reset();
    this.f.deliveryId.reset();
    this.f.updatestock.reset();
    this.f.area.reset();
    this.f.customerpono.reset();
  }

  public authorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_EMP || this.loginService.getLoggedRole() === AppConstants._ROLE_SALE) {
      this.status = this.constants.PENDING_APPROVAL_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.PENDING_APPROVAL_BY_DIRECTOR;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.AUTHORIZED;
    }
    this.createInvoice();
  }

}
