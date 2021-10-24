import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { Constants } from '../../commons/constant';
import * as _ from 'underscore';
import { SalesService } from '../../services/sales.service';
import { ResponseDto } from '../../model/ResponseDto';
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { ItemDto } from '../../model/itemDto';
import { PurchaseInvoiceDto } from '../../model/purchaseInvoiceDto';
import { PurchaseInvoiceItemDto } from '../../model/purchaseInvoiceItemDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from '../add-customer-modal/add-customer-modal.component';
import { DocumentDto } from '../../model/documentDto';
import { DocumentService } from '../../services/document.service';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { UserAccessService } from 'src/app/user-access.service';


@Component({
  selector: 'app-new-purchase-invoice',
  templateUrl: './new-purchase-invoice.component.html',
  styleUrls: ['./new-purchase-invoice.component.css']
})
export class NewPurchaseInvoiceComponent implements OnInit {


  lpoInfo: any;
  documentsZone: Array<DocumentDto> = [];
  totalAfterDis: number = null;
  amt: number = 0;
  total: number = 0;
  grandTotal: number;
  item: PurchaseInvoiceItemDto;
  item1: any = {};
  poForm: FormGroup;
  submitted: boolean = false;
  psubmitted: boolean = false;
  productCode: Array<string> = [];
  itemName: Array<string> = [];
  customerName: Array<string> = [];
  salesMan: Array<string> = [];
  contactSpecautoDto: ContactSpecDto;
  productForm: FormGroup;
  customerDto: any = [];
  salesDto: any = [];
  responseDto: ResponseDto
  productDto: any = [];
  itemDto: Array<PurchaseInvoiceItemDto> = [];
  purchInvDto: PurchaseInvoiceDto;
  i: ItemDto;
  documents: Array<DocumentDto> = [];
  docs: Array<DocumentDto> = [];
  document: DocumentDto;
  productAdded: boolean = false;
  status = this.constants.SAVED;
  isReadOnly : boolean = false;
  // typeahed for Customer NAME
  customerNme = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.customerName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
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
  // typeahed for SALES MAN
  saleMan = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.salesMan.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  constructor(private lpoService: PurchaseService, private uaServ : UserAccessService ,private fb: FormBuilder, private router: Router, private salesService: SalesService, private constants: Constants, private alerts: AlertsService, private confirmationAlert: ConfirmationDialogService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private documentService: DocumentService, private loginService: LoginService) { }

  ngOnInit() {
    this.initForm();
    if (this.activatedRoute.snapshot.params['id']) {
      const id = this.activatedRoute.snapshot.params['id']
      this.getLPOById(id);
      this.initProductForm();
      this.getEnqNo();
      this.typeAhedProduct();
      this.typeAhedCustomer();
      this.typeAhedSales();
    } else {
      this.initProductForm();
      this.getEnqNo();
      this.typeAhedProduct();
      this.typeAhedCustomer();
      this.typeAhedSales();
    }
    this.isReadOnly = !this.uaServ.getMasterModules().includes('purchase-invoice-date');

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

  public initProductForm() {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required]],
      reference: ['', []],
      sku: ['', [Validators.required]],
      id: [null, []],
      applyDiscount: [null, []],
      qty: [null, [Validators.required]],
      unitPrice: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      discountPerc: [null, []],
      discount: [null, []],
      total: [null, []],
      itemId: [null, []],
      poId: [null, []],
      uom: ['', []]
    });
    this.c.unitPrice.valueChanges.subscribe(val => {
      let amt = this.c.qty.value * val;
      this.c.amount.setValue(amt);
    });

    this.c.qty.valueChanges.subscribe(val => {
      let amt = val * this.c.unitPrice.value;
      this.c.amount.setValue(amt);
    });

  }
  public initForm() {
    this.poForm = this.fb.group({
      id: [null, []],
      grnno: ['', [Validators.required]],
      grndate: [this.constants.convert(new Date) , [Validators.required]],
      refno: ['', []],
      paymentTerms: ['', [Validators.required]],
      vatApplicable: ['', []],
      grossAmt: [null, []],
      discount: [null, []],
      vatperc: [null, []],
      vat: [null, []],
      netAmt: [null, []],
      paidAmt: [null, []],
      remainingAmt: [null, []],
      notes: ['', []],
      tnc: ['', []],
      status: ['', []],
      advanceAmt: [null, []],
      contactName: ['', [Validators.required]],
      contactId: [null, [Validators.required]],
      userName: ['', [Validators.required]],
      userId: [null, [Validators.required]],
      grnItem: ['', []],
      documents: [],
      serviceno: ['', []],
      warranty: ['', []],
      naration: ['', []],
      poId: [null, []],
      // area:['',[Validators.required]]
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

  submit() {
    this.submitted = true;
    // if ( this.productForm.valid ) {
    //   let itemDto : ItemDto = this.productForm.value;
    //   this.inventoryService.addNewItem(itemDto).subscribe((response : ResponseDto) => {
    //     alert('Item added to list');
    //     this.router.navigate(['inventory/item'])
    //   });
    // }

  }

  public typeAhedCustomer() {
    this.contactSpecautoDto = {
      "contactname": "",
      "companyName": "",
      "displayName": "",
      "type": this.constants.VENDOR,
      "email": "",
      "page": 1,
      "size": 100
    }
    
    this.salesService.getCustomerList(this.contactSpecautoDto).subscribe(result => {
      this.customerDto = result.data;
      this.customerName = _.pluck(result.data, 'displayName');
      console.log(result.data);
    })
  };
  public getEnqNo() {
    this.salesService.getEntityId(this.constants.PURCHASE_INVOICE).subscribe(result => {
      if (result.code === 200) {
        this.f.grnno.setValue(result.message);
      }
    })
  }
  public typeAhedProduct() {
    this.salesService.getProducts().subscribe(result => {
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
        this.c.sku.setValue(p.sku);
        this.c.productName.setValue(p.name);
        this.c.qty.setValue(1);
        this.c.itemId.setValue(p.id);
        this.c.uom.setValue(p.uom);
      } else if (p.name === item.item) {
        this.c.sku.setValue(p.sku);
        this.c.productName.setValue(p.name);
        this.c.qty.setValue(1);
        this.c.itemId.setValue(p.id);
        this.c.uom.setValue(p.uom);
      }
    }
  };


  public selectedCustomer(cust) {
    this.customerDto.forEach(element => {
      if (element.displayName === cust) {
        this.f.contactId.setValue(element.id);
      }
    });
  }
  public typeAhedSales() {
    this.salesService.getSalesManList().subscribe(result => {
      this.salesDto = result.data;
      this.salesMan = _.pluck(this.salesDto, 'name');
      console.log(result.data);
    })
  }
  public selectedSales(sale) {
    this.salesDto.forEach(element => {
      if (element.name === sale) {
        this.f.userId.setValue(element.id);
      }

    });
  }

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
    if (this.psubmitted && this.productForm.valid && this.c.itemId.value !== null && this.c.qty.value > 0 && this.c.unitPrice.value > 0) {
      this.item = {
        reference: this.c.reference.value,
        id: this.c.id.value,
        applyDiscount: this.c.applyDiscount.value,
        qty: this.c.qty.value,
        unitPrice: this.c.unitPrice.value,
        amount: this.c.amount.value,
        discountPerc: this.c.discountPerc.value,
        discount: this.c.discount.value,
        total: this.c.total.value,
        productname:this.c.productName.value,
        item: {
          id: this.c.itemId.value,
          name: this.c.productName.value,
          sku: this.c.sku.value,
          type: '',
          uom: this.c.uom.value
        }
      }
      this.itemDto.push(this.item);
      this.total += this.c.amount.value;
      this.calculate();
      this.psubmitted = false;
      this.resetProduct();
    } else {
      if (this.c.itemId.value === null) {
        this.alerts.setMessage("Invalid Product!! Search Product Either By Name Or code", 'warn');
      }
      if (this.c.qty.value <= 0) {
        this.alerts.setMessage("Quantity can't be zero", 'warn');
      }
      if (this.c.unitPrice.value <= 0) {
        this.alerts.setMessage("Unit price can't be zero", 'warn');
      }
    }
  };

  resetProduct() {
    this.productForm.reset();
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
    // this.f.netAmt.setValue(this.grandTotal);

  };

  editItem(item) {
    this.c.id.setValue(item.id);
    this.c.itemId.setValue(item.item.id);
    this.c.qty.setValue(item.qty);
    this.c.unitPrice.setValue(item.unitPrice);
    this.c.amount.setValue(item.amount);
    this.c.reference.setValue(item.reference);
    this.c.productName.setValue(item.item.name);
    this.c.sku.setValue(item.item.sku);
    this.c.uom.setValue(item.item.uom);
    this.total -= item.amount;
    this.calculate();
    var index = this.itemDto.indexOf(item);
    this.itemDto.splice(index, 1);
  }

  //=======================================Create Purchase Invoice==========================//
  public createInvoice() {
    this.checkProduct();
    this.uploadDocument();
  }

  submitForm() {
    this.submitted = true;
    this.assembleData();
    if (this.submitted && this.poForm.valid && this.productAdded) {
      this.lpoService.createPurchaseInvoice(this.purchInvDto).subscribe(response => {
        this.submitted = false;
        if (response.code === 201) {
          this.alerts.setMessage(response.message, 'success');
          this.router.navigate(['/purchase/invoice']);
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
              this.assembleDocument();
              this.submitForm();
            }
          }
        })
      })
    } else {
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
    this.selectedSales(this.f.userName.value);
    this.purchInvDto = {
      id: this.f.id.value,
      grnno: this.f.grnno.value,
      grndate: this.f.grndate.value,
      refno: this.f.refno.value,
      paymentTerms: this.f.paymentTerms.value,
      vatApplicable: this.f.vatApplicable.value,
      grossAmt: this.total,
      discount: this.f.discount.value,
      vatperc: this.f.vatperc.value,
      vat: this.f.vat.value,
      netAmt: this.grandTotal,
      paidAmt: this.f.paidAmt.value,
      remainingAmt: this.f.remainingAmt.value,
      notes: this.f.notes.value,
      tnc: this.f.tnc.value,
      status: this.status,
      advanceAmt: this.f.advanceAmt.value,
      contactId: this.f.contactId.value,
      userId: this.f.userId.value,
      grnItem: this.itemDto,
      documents: this.documents,
      serviceno: this.f.serviceno.value,
      warranty: this.f.warranty.value,
      naration: this.f.naration.value,
      poId: Number(this.activatedRoute.snapshot.params['id']),
    }
  };
  //==============================Delate Product Item========================//
  deleteEnquiryItem(enq) {
    if (enq.id === null || enq.id === "") {
      var index = this.itemDto.indexOf(enq);
      this.total -= enq.amount;
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
            this.lpoService.deletePurchaseInvoiceItemById(enq.id).subscribe(result => {
              this.alerts.setMessage(result.message, 'success');
              var index = this.itemDto.indexOf(enq);
              this.total -= enq.amount;
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
  get f() { return this.poForm.controls; }
  get c() { return this.productForm.controls; }



  public getLPOById(id) {
    this.lpoService.getLPOById(id).subscribe(res => {
      if (res.code === 200) {
        this.lpoInfo = res.data;
        // this.f.id.setValue(this.lpoInfo.id);
        this.total = this.lpoInfo.grossAmt;
        // if (this.lpoInfo.podate) {
        //   this.f.grndate.setValue(this.constants.convert(this.lpoInfo.podate));
        // } else {
        //   this.f.grndate.setValue(null);
        // }
        this.documents = this.lpoInfo.documents;
        this.f.refno.setValue(this.lpoInfo.refno);
        this.f.paymentTerms.setValue(this.lpoInfo.paymentTerms);
        this.f.vatApplicable.setValue(this.lpoInfo.vatApplicable);
        this.f.grossAmt.setValue(this.lpoInfo.grossAmt);
        this.f.discount.setValue(this.lpoInfo.discount);
        this.f.vatperc.setValue(this.lpoInfo.vatperc);
        this.f.vat.setValue(this.lpoInfo.vat);
        this.f.netAmt.setValue(this.lpoInfo.netAmt);
        this.f.paidAmt.setValue(this.lpoInfo.paidAmt);
        this.f.remainingAmt.setValue(this.lpoInfo.remainingAmt);
        this.f.notes.setValue(this.lpoInfo.notes);
        this.f.tnc.setValue(this.lpoInfo.tnc);
        this.f.status.setValue('');
        this.f.contactId.setValue(this.lpoInfo.contacts.id);
        this.f.contactName.setValue(this.lpoInfo.contacts.displayName);
        this.f.userId.setValue(this.lpoInfo.user.id);
        this.f.userName.setValue(this.lpoInfo.user.name);
        this.f.warranty.setValue(this.lpoInfo.warranty);
        this.f.naration.setValue(this.lpoInfo.naration);
        this.f.serviceno.setValue(this.lpoInfo.serviceno);
        for (let p of this.lpoInfo.poItem) {
          this.item = {
            reference: p.reference,
            id: null,
            applyDiscount: p.applyDiscount,
            qty: p.qty,
            unitPrice: p.unitPrice,
            amount: p.amount,
            discountPerc: p.discountPerc,
            discount: p.discount,
            total: p.total,
            productname:this.c.productName.value,
            item: p.item
          }
          this.itemDto.push(this.item);
        };
        
        this.totalAfterDis = this.lpoInfo.grossAmt - this.lpoInfo.discount;
        this.grandTotal = this.lpoInfo.netAmt;

      }
    });
  }
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

  //-==================================================================================================////#endregion
  reset() {
    this.resetProduct();
    this.f.grndate.reset();
    this.f.refno.reset();
    this.f.paymentTerms.reset();
    this.f.notes.reset();
    this.f.tnc.reset();
    this.f.status.reset();
    this.f.contactName.reset();
    this.f.contactId.reset();
    this.f.userName.reset();
    this.f.userId.reset();
    this.f.grnItem.reset();
    this.f.documents.reset();
    this.f.serviceno.reset();
    this.f.warranty.reset();
    this.f.naration.reset();
    this.f.poId.reset();
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
