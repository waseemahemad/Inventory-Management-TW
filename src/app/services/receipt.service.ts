import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Config } from "../commons/config";
import { PaymentDto } from "../model/paymentDto";
import { Observable } from "rxjs";
import { ResponseDto } from "../model/ResponseDto";
import { PaymentSpecDto } from "../model/paymentSpecDto";
import { ReceiptDto } from "../model/receiptDto";
import { ReceiptSpecDto } from "../model/receiptSpecDto";

@Injectable({
    providedIn: 'root'
})
export class ReceiptService{
    constructor(
        private http:HttpClient,
        private config : Config){}
    
    public createReceipt(receiptDto : ReceiptDto) : Observable<ResponseDto>{
        return this.http.post <ResponseDto>(this.config._urlCreateReceipt,receiptDto);
    }
    public getPendingInvoice(id : any):Observable<ResponseDto>{
        return this.http.get <ResponseDto>(this.config._urlgetpendingsalei+id);
    }

    public getBankList():Observable<ResponseDto>{
        return this.http.get <ResponseDto>(this.config._urlgetbankList);
    }

    public getReceiptList(dto : ReceiptSpecDto):Observable<ResponseDto>{
        return this.http.post <ResponseDto>(this.config._urlgetReceiptList,dto);
    }

    public getRecById(id : any) : Observable<ResponseDto>{
        return this.http.get<ResponseDto>(this.config._urlGetRecById + id);
    }

}