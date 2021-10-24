import { ContactDto } from "./contactDto";
import { UserDto } from "./userDto";
import { SalesQuotationItemDto } from "./salesQuotationItemDto";

export interface SaleQuotationDto {
	id: number;
	quoteno: string;
	quoteDate: Date;
	link: string;
	seNo: string;
	paymentTerms: string;
	warranty: string;
	naration: string;
	serviceno: string;
	vatApplicable: boolean;
	grossAmt: number;
	discount: number;
	vatperc: number;
	vat: number;
	netAmt: number;
	paidAmt: number;
	remainingAmt: number;
	status: string;
	contactId: number;
	userId: number;
	sqtItem: Array<SalesQuotationItemDto>;
	enquaryId: number;
	area: string;
}