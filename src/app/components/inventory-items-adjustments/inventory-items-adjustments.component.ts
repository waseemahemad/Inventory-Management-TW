import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '../../../../node_modules/@angular/router';
import { PageDto } from '../../model/page-dto';
import { ItemSpecDto } from '../../model/itemSpecDto';
import { ResponseDto } from '../../model/ResponseDto';
import * as _ from 'underscore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-inventory-items-adjustments',
  templateUrl: './inventory-items-adjustments.component.html',
  styleUrls: ['./inventory-items-adjustments.component.css']
})
export class InventoryItemsAdjustmentsComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private fb : FormBuilder,
    private alerts : AlertsService
    ) { }

  pageDto: any = {};
  stockInOutList: Array<any> = [];
  itemSpecDto: ItemSpecDto = {
    page:1 , 
    size:10 , 
    name:'' , 
    sku:'' , 
    type:'' , 
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
  };

  getList() {
    
    this.inventoryService.getListStock(this.itemSpecDto).subscribe((response: ResponseDto) => {
      this.pageDto.data = response.data.data;
      this.pageDto.totalCount = response.data.totalCount;
    });
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

  public clearSearch(){
    this.searchForm.reset();
    this.itemSpecDto.page =1 ;
    this.itemSpecDto.size =10 ;
    this.itemSpecDto.name ='' ;
    this.itemSpecDto.sku ='' ;
    this.itemSpecDto.type ='' ;
    this.getList();
  }

  stateChanged(evnt,item){
    if(evnt.currentTarget.checked){
      this.stockInOutList.forEach(i=>{
        i.checked = false;
      });
      this.stockInOutList = [];
      item.checked = true;
      evnt.currentTarget.checked = true;
      this.stockInOutList.push(item);
    }else{
      var index = this.stockInOutList.indexOf(item);
      this.stockInOutList.splice(index, 1);
    }
  
  }

  editstock(){
    if(this.stockInOutList.length === 1){
      let id=  _.pluck(this.stockInOutList,'id')
      this.router.navigate(['/inventory/edit/'+id+'/item-adjust']);
    }else{
      this.alerts.setMessage('Please select one Stock List','success');
    }
  }
  
}
