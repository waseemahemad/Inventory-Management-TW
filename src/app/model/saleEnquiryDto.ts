import { SalesEnquiryItemDto } from "./salesEnquiryItemDto";

export interface SaleEnquiryDto{
    id :number;
	enqNo :string;
	enqDate :Date;
	grossAmt : number;
	netAmt : number;
	link :string;
	paymentTerms :string;
	warranty :string;
	narration :string;
	serviceNo :string;
	status :string;
	contactId :number;
	userId :number;
	area : string;
	salesEnquiryItem : Array<SalesEnquiryItemDto>;
}