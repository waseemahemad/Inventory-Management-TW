import { LpoItemDto } from "./lpoItemDto";
import { DocumentDto } from "./documentDto";

export interface LpoDto{
     id : number;
	 pono : string;
	 podate : Date;
	 refno : string;
	 paymentTerms : string;
	 vatApplicable  : boolean;
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
	 contactId : number;
	 userId : number;
	 warranty : string;
	 naration : string;
	 serviceno : string;
	poItem : Array<LpoItemDto>;
	documents : Array<DocumentDto>;
}