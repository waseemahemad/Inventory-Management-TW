import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { ItemSpecDto } from '../../model/itemSpecDto';
import { PageDto } from '../../model/page-dto';
import { ResponseDto } from '../../model/ResponseDto';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-inventory-items',
  templateUrl: './inventory-items.component.html',
  styleUrls: ['./inventory-items.component.css']
})
export class InventoryItemsComponent implements OnInit {

  constructor(
    private inventoryService : InventoryService,
    private router : Router,
    private fb : FormBuilder,
    private alerts : AlertsService
    ) { }

  pageDto : any={} ;
  itemDtoList : Array<any> = [];
  itemSpecDto : ItemSpecDto = {
    page :1 ,
    size :10 ,
    name :'' ,
    sku :'' ,
    type :'' ,
  };
  searchForm : FormGroup;

  ngOnInit() {
    this.initForm();
    this.getList();
  }

  public initForm(){
    this.searchForm = this.fb.group({
      name : ['',[]],
      sku : ['',[]],
    });
  }
  getList(){
      this.inventoryService.listItems(this.itemSpecDto).subscribe( ( response : ResponseDto) => {
      this.pageDto.data = response.data.data;
      this.pageDto.totalCount = response.data.totalCount;
    });
  };

  public clearSearch(){
    this.searchForm.reset();
    this.itemSpecDto.page =1 ;
    this.itemSpecDto.size =10 ;
    this.itemSpecDto.name ='' ;
    this.itemSpecDto.sku ='' ;
    this.itemSpecDto.type ='' ;
    this.getList();
  }

  search(){
    this.itemSpecDto.name =this.searchForm.controls.name.value ;
    this.itemSpecDto.sku =this.searchForm.controls.sku.value ;
    this.getList();
  }

  pageChange(x){
    this.itemSpecDto.page = x;
    this.search();
  }

  stateChanged(evnt,item){
    if(evnt.currentTarget.checked){
      this.itemDtoList.forEach(i=>{
        i.checked = false;
      });
      this.itemDtoList = [];
      item.checked = true;
      evnt.currentTarget.checked = true;
      this.itemDtoList.push(item);
    }else{
      var index = this.itemDtoList.indexOf(item);
      this.itemDtoList.splice(index, 1);
    }
  
  }

  editItem(){
    if(this.itemDtoList.length === 1){
      this.router.navigate(['inventory/item/' + _.pluck(this.itemDtoList,'id') + '/edit']);
    }else{
      this.alerts.setMessage('Please select one item','warn');
    }
  }
  
}
