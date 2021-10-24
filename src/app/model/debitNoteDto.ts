import { ContactDto } from "./contactDto";
import { UserDto } from "./userDto";
import { DebitNoteItemDto } from "./debitNoteItemDto";

export interface DebitNoteDto{
    id : number;
	debitno : string;
	debitdate : Date;
	refno : string;
	paymentTerms : string;
	vatApplicable : Boolean;
	grossAmt : number;
	discount : number;
	vatperc : number;
	vat : number;
	netAmt : number;
	paidAmt : number;
	remainingAmt : number;
	notes : string;
	tnc : string;
	status : string;
	contacts : ContactDto;
	user : UserDto;
	debitNoteItem : Array<DebitNoteItemDto>;
	grnid : number;
}