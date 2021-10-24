export interface SaleInvoicePrintDto {
    id : number,
	qty : number,
	unitPrice : number,
	amount : number,
	discountPerc : number,
	discount : number,
	total : number,
    reference : string,
    itemId : number;
	name : string;
	unit : number;
    sku : string;
    uom : string;
}