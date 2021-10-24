import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ItemDto } from '../../model/itemDto';
import * as _ from 'underscore';
import { SalesService } from '../../services/sales.service';
import { Constants } from '../../commons/constant';
import { ResponseDto } from '../../model/ResponseDto';
import { InventoryService } from '../../services/inventory.service';
import { StockInOutDto } from '../../model/StockInOutDto';
import { stockDto } from '../../model/stockDto';
import { Router } from '../../../../node_modules/@angular/router';
import { AlertsService } from 'angular-alert-module';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
import { UserAccessService } from 'src/app/user-access.service';

@Component({
  selector: 'app-new-inventory-items-adjustments',
  templateUrl: './new-inventory-items-adjustments.component.html',
  styleUrls: ['./new-inventory-items-adjustments.component.css']
})
export class NewInventoryItemsAdjustmentsComponent implements OnInit {

  productAdjustForm: FormGroup;
  submitted: boolean = false;
  productList: Array<ItemDto> = [];
  stockDto : Array<stockDto> =[];
  productCode: Array<string> = [];
  itemName: Array<string> = [];
  productDto: any = [];
  responseDto: ResponseDto;
  isReadOnly : boolean = false;

  constructor(private fb: FormBuilder,
    private enquiryService: SalesService,
    private constants: Constants,
    private inventoryService : InventoryService,
    private router :Router,
    private alerts : AlertsService,
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
    this.isReadOnly = !this.uaServ.getMasterModules().includes('inventory-items adjust-date');
  }

  initForm() {
    this.productAdjustForm = this.fb.group({
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
      date: [this.constants.convert(new Date), [Validators.required]],
      reason: ['', []],
      stockInhand: [null, []]
    });
    this.f.qty.valueChanges.subscribe(val=>{
      this.sih();
    });
    this.f.type.valueChanges.subscribe(val=>{
      this.sih();
    });
  }
  get f() {
    return this.productAdjustForm.controls;
  }

  public sih(){
    if(this.f.type.value === "in"){
      this.f.stockInhand.setValue((this.responseDto.data.stockqty !==null && this.responseDto.data.stockqty!=='' && this.responseDto.data.stockqty!== undefined ? this.responseDto.data.stockqty : 0) + this.f.qty.value );
    }else if(this.f.type.value === "out"){
      this.f.stockInhand.setValue((this.responseDto.data.stockqty !==null && this.responseDto.data.stockqty!=='' && this.responseDto.data.stockqty!== undefined ? this.responseDto.data.stockqty : 0) - this.f.qty.value );
    }
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
  public getStockByItem(id){
    this.inventoryService.getStockByItemId(id).subscribe(result =>{
      this.responseDto = result;
      this.stockDto =this.responseDto.data;
      if(this.responseDto.data.stockqty !==null && this.responseDto.data.stockqty!=='' && this.responseDto.data.stockqty!== undefined){
        this.f.stockInhand.setValue(this.responseDto.data.stockqty);
      }else{
        this.f.stockInhand.setValue(0);
      }
      
    },error =>{
      console.log(error);
      if(this.responseDto.data.stockqty !==null && this.responseDto.data.stockqty!=='' && this.responseDto.data.stockqty!== undefined){
        this.f.stockInhand.setValue(this.responseDto.data.stockqty);
      }else{
        this.f.stockInhand.setValue(0);
      }
    });
  }
  submit(){
    this.submitted = true;
    if ( this.productAdjustForm.valid ) {
      let stockInout : StockInOutDto = this.productAdjustForm.value;
      this.inventoryService.updateStock(stockInout).subscribe((response : ResponseDto) => {
        if(response.code===201){
          this.alerts.setMessage('Stock updated Successfully!','success');
          this.router.navigate(['/inventory/item-adjust']);
        }
      });
    }
    
  }

}
