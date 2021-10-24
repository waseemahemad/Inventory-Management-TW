import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseDto } from '../../model/ResponseDto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemDto } from '../../model/itemDto';
import { ListofValDto } from '../../model/listofValDto';
import { Constants } from '../../commons/constant';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-edit-inventory-items',
  templateUrl: './edit-inventory-items.component.html',
  styleUrls: ['./edit-inventory-items.component.css']
})
export class EditInventoryItemsComponent implements OnInit {

  constructor(
    private inventoryService : InventoryService,
    private activatedroute : ActivatedRoute,
    private fb : FormBuilder,
    private router : Router,
    private constant : Constants,
    private alerts : AlertsService
    ) { }

  productForm : FormGroup;
  submitted : boolean = false;
  listofValDto :ListofValDto;
  
  ngOnInit() {
    this.initForm();
    this.getEditData();
    this.getUOMList();
  }
  public getUOMList(){
    this.inventoryService.getUOMList(this.constant.UOM).subscribe(result => {
      this.listofValDto = result.data;
    })
  
}

  initForm(){
    this.productForm = this.fb.group({
      id : [null, []],
      name : ['', [Validators.required]],
      unit : [null, []],
      sku : ['', [Validators.required]],
      saleRate : [null, []],
      saleDiscription : ['', []],
      purchaseRate : [null, []],
      purchaseDiscription : ['', []],
      openingStock : [null, []],
      stockRateperunit : [null, []],
      inventoryAccount : ['', []],
      uom :['',[Validators.required]]
    });
  }

  get fc(){
    return this.productForm.controls;
  }

  getEditData(){
    const id : string = this.activatedroute.snapshot.params['id'];
    
    this.inventoryService.getItemById(id).subscribe((response : ResponseDto) => {
      
      let itemDto : ItemDto = response.data;
      this.productForm.controls['id'].setValue(itemDto.id);
      this.productForm.controls['name'].setValue(itemDto.name);
      this.productForm.controls['unit'].setValue(itemDto.unit);
      this.productForm.controls['sku'].setValue(itemDto.sku);
      this.productForm.controls['saleRate'].setValue(itemDto.saleRate);
      this.productForm.controls['saleDiscription'].setValue(itemDto.saleDiscription);
      this.productForm.controls['purchaseRate'].setValue(itemDto.purchaseRate);
      this.productForm.controls['purchaseDiscription'].setValue(itemDto.purchaseDiscription);
      this.productForm.controls['openingStock'].setValue(itemDto.openingStock);
      this.productForm.controls['stockRateperunit'].setValue(itemDto.stockRateperunit);
      this.productForm.controls['inventoryAccount'].setValue(itemDto.inventoryAccount);
      this.productForm.controls['uom'].setValue(itemDto.uom);
    });
  }

  submit(){
    this.submitted = true;
    if ( this.productForm.valid ) {
      let itemDto : ItemDto = this.productForm.value;
      this.inventoryService.addNewItem(itemDto).subscribe((response : ResponseDto) => {
        this.submitted = false;
        if(response.code===201){
          this.alerts.setMessage('Item updated successfully','success');
        this.router.navigate(['/inventory/item']);
        }
        
      });
    }
    
  }
}
