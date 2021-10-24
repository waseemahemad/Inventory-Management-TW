import { JournalVoucherSlave } from "./JournalVoucherSlaveDto";

export interface JournalVoucherDto{
    id:number;
	 jvno:string;
	 jvdate:Date;
	 faccounttype:string;
	 ftype:string;
	 fnarration:string ;
	 famount:number;
	 saccounttype:string;
	 stype:string;
	 snarration :number;
	 samount:number;
	 discount:number;
	 paidAmt:number;
	 remainingAmt:number;
	 status:string;
	fcontactId:number;
	fbankId:number;
	scontactId:number;
	sbankId:number;
	journalslave :Array<JournalVoucherSlave>;
}