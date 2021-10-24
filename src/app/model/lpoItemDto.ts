import { ItemDto } from "./itemDto";

export interface LpoItemDto {
    // id :  number ;
	// qty :  number ;
	// unitPrice :  number ;
	// amount :  number ;
	// itemId :  number ;
	// reference : string;
	// name : string;
	sku : string;
	reference : string;
	id : number;
	applyDiscount  : boolean;
	qty : number;
	unitPrice : number;
	amount : number;
	discountPerc : number;
	name : string;
	discount : number;
	total : number;
	itemId : number;
	poId : number;
	uom : string;
}