import { ItemDto } from "./itemDto";

export interface DebitNoteItemDto{
    id : number;
	applyDiscount : boolean;
	qty : number;
	returnqty : number;
	unitPrice : number;
	amount : number;
	discountPerc : number;
	discount : number;
	total : number;
	item : ItemDto;

}