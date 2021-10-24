import { ItemEditDto } from "./itemEditDto";

export interface PurchaseInvoiceItemDto{
	id : number;
	applyDiscount : boolean;
	qty : number;
	unitPrice : number;
	amount : number;
	discountPerc : number;
	discount : number;
	total : number;
	reference : string;
	item : ItemEditDto;
	productname:string;
}