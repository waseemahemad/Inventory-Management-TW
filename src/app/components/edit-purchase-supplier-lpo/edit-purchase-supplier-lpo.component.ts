import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ContactSpecDto } from '../../model/contactSpecDto';
import { Constants } from '../../commons/constant';
import * as _ from 'underscore';
import { SalesService } from '../../services/sales.service';
import { ResponseDto } from '../../model/ResponseDto';
import { LpoItemDto } from '../../model/lpoItemDto';
import { LpoDto } from '../../model/lpoDto';
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { ItemDto } from '../../model/itemDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from '../add-customer-modal/add-customer-modal.component';
import { DocumentDto } from '../../model/documentDto';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DocumentService } from '../../services/document.service';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { UserAccessService } from 'src/app/user-access.service';


@Component({
  selector: 'app-edit-purchase-supplier-lpo',
  templateUrl: './edit-purchase-supplier-lpo.component.html',
  styleUrls: ['./edit-purchase-supplier-lpo.component.css']
})
export class EditPurchaseSupplierLpoComponent implements OnInit {
  public config: DropzoneConfigInterface = {

  };
  totalAfterDis: number = null;
  amt: number = 0;
  total: number;
  grandTotal: number;
  item: LpoItemDto;
  item1: any = {};
  poForm: FormGroup;
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
  itemDto: Array<LpoItemDto> = [];
  lpoDto: LpoDto;
  i: ItemDto;
  documents: Array<DocumentDto> = [];
  docs: Array<DocumentDto> = [];
  documentsZone: Array<DocumentDto> = [];
  document: DocumentDto;
  submitted: boolean = false;
  psubmitted: boolean = false;
  productAdded: boolean = false;
  status = this.constants.SAVED;
  deletedProIds: Array<any> = [];
  temp: Array<any> = [];
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

  constructor(private documentService: DocumentService,private uaServ : UserAccessService, private lpoService: PurchaseService, private fb: FormBuilder, private router: Router, private salesService: SalesService, private constants: Constants, private alerts: AlertsService, private confirmationAlert: ConfirmationDialogService, private modalService: NgbModal, private loginService: LoginService) { }

  ngOnInit() {
    this.initForm();
    let lpoId = localStorage.getItem('lpoID');
    this.getLPOById(lpoId);
    this.initProductForm();
    // this.getEnqNo();
    this.typeAhedProduct();
    this.typeAhedCustomer();
    this.typeAhedSales();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('purchase-lpo-date');
  }

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
      uom: [null, []],
      applyDiscount: [null, []],
      qty: [null, [Validators.required]],
      unitPrice: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      discountPerc: [null, []],
      discount: [null, []],
      total: [null, []],
      itemId: [null, []],
      poId: [null, []],
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
      pono: ['', [Validators.required]],
      podate: [new Date, [Validators.required]],
      refno: ['', []],
      paymentTerms: ['', [Validators.required]],
      warranty: ['', []],
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
      contactName: ['', [Validators.required]],
      contactId: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      userName: ['', [Validators.required]],
      naration: ['', []],
      serviceno: ['', []],
      // area : ['',[Validators.required]]
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
    })
  };
  // public getEnqNo() {
  //   this.salesService.getEntityId(this.constants.PURCHASE_ORDER).subscribe(result => {
  //     if (result.code === 200) {
  //       this.f.pono.setValue(result.message);
  //     }
  //   })
  // }
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
        name: this.c.productName.value,
        id: this.c.id.value,
        applyDiscount: this.c.applyDiscount.value,
        qty: this.c.qty.value,
        unitPrice: this.c.unitPrice.value,
        amount: this.c.amount.value,
        discountPerc: this.c.discountPerc.value,
        discount: this.c.discount.value,
        total: this.c.total.value,
        itemId: this.c.itemId.value,
        poId: this.c.poId.value,
        sku: this.c.sku.value,
        uom: this.c.uom.value
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
    this.c.itemId.setValue(item.itemId);
    this.c.qty.setValue(item.qty);
    this.c.unitPrice.setValue(item.unitPrice);
    this.c.amount.setValue(item.amount);
    this.c.reference.setValue(item.reference);
    this.c.productName.setValue(item.name);
    this.c.sku.setValue(item.sku);
    this.c.uom.setValue(item.uom);
    this.total -= item.amount;
    this.calculate();
    var index = this.itemDto.indexOf(item);
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
    this.createLPO();
  }

  public unauthorize() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
      this.status = this.constants.UNAUTHORIZED_BY_MANAGER;
    } else if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      this.status = this.constants.UNAUTHORIZED_BY_DIRECTOR;
    }
    this.createLPO();
  }

  public showHide() {
    if (this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER || this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
      return true
    } else {
      return false;
    }
  }

  //=======================================Create Enquiry==========================//
  public createLPO() {
    if (this.itemDto.length > 0) {
      this.delete();
    } else {
      this.alerts.setMessage("You Need To Add Atleast One Product!!", 'warn');
    }
  };

  public submitForm() {
    this.submitted = true;
    this.assembleData();
    if (this.submitted && this.poForm.valid && this.productAdded) {
      this.lpoService.createLPO(this.lpoDto).subscribe(response => {
        this.submitted = false;
        if (response.code === 200) {
          this.alerts.setMessage(response.message, 'success');
          this.router.navigate(['/purchase/supplierLPO']);
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
    this.lpoDto = {
      id: this.f.id.value,
      pono: this.f.pono.value,
      podate: this.f.podate.value,
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
      contactId: this.f.contactId.value,
      userId: this.f.userId.value,
      poItem: this.itemDto,
      warranty: this.f.warranty.value,
      naration: this.f.naration.value,
      serviceno: this.f.serviceno.value,
      documents: this.documents
    }
  };

  //==============================Delate Product Item========================//
  delete() {
    if (this.deletedProIds.length > 0) {
      this.deletedProIds.forEach(id => {
        this.lpoService.deleteLPOItemById(id).subscribe(res => {
          if (res.code === 200) {
            console.log("deleted item:: ");
          }
        });
        this.temp.push(id);
        if (this.deletedProIds.length === this.temp.length) {
          this.checkProduct();
          this.uploadDocument();
        }
      });
    } else {
      this.checkProduct();
      this.uploadDocument();
    }
  };

  deleteEnquiryItem(enq) {
    if (enq.id === null || enq.id === "") {
      this.total -= enq.amount;
      if (this.total <= this.f.discount.value) {
        this.f.discount.setValue(0);
      }
      var index = this.itemDto.indexOf(enq);
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
            this.total -= enq.amount;
            var index = this.itemDto.indexOf(enq);
            this.itemDto.splice(index, 1);
            if (this.itemDto.length === 0) {
              this.f.vat.setValue(0);
              this.f.discount.setValue(0);
            }
            this.calculate();
            this.deletedProIds.push(enq.id);
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
        this.itemDto = [];
        this.lpoInfo = res.data;
        this.documents = this.lpoInfo.documents;
        this.f.id.setValue(this.lpoInfo.id);
        this.f.pono.setValue(this.lpoInfo.pono);
        if (this.lpoInfo.podate) {
          this.f.podate.setValue(this.constants.convert(this.lpoInfo.podate));
        } else {
          this.f.podate.setValue((null));
        }
        this.total = this.lpoInfo.grossAmt;
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
        this.status = (this.lpoInfo.status);
        this.f.contactId.setValue(this.lpoInfo.contacts.id);
        this.f.contactName.setValue(this.lpoInfo.contacts.displayName);
        this.f.userId.setValue(this.lpoInfo.user.id);
        this.f.userName.setValue(this.lpoInfo.user.name);
        this.f.warranty.setValue(this.lpoInfo.warranty);
        this.f.naration.setValue(this.lpoInfo.naration);
        this.f.serviceno.setValue(this.lpoInfo.serviceno);

        for (let p of this.lpoInfo.poItem) {
          this.item = {
            sku: p.item.sku,
            reference: p.reference,
            id: p.id,
            applyDiscount: p.applyDiscount,
            qty: p.qty,
            unitPrice: p.unitPrice,
            amount: p.amount,
            discountPerc: p.discountPerc,
            name: p.productname,
            discount: p.discount,
            total: p.total,
            itemId: p.item.id,
            poId: p.poId,
            uom: p.item.uom
          }
          this.itemDto.push(this.item);
        };
        this.totalAfterDis = this.lpoInfo.grossAmt - this.lpoInfo.discount;
        this.grandTotal = this.lpoInfo.netAmt;

      }
    });
  }
  lpoInfo: any;

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

  //===============================================================================================//

  reset() {
    this.resetProduct();
    this.f.podate.reset();
    this.f.refno.reset();
    this.f.paymentTerms.reset();
    this.f.warranty.reset();
    this.f.notes.reset();
    this.f.tnc.reset();
    this.f.status.reset();
    this.f.contactName.reset();
    this.f.contactId.reset();
    this.f.userId.reset();
    this.f.userName.reset();
    this.f.naration.reset();
    this.f.serviceno.reset();
  }

}
