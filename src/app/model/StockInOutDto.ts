import { ItemDto } from "./itemDto";

export interface StockInOutDto{
    id:number;
	type:String;
	qty:number;
	stockin:number;
	stockout:number;
	salesvalue:number;
	purchasevalue:number;
	itemId:number;
	reason:String;
	refno:String;
	date : Date;
	item :ItemDto;
}