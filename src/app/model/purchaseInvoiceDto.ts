import { PurchaseInvoiceItemDto } from "./purchaseInvoiceItemDto";
import { DocumentDto } from "./documentDto";

export interface PurchaseInvoiceDto{
   
    
    id : number;
	grnno : string;
	grndate : Date;
	refno : string;
	paymentTerms : string;
	vatApplicable : boolean;
	grossAmt : number;
	discount : number;
	vatperc : number;
	vat : number;
	netAmt : number;
	paidAmt : number;
	remainingAmt : number;
	notes : string;
	tnc : string;
	status : string;
	advanceAmt : number;
	contactId : number;
	userId : number;
	grnItem : Array<PurchaseInvoiceItemDto>;
	documents : Array<DocumentDto>;
	serviceno : string;
	warranty : string;
	naration : string;
    poId : number;
}