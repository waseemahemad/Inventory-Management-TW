import { SalesOrderItemDto } from "./salesOrdeItemDto";
import { ContactDto } from "./contactDto";
import { UserDto } from "./userDto";
import { DocumentDto } from "./documentDto";

export interface SalesOrderDto {
    id : number;
	orderno : string;
	orderdate : Date;
	link : string;
	paymentTerms : string;
	warranty : string;
	naration : string;
	serviceno : string;
	vatApplicable : boolean;
	grossAmt : number;
	discount : number;
	vatperc : number;
	vat : number;
	sqtNo : string
	netAmt : number;
	paidAmt : number;
	remainingAmt : number;
	status : string;
	contactId : number;
	userId : number;
	soItem : Array<SalesOrderItemDto>;
	enquaryId : number;
	quotId : number;
	documents : Array<DocumentDto>;
	area : string;
	customerpono :string;
	
}