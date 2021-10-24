import { ItemDto } from "./itemDto";

export interface SalesInvoiceItemDto{
	id : number,
	qty : number,
	unitPrice : number,
	amount : number,
	discountPerc : number,
	discount : number,
	total : number,
	reference : string,
	productname :string,
	item : ItemDto,
}