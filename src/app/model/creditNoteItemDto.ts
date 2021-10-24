import { ItemDto } from "./itemDto";

export interface CreditNoteItemDto{
    id : number;
	applyDiscount : boolean;
	qty : number;
	returnqty : number;
	unitPrice : number;
	amount : number;
	discountPerc : number;
	discount : number;
	total : number;
	reference : string;
	item : ItemDto;
}