import { DeliveryNoteItemDto } from "./deliveryNoteItemDto";
import { DocumentDto } from "./documentDto";

export interface DeliveryNoteDto {
	id: number;
	deliveryNo: string;
	deliveryDate: Date;
	link: string;
	paymentTerms: string;
	warranty: string;
	narration: string;
	serviceNo: string;
	sqtNo: string;
	soNo: string;
	vatApplicable: boolean;
	grossAmt: number;
	discount: number;
	vatPerc: number;
	vat: number;
	netAmt: number;
	paidAmt: number;
	remainingAmt: number;
	status: string;
	contactId: number;
	userId: number;
	salesEnquiryId: number;
	saleQuotationId: number;
	saleOrderId: number;
	area: string;
	deliveryNoteItems: Array<DeliveryNoteItemDto>;
	documents: Array<DocumentDto>;
	customerpono : string;
}