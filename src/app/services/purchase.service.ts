import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LpoDto } from '../model/lpoDto';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { Config } from '../commons/config';
import { LPOSpecDto } from '../model/LPOSpecDto';
import { PurchaseInvoiceDto } from '../model/purchaseInvoiceDto';
import { PurchaseInvoiceSpecDto } from '../model/purchaseInvoiceSpecDto';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private http : HttpClient,
    private config : Config


  ) { }

  //===========================purchase--LPO=======================================================================================
  public createLPO(lpoDto : LpoDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlCreateLPO,lpoDto);
  }
  public getLPOById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlGetLPOById+id);
  }
  public deleteLPOById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlDeleteLPOById+id);
  }
  public deleteLPOItemById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlDeleteLPOItem+id);
  }
  public listLPO(lpoSpecDto : LPOSpecDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlListLPO,lpoSpecDto);
  }
  //===========================purchase--INVOICE====================================================================================
  public createPurchaseInvoice(purchaseInvoiceDto : PurchaseInvoiceDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlCreatePurchaseInvoice,purchaseInvoiceDto);
  }
  public getPurchaseInvoiceById(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlGetPurchaseInvoiceById+id);
  }
  public deletePurchaseInvoiceById(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlDeletePurchaseInvoiceById+id);
  }
  public deletePurchaseInvoiceItemById(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlDeletePurchaseInvoiceItemById+id);
  }
  public listPurchaseInvoices(purchaseInvoiceSpecDto : PurchaseInvoiceSpecDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlListPurchaseInvoices,purchaseInvoiceSpecDto);
  }
}
