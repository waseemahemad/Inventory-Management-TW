import { ItemDto } from "./itemDto";

export interface stockDto{
     id:number;
	 type:String;
	 grnqty:number;
	 saleqty:number;
	 stockqty:number;
	 debitqty:number;
	 creditqty:number;
	 adjustqty:number;
	 openingqty:number;
	 stockin:number;
	 stockout:number;
	 salesvalue:number;
	 purchasevalue:number;
	 sqty:number;
	 item:ItemDto;

}