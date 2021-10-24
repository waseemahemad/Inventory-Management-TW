import {environment} from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	
	public envProd : boolean = environment.production;
	public _apiPath : string = '/';
	public _serverAddress : string = environment._server + environment._rootContext + this._apiPath;
	public _webSocketAddress : string = environment._webSocket + this._apiPath;
	public _urlWebSocket : string = this._webSocketAddress + 'socket';
	/* Admin URL => */
	public _urlLogin : string = this._serverAddress + 'login';
	//=====================================================Commons===================================================================//
	//=====================================================CSC======================================================================
	public _urlGetCountries : string = this._serverAddress + 'rest/api/country';
	public _urlGetStates : string = this._serverAddress + 'rest/api/state/';
	public _urlGetCities : string = this._serverAddress + 'rest/api/city/';
	//======================================================== User==================================================================
	public _urlCreateUser : string = this._serverAddress + 'rest/api/user/add';
	public _urlGetUserList : string = this._serverAddress + 'rest/api/user/list';
	public _urlUpdateUser : string = this._serverAddress + 'rest/api/user/edit';
	//=======================================================Company=================================================================
	public _urlCreateCompany : string = this._serverAddress + 'rest/api/add/company';
	public _urlListCompany : string = this._serverAddress + 'rest/api/company/list';
	public _urlGetCompanyById : string = this._serverAddress + 'rest/api/edit/company/';
	//=======================================================Contact=================================================================
	public _urlCreateContact : string = this._serverAddress + 'rest/api/add/contacts';
	public _urlListContacts : string = this._serverAddress + 'rest/api/contacts/list';
	public _urlGetContactById : string = this._serverAddress + 'rest/api/edit/contacts/';
	public _urlDeleteContactPersonById : string = this._serverAddress + 'rest/api/delete/contactper/'
	//=======================================================Document=================================================================
	public _urlUploadDocument : string = this._serverAddress + 'rest/api/document/upload';
	public _urlGetImage : string = this._serverAddress + 'rest/api/document/image/';
	public _urlGetPdf : string = this._serverAddress + 'rest/api/document/pdf/';
	public _urlGetDoc : string = this._serverAddress + 'rest/api/document/docs/';
	public _urlDeleteDocument :  string = this._serverAddress + 'rest/api/document/delete/';
	//=======================================================BANK=================================================================
	public _urlCreateBank : string = this._serverAddress + 'rest/api/bank/add';
	public _urlGetBankById : string = this._serverAddress + 'rest/api/bank/get/';
	public _urlDeleteBankById : string = this._serverAddress + 'rest/api/bank/delete/';
	public _urlListBanks : string = this._serverAddress + 'rest/api/bank/list';
	public _urlGetListOfBanksDropDown : string = this._serverAddress + 'rest/api/bank/banklist';
	//================================================================================================================================//
	public _urlAddMasterModule : string = this._serverAddress + 'rest/api/master/module/create';
	public _urlListMasterModule : string = this._serverAddress + 'rest/api/master/module/list';
	public _urlGetMasterModuleById : string = this._serverAddress + 'rest/api/master/module/get/';

	public _urlAddSubMasterModule : string = this._serverAddress + 'rest/api/module/sub/master/create';
	public _urlGetSubMasterModuleById : string = this._serverAddress + 'rest/api/module/sub/master/get/';
	public _urlListSubMasterModule : string = this._serverAddress + 'rest/api/module/sub/master/list';
	public _urlgetSubModulesByMasterId : string = this._serverAddress + 'rest/api/module/sub/master/get/by/master/';

	public _urlAssignUserAccess : string = this._serverAddress + 'rest/api/user/access/create';
	public _urlGetUserAccessByModuleId : string = this._serverAddress + 'rest/api/user/access/listbymodule';


	//==========================================================SALES===============================================================//
	//===============================SALES-ENQUIRY===================================================================================
	public _urlCreateSalesEnquiry : string = this._serverAddress + 'rest/api/sale/create/enquiry';
	public _urlGetSalesEnquiryById : string = this._serverAddress + 'rest/api/sale/get/enquiry/';
	public _urlDeleteSalesEnquiryById : string = this._serverAddress + 'rest/api/sale/delete/enquiry/';
	public _urlListSalesEnquiry : string = this._serverAddress + 'rest/api/sale/get/enquiry/list';
	public _urlListProducts : string = this._serverAddress + 'product/bycode';
	public _urlGetCustomerList: string = this._serverAddress + 'rest/api/contacts/findall';
	public _urlGetSaleList: string = this._serverAddress + 'rest/api/user/findAll';
	public _urlGetEntiryId: string = this._serverAddress + 'rest/api/entityidrep/';
	public _urlDeleteEnqItem : string = this._serverAddress + 'rest/api/sale/deleteitem/';
	//===============================SALES-QUOTATION=================================================================================
	public _urlCreateSalesQuotation : string = this._serverAddress + 'sale/quatation/add';
	public _urlGetSalesQuotationById : string = this._serverAddress + 'sale/quatation/get/';
	public _urlDeleteSalesQuotationById : string = this._serverAddress + 'sale/quatation/delete/';
	public _urlListSalesQuotations : string = this._serverAddress + 'sale/quatation/list';
	public _urlDeleteSalesQuotationItemById : string = this._serverAddress + 'sale/quatation/deleteitem/';
	public _urlPrintSalesQuotationById : string = this._serverAddress + 'sale/quatation/print/';
	public _urlQuotationPrint : string =this._serverAddress + 'public/export/quotation/pdf/';

	//===============================SALES-ORDER====================================================================================
	public _urlCreateSalesOrder : string = this._serverAddress + 'sale/order/add';
	public _urlGetSalesOrderById : string = this._serverAddress + 'sale/order/get/';
	public _urlDeleteSalesOrderById : string = this._serverAddress + 'sale/order/delete/';
	public _urlListSalesOrders : string = this._serverAddress + 'sale/order/list';
	public _urlDeleteSalesOrderItemById : string = this._serverAddress + 'sale/order/deleteitem/';
	public _urlPrintSalesOrders : string = this._serverAddress + 'sale/order/print/';
	public _urlOrderPrint : string =this._serverAddress + 'public/export/order/pdf/';

	//===============================SALES-DeliveryNote==============================================================================
	public _urlCreateDeliveryNote : string = this._serverAddress + 'rest/api/delivery/create';
	public _urlGetDeliveryNoteById : string = this._serverAddress + 'rest/api/delivery/get/delivery/';
	public _urlDeleteDeliveryNoteById : string = this._serverAddress + 'rest/api/delivery/delete/';
	public _urlListDeliveryNotes : string = this._serverAddress + 'rest/api/delivery/get/list';
	public _urlDeleteDeliveryNoteItemById : string = this._serverAddress + 'rest/api/delivery/deleteitem/';
	public _urlPrintDeliveryNoteById : string = this._serverAddress + 'rest/api/delivery/print/delivery/';
	public _urldeliveryPrint : string =this._serverAddress + 'public/export/delivery/pdf/';

	//===============================SALES-Invoice==================================================================================
	public _urlCreateSalesInvoice : string = this._serverAddress + 'sale/add';
	public _urlGetSalesInvoiceById : string = this._serverAddress + 'sale/get/';
	public _urlDeleteSalesInvoiceById : string = this._serverAddress + 'sale/delete/';
	public _urlListSalesInvoices : string = this._serverAddress + 'sale/list';
	public _urlDeleteSalesInvoiceItemById : string = this._serverAddress + 'sale/deleteitem/';
	public _urlsaleinvoicePrint : string =this._serverAddress + 'public/export/saleinvoice/pdf/';

	//===============================================================================================================================//



	//==========================================================PURCHASE===========================================================//
	//============================purchase--LPO=====================================================================================
	public _urlCreateLPO : string = this._serverAddress + 'rest/api/create/po';
	public _urlGetLPOById : string = this._serverAddress + 'rest/api/po/get/';
	public _urlDeleteLPOById : string = this._serverAddress + 'rest/api/po/delete/';
	public _urlListLPO : string = this._serverAddress + 'rest/api/po/list';
	public _urlDeleteLPOItem : string = this._serverAddress + 'rest/api/po/deleteItem/';
	public _urlpoPrint : string =this._serverAddress + 'public/export/po/pdf/';
	//============================purchase--INVOICE==================================================================================
	public _urlCreatePurchaseInvoice : string = this._serverAddress + 'purchase/add/grn';
	public _urlGetPurchaseInvoiceById : string = this._serverAddress + 'purchase/get/';
	public _urlDeletePurchaseInvoiceById : string = this._serverAddress + 'purchase/delete/';
	public _urlDeletePurchaseInvoiceItemById : string = this._serverAddress + 'purchase/deleteItem/';
	public _urlListPurchaseInvoices : string = this._serverAddress + 'purchase/list';
	//================================================================================================================================//


	//==========================================================Inventory==============================================================//
	//======================================================Inventory-item==============================================================
	public _urlAddItem : string = this._serverAddress + 'product/add/item';
	public _urlListItems : string = this._serverAddress + 'product/product/list';
	public _urlGetItemById : string = this._serverAddress + 'product/edit/product/';

	public _urlStockById : string = this._serverAddress + 'stock/byItem/';
	public _urladjust : string = this._serverAddress + 'stock/adjust';
	public _urlgetStockList : string = this._serverAddress + 'stock/list';
	public _urlbyStockInOutId : string = this._serverAddress + 'stock/byStockInOut/';

	public _urllistofval : string = this._serverAddress + 'rest/api/listofval/';
	//================================================================================================================================//


	//==========================================================Payments==============================================================//
	public _urlCreatePayment : string = this._serverAddress + 'payment/add';
	public _urlgetpendinginvoice : string = this._serverAddress + 'purchase/getbyVendor/';
	public _urlgetbankList : string = this._serverAddress + 'rest/api/bank/banklist';
	public _urlgetPaymentList : string = this._serverAddress + 'payment/list';
	public _urlGetPaymentById : string = this._serverAddress + 'payment/get/';


	//================================================================================================================================//


	//==========================================================Reciepts==============================================================//
	public _urlCreateReceipt : string = this._serverAddress + 'rest/api/receipt/generate';
	public _urlgetpendingsalei : string = this._serverAddress + 'sale/getbyCustomer/';
	
	public _urlgetReceiptList : string = this._serverAddress + 'rest/api/receipt/list';
	public _urlGetRecById : string = this._serverAddress + 'rest/api/receipt/get/';

	//================================================================================================================================//


	//==========================================================Journal Entries=======================================================//
	//=========================================================journal---credit--Note===================================================
	public _urlAddCreditNote : string = this._serverAddress + 'rest/api/credit/add';
	public _urlGetCreditNoteByID : string = this._serverAddress + 'rest/api/credit/get/';
	public _urlDeleteCreditNoteById : string = this._serverAddress + 'rest/api/credit/delete/';
	public _urlListCreditNote : string = this._serverAddress + 'rest/api/credit/list';
	//=========================================================journal---debit--Note====================================================
	public _urlAddDebitNote : string = this._serverAddress + 'debitNote/add';
	public _urlGetDebitNoteById : string = this._serverAddress + 'debitNote/get/';
	public _urlDeleteDebitNoteById : string = this._serverAddress + 'debitNote/delete/';
	public _urlListDebitNote : string = this._serverAddress + 'debitNote/list';
	//================================================================================================================================//

	//===========================================JOURNAL-VOUCHER-============================================
	public _urladdjournalvoucher : string = this._serverAddress + 'journalentries/add';
	public _urlListJournalVouchers : string = this._serverAddress + 'journalentries/list';
	public _urlGetJournalVoucherById : string = this._serverAddress + 'journalentries/get/';

	//===========================================JOURNAL-OPENING_BALANCE-============================================
	public _urlAddOpeningBalance : string = this._serverAddress + 'openingBalance/add';
	public _urlGetOpeningBalanceByID : string = this._serverAddress + 'openingBalance/get/';
	public _urlListOpeningBalance : string = this._serverAddress + 'openingBalance/list';

	//===========================================Accounts-============================================
	public _urlGetAccountsGroup  : string = this._serverAddress + 'rest/api/accmst/listmst';
	public _urlCreateSubAccount  : string = this._serverAddress + 'rest/api/accmst/addsubmst';
	public _urlGetCategory  : string = this._serverAddress + 'rest/api/accmst/iscaty';
	public _urlListAccounts  : string = this._serverAddress + 'rest/api/accmst/listsubmst';
	public _urlEditSubAcc  : string = this._serverAddress + 'rest/api/accmst/editsubmst/';
	public _urlAddAccType  : string = this._serverAddress + 'rest/api/accmst/addtype';
	public _urlEditAccType  : string = this._serverAddress + 'rest/api/accmst/editaccounttype/';
	public _urlListAccType  : string = this._serverAddress + 'rest/api/accmst/lisacctype';
	public _urlAddAccGrp  : string = this._serverAddress + 'rest/api/accmst/addmst';
	public _urlListAccGrp  : string = this._serverAddress + 'rest/api/accmst/editmst/';
	public _urlEditAccGrp  : string = this._serverAddress + 'rest/api/accmst/lisacctype';
	public _urlForAccMasterPageList  : string = this._serverAddress + 'rest/api/accmst/subaccountlist';
	
	
}
