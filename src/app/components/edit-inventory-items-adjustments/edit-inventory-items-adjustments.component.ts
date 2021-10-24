import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ItemDto } from '../../model/itemDto';
import { stockDto } from '../../model/stockDto';
import { ResponseDto } from '../../model/ResponseDto';
import { Observable } from '../../../../node_modules/rxjs';
import { debounceTime, distinctUntilChanged, map } from '../../../../node_modules/rxjs/operators';
import { StockInOutDto } from '../../model/StockInOutDto';
import { SalesService } from '../../services/sales.service';
import * as _ from 'underscore';
import { AlertsService } from 'angular-alert-module';
import { Constants } from 'src/app/commons/constant';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-edit-inventory-items-adjustments',
  templateUrl: './edit-inventory-items-adjustments.component.html',
  styleUrls: ['./edit-inventory-items-adjustments.component.css']
})
export class EditInventoryItemsAdjustmentsComponent implements OnInit {

  productAdjustForm: FormGroup;
  submitted: boolean = false;
  productList: Array<ItemDto> = [];
  stockDto: Array<stockDto> = [];
  productCode: Array<string> = [];
  itemName: Array<string> = [];
  productDto: any = [];
  responseDto: ResponseDto;
  stockInout: StockInOutDto ;
  isReadOnly : boolean = false;

  constructor(private inventoryService: InventoryService,
    private activatedroute: ActivatedRoute,
    private enquiryService: SalesService,
    private fb: FormBuilder,
    private router: Router,
    private alerts : AlertsService,
    private constants : Constants,
    private uaServ : UserAccessService
    ) { }

  searchCode = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.productCode.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchName = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.itemName.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );


  ngOnInit() {
    this.initForm();
    this.typeAhedProduct();
    this.getEditData();
    this.isReadOnly = !this.uaServ.getMasterModules().includes('inventory-items adjust-date');
  }

  initForm() {
    this.productAdjustForm = this.fb.group({
      id: [null, []],
      type: ['', [Validators.required]],
      qty: [null, [Validators.required]],
      stockin: [null, []],
      stockout: [null, []],
      salesvalue: [null, []],
      purchasevalue: [null, []],
      itemId: [null, []],
      productName: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      refno: ['', []],
      date: [this.constants.convert(new Date) , [Validators.required]],
      reason: ['', []],
      stockInhand: [null, []]
    });
  }

  get f() {
    return this.productAdjustForm.controls;
  }

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
        this.f.itemId.setValue(p.id);
        this.getStockByItem(p.id);
      } else if (p.name === item.item) {
        this.f.sku.setValue(p.sku);
        this.f.productName.setValue(p.name);
        this.f.itemId.setValue(p.id);
        this.getStockByItem(p.id);
      }
    }
  };
  public getStockByItem(id) {
    this.inventoryService.getStockByItemId(id).subscribe(result => {
      if(result.data!== null){
        this.responseDto = result;
        this.stockDto = this.responseDto.data;
        this.f.stockInhand.setValue(this.responseDto.data.stockqty-this.stockInout.qty);
      }else{
        this.f.stockInhand.setValue(0);
      }
      
    }, error => {
      console.log(error);
    });
  }
  getEditData() {
    const id: string = this.activatedroute.snapshot.params['id'];
    console.log(id);
    this.inventoryService.getStockInOutId(id).subscribe((response: ResponseDto) => {
      console.log(response.data);
      this.stockInout = response.data;
      this.productAdjustForm.controls['id'].setValue(this.stockInout.id);
      this.productAdjustForm.controls['type'].setValue(this.stockInout.type);
      this.productAdjustForm.controls['itemId'].setValue(this.stockInout.item.id);
      this.productAdjustForm.controls['qty'].setValue(this.stockInout.qty);

      this.productAdjustForm.controls['reason'].setValue(this.stockInout.reason);
      this.productAdjustForm.controls['refno'].setValue(this.stockInout.refno);
      if(this.stockInout.date){
        this.productAdjustForm.controls.date.setValue(this.constants.convert(this.stockInout.date));
      }else{
        this.productAdjustForm.controls.date.setValue(0);
      }
      this.productAdjustForm.controls['productName'].setValue(this.stockInout.item.name);
      this.productAdjustForm.controls['sku'].setValue(this.stockInout.item.sku);
      this.getStockByItem(this.stockInout.item.id);
    });
  }
  submit() {
    this.submitted = true;
    if (this.productAdjustForm.valid) {
      let stockInout: StockInOutDto = this.productAdjustForm.value;
      this.inventoryService.updateStock(stockInout).subscribe((response: ResponseDto) => {
        this.submitted = false;
        if(response.code===201){
          this.alerts.setMessage('Stock updated Successfully!','success');
          this.router.navigate(['/inventory/item-adjust']);
        }
      });
    }

  }

}
