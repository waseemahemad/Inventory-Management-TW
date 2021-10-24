import { SalesInvoiceItemDto } from "./invoiceItemDto";
import { DocumentDto } from "./documentDto";

export interface SalesInvoiceDto{
	id : number,
	saleno : string,
	saledate : Date,
	link : string,
	paymentTerms : string,
	warranty : string,
	naration : string,
	serviceno : string,
	vatApplicable : boolean,
	grossAmt : number,
	discount : number,
	vatperc : number,
	vat : number,
	netAmt : number,
	paidAmt : number,
	remainingAmt : number,
	status : string,
	contactId : number,
	userId : number,
	saleItem : Array<SalesInvoiceItemDto>,
	enquaryId : number,
	quotId : number,
	orderId : number,
	deliveryId : number,
	updatestock : boolean,
	advanceAmt : number,
	documents : Array<DocumentDto>,
	area : string,
	customerpono : string
}