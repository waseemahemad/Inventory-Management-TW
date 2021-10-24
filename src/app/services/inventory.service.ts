import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../commons/config';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { ItemDto } from '../model/itemDto';
import { ItemSpecDto } from '../model/itemSpecDto';
import { StockInOutDto } from '../model/StockInOutDto';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private http : HttpClient,
    private config : Config
  ) { }
//=========================================================Inventory---Items============================================================//
  public addNewItem(itemDto : ItemDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlAddItem, itemDto);
  }
  public listItems(itemSpecDto : ItemSpecDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlListItems,itemSpecDto);
  }
  public getItemById(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlGetItemById + id);
  }
  public getStockByItemId(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlStockById + id);
  }
  public updateStock(stockInOutDto : StockInOutDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urladjust, stockInOutDto);
  }

  public getListStock(itemSpecDto : ItemSpecDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlgetStockList, itemSpecDto);
  }
  public getStockInOutId(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlbyStockInOutId + id);
  }

  public getUOMList(type : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urllistofval + type);
  }
  
}
