import { Injectable } from '@angular/core';
@Injectable()
export class Constants {
	public 	 ACCOUNTS				 	 = "Accounts";
    public   CUSTOMER				 	 = "Customer";
	public   VENDOR				         = "Vendor";
	public   SALES_STATUS				 = "Saved";
    public   SALE_ENQUIRY				 = "SALE ENQUIRY";
	public   SALE_QUOTATION				 = "SALE QUOTATION";
	public   SALE_ORDER				     = "SALE ORDER";
	public   DELIVERY_NOTE				 = "DELIVERY NOTE";
	public   SALE_INVOICE				 = "SALE INVOICE";
	public   PURCHASE_ORDER				 = "PURCHASE ORDER";
	public   PURCHASE_INVOICE		     = "PURCHASE INVOICE";
	public   CREDIT_NOTE				 = "CREDIT NOTE";
	public   DEBIT_NOTE				     = "DEBIT NOTE";
	public   CASH_PAYMENT				 = "CASH PAYMENT";
	public   BANK_PAYMENT				 = "BANK PAYMENT";
	public   CASH_RECEIPT				 = "CASH RECEIPT";
	public   BANK_RECEIPT				 = "BANK RECEIPT";
	public   VAT_PERCENTAGE				 = 0;
	public   BANK_PAYMENT_STATUS	     ="Saved";
	public   CASH_TYPE				     ="Cash";
	public   BANK_TYPE				     ="Bank";
	public   BANK_RECEIPT_STATUS		 ="Saved";
	public   UOM				         ="UOM";

	//======================MODULES NAMES =========================================
	public   SALES  					 ="sales";
	public   PURCHASE				     ="purchase";
	public   INVENTORY					 ="inventory";
	public   PAYMENTS					 ="payments";
	public   RECEIPTS					 ="receipts";
	public   JOURNAL_ENTRIES             ="journal entries";
	public   CONTACTS					 ="contacts";
	public   ACCOUNTS_MODULE			 ="accounts";


	
	//status
	public  SAVED="Saved";
	public  PENDING_APPROVAL_BY_MANAGER="Pending_Approval_by_Manager";
	public  PENDING_APPROVAL_BY_DIRECTOR="Pending_Approval_by_Director";
	public  AUTHORIZED="Authorized";
	public  UNAUTHORIZED_BY_MANAGER="Unauthorized_by_Manager";
	public  UNAUTHORIZED_BY_DIRECTOR="Unauthorized_by_Director";

	//Stage
	public  PO_STAGE="PURCHASE ORDER";
	public  GRN_STAGE="PURCHASE";
	public  SALE_ENQUIRY_STAGE = "SALE ENQUIRY";
	public  SALE_QUOTATION_STAGE = "SALE QUOTATION";
	public  SALE_ORDER_STAGE = "SALE ORDER";
	public  DELIVERY_NOTE_STAGE = "DELIVERY NOTE";
	public  SALE_INVOICE_STAGE = "SALE INVOICE";

	public JOURNAL_VOUCHER = "JOURNAL_VOUCHER";
	public OPENING_BALANCE = "OPENING_BALANCE";
	public CASH_TYPE_JV="CASH_TYPE";
	public convert(str) {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth()+1)).slice(-2),
			day  = ("0" + date.getDate()).slice(-2);
		return [ date.getFullYear(), mnth, day ].join("-");
	}
}