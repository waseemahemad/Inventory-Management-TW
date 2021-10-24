import { ItemDto } from "./itemDto";

export interface DeliveryNoteItemDto{
    id : number;
	qty : number;
	unitPrice : number;
	amount : number;
	reference : string;
	itemId : number;
	name : string;
	sku : string;
	uom : string;
}