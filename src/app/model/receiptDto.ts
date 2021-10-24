
import { ReceiptSlaveDto } from "./receiptSlaveDto";


export interface ReceiptDto {
    id: number;
    receiptNo: String;
    receiptDate: Date;
    type: String;
    chequeNo: String;
    paymentMode: String;
    amount: number;
    discount: number;
    paidAmt: number;
    remainingAmt: number;
    status: String;
    contactId: number;
    bankId: number;
    receiptSlaves:Array<ReceiptSlaveDto>;
    
}