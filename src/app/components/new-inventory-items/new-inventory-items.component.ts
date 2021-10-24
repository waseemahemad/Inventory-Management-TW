import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { ItemDto } from '../../model/itemDto';
import { ResponseDto } from '../../model/ResponseDto';
import { Router } from '@angular/router';
import { ListofValDto } from '../../model/listofValDto';
import { Constants } from '../../commons/constant';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-new-inventory-items',
  templateUrl: './new-inventory-items.component.html',
  styleUrls: ['./new-inventory-items.component.css']
})
export class NewInventoryItemsComponent implements OnInit {

  productForm : FormGroup;
  submitted : boolean = false;
  listofValDto :ListofValDto;

  constructor(
    private fb : FormBuilder,
    private inventoryService : InventoryService,
    private router : Router,
    private constant : Constants,
    private alerts : AlertsService
    ) { }

  ngOnInit() {
    this.initForm();
    this.getUOMList();
  }

  initForm(){
    this.productForm = this.fb.group({
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
  public getUOMList(){
      this.inventoryService.getUOMList(this.constant.UOM).subscribe(result => {
        this.listofValDto = result.data;
      })
    
  }
  get fc(){
    return this.productForm.controls;
  }

  submit(){
    this.submitted = true;
    if ( this.productForm.valid ) {
      let itemDto : ItemDto = this.productForm.value;
      this.inventoryService.addNewItem(itemDto).subscribe((response : ResponseDto) => {
        
        this.submitted = false;
        if(response.code === 201){
          this.alerts.setMessage('Item added to list','success');
          this.router.navigate(['/inventory/item']);
        }
      },
    e=>{
      
      this.alerts.setMessage(e.error.message,'error');
      
    });
    }
    
  }

}
