export interface ItemDto {
    id : number;
	type : string;
	name : string;
	unit : number;
	sku : string;
	saleRate : number;
	saleAccount : string;
	saleDiscription : string;
	purchaseRate : number;
	purchaseAccount : string;
	purchaseDiscription : string;
	inventoryAccount : string;
	openingStock : number;
	stockRateperunit : number;
	uom : string;
}