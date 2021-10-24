import { PaymentSlaveDto } from "./paymentSlaveDto";


export interface PaymentDto {
    id: number;
    paymentno: String;
    paymentdate: Date;
    type_: String;
    chequeno: String;
    paymentmode: String;
    amount: number;
    discount: number;
    paidAmt: number;
    remainingAmt: number;
    status: String;
    contactId: number;
    bankId: number;
    paymentSlave:Array<PaymentSlaveDto>;
    accounttype: string;
	accountId: number;
    
}