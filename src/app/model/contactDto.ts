import { AddressDto } from "./addressDto";
import { ContactPersonDto } from "./contactPersonDto";

export interface ContactDto {
    id : number;
    type : string;
    salutation : string;
    firstName : string;
    lastName : string;
    companyName : string;
    displayName : string;
    email : string;
    phoneNo : string;
    website : string;
    remark : string;
    currency : string;
    trnno : string;
    paymentTerms : string;
	address : Array<AddressDto>;
	contactPerson : Array<ContactPersonDto>;
}