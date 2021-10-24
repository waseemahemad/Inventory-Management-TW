import { Injectable } from '@angular/core';
import { SaleEnquiryDto } from '../model/saleEnquiryDto';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { Config } from '../commons/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SaleQuotationDto } from '../model/salesQuotationDto';
import { SalesQuotationSpecDto } from '../model/salesQuotationSpecDto';
import { SalesEnquirySpecDto } from '../model/saleEnquirySpecDto';
import { SalesOrderDto } from '../model/salesOrderDto';
import { SalesOrderSpecDto } from '../model/salesOrderSpecDto';
import { DeliveryNoteDto } from '../model/deliveryNoteDto';
import { DeliveryNoteSpecDto } from '../model/deliveryNoteSpecDto';
import { SalesInvoiceDto } from '../model/invoiceDto';
import { SalesInvoiceSpecDto } from '../model/salesInvoiceSpecDto';
import { ContactSpecDto } from '../model/contactSpecDto';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(
    private http: HttpClient,
    private config: Config
  ) { }
  //=========================================================sales--Enquiry===============================================================
  public getProducts(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlListProducts);
  }
  public getCustomerList(contactSpecautoDto: ContactSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlGetCustomerList, contactSpecautoDto);
  }
  public getSalesManList(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetSaleList);
  }
  public getEntityId(type: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetEntiryId + type);
  }
  public createEnquiry(saleEnquiryDto: SaleEnquiryDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateSalesEnquiry, saleEnquiryDto);
  }
  public getEnquiryById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetSalesEnquiryById + id);
  }
  public deleteSalesEnquiryById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesEnquiryById + id);
  }
  public listSalesEnquiry(SaleEnqSpecDto: SalesEnquirySpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlListSalesEnquiry, SaleEnqSpecDto);
  }
  public deleteSalesEnquiryItemById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteEnqItem + id);
  }

  //=========================================================sales--Quotation=============================================================
  public createSalesQuotation(salesQuoteDto: SaleQuotationDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateSalesQuotation, salesQuoteDto);
  }

  public getSalesQuotationById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetSalesQuotationById + id);
  }

  public deleteSalesQuotationById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesQuotationById + id);
  }

  public deleteSalesQuotationItemById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesQuotationItemById + id);
  }

  public listSalesQuotationList(saleQuotSpecDto: SalesQuotationSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlListSalesQuotations, saleQuotSpecDto);
  }

  public printSalesQuotationById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlPrintSalesQuotationById + id);
  }
  //=========================================================sales--Order=================================================================
  public createSalesOrder(salesOrderDto: SalesOrderDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateSalesOrder, salesOrderDto);
  }
  public getSalesOrderById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetSalesOrderById + id);
  }
  public deleteSalesOrder(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesOrderById + id);
  }
  public deleteSalesOrderItem(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesOrderItemById + id);
  }
  public listSalesOrders(salesOrderSpecDto: SalesOrderSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlListSalesOrders, salesOrderSpecDto);
  }
  public printSalesOrderById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlPrintSalesOrders + id);
  }
  //=========================================================sales--deliveryNote==========================================================
  public createDeliveryNote(deliveryNoteDto: DeliveryNoteDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateDeliveryNote, deliveryNoteDto);
  }
  public getDeliveryNoteById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetDeliveryNoteById + id);
  }
  public deleteDeliveryNoteById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteDeliveryNoteById + id);
  }
  public deleteDeliveryNoteItemById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteDeliveryNoteItemById + id);
  }
  public listDeliveryNotes(deliveryNoteSpecDto: DeliveryNoteSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlListDeliveryNotes, deliveryNoteSpecDto);
  }
  public printDeliveryNoteById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlPrintDeliveryNoteById + id);
  }
  //=========================================================sales--INVOICE===============================================================
  public createSalesInvoice(salesInvoiceDto: SalesInvoiceDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateSalesInvoice, salesInvoiceDto);
  }
  public getSalesInvoiceById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlGetSalesInvoiceById + id);
  }
  public deleteSalesInvoiceById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesInvoiceById + id);
  }
  public deleteSalesInvoiceItemById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlDeleteSalesInvoiceItemById + id);
  }
  public listSalesInvoice(salesInvoiceSpecDto: SalesInvoiceSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlListSalesInvoices, salesInvoiceSpecDto);
  }

  public getPDF(purl) {
    const url = purl;
    const httpOptions = {
      'responseType': 'arraybuffer' as 'json'
      //'responseType'  : 'blob' as 'json'        
    };
    return this.http.get<any>(url, httpOptions);
  }

}
