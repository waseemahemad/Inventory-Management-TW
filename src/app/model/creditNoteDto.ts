import { CreditNoteItemDto } from "./creditNoteItemDto";

export interface CreditNoteDto{
    id : number;
	creditNo : string;
	creditDate : Date;
	link : string;
	paymentTerms : string;
	warranty : string;
	naration : string;
	serviceNo : string;
	vatApplicable : boolean;
	grossAmt : number;
	discount : number;
	vatperc : number;
	vat : number;
	netAmt : number;
	paidAmt : number;
	remainingAmt : number;
	status : string;
	contactId : number;
	userId : number;
	saleId : number;
	creditNoteItem : Array<CreditNoteItemDto>;
}