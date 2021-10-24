import { Injectable } from "../../../node_modules/@angular/core";
import { HttpClient } from '@angular/common/http';
import { Config } from "../commons/config";
import { PaymentDto } from "../model/paymentDto";
import { Observable } from "../../../node_modules/rxjs";
import { ResponseDto } from "../model/ResponseDto";
import { BankSpecDto } from "../model/bankSpecDto";
import { PaymentSpecDto } from "../model/paymentSpecDto";

@Injectable({
    providedIn: 'root'
})
export class PaymentService{
    constructor(
        private http:HttpClient,
        private config : Config){}
    
    public createPayment(paymentDto : PaymentDto) : Observable<ResponseDto>{
        return this.http.post <ResponseDto>(this.config._urlCreatePayment,paymentDto);
    }
    public getPendingInvoice(id : any):Observable<ResponseDto>{
        return this.http.get <ResponseDto>(this.config._urlgetpendinginvoice+id);
    }

    public getBankList():Observable<ResponseDto>{
        return this.http.get <ResponseDto>(this.config._urlgetbankList);
    }

    public getPaymentList(paymentDto : PaymentSpecDto):Observable<ResponseDto>{
        return this.http.post <ResponseDto>(this.config._urlgetPaymentList,paymentDto);
    }

    public getPaymentById(id:any)  : Observable<ResponseDto>{
        return this.http.get<ResponseDto>(this.config._urlGetPaymentById+id);
    }

}