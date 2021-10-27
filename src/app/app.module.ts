import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {StompRService} from '@stomp/ng2-stompjs';
import { NgxPermissionsModule } from 'ngx-permissions';
import {NgxPermissionsService} from 'ngx-permissions';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {LoginService} from './services/login.service';
import {JwtInterceptorService} from './token-interceptor/jwt.interceptor.service';
import {WebsocketService} from './services/websocket.service'
import{UserAuthenticationService} from './services/user-authentication-service';
import { appRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { Config } from './commons/config';
import {Constants} from './commons/constant';
import { NgbDateFormatter } from './commons/ngb-date-formatter';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { EditOrganizationComponent } from './components/edit-organization/edit-organization.component';
import { ListOrganizationComponent } from './components/list-organization/list-organization.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar.component';
import { SalesEnquiryComponent } from './components/sales-enquiry/sales-enquiry.component';
import { SalesQuotationComponent } from './components/sales-quotation/sales-quotation.component';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';
import { SalesDeliveryNoteComponent } from './components/sales-delivery-note/sales-delivery-note.component';
import { SalesInvoiceComponent } from './components/sales-invoice/sales-invoice.component';
import { PurchaseSupplierLPOComponent } from './components/purchase-supplier-lpo/purchase-supplier-lpo.component';
import { PurchaseInvoiceComponent } from './components/purchase-invoice/purchase-invoice.component';
import { InventoryLedgerComponent } from './components/inventory-ledger/inventory-ledger.component';
import { InventoryStatementComponent } from './components/inventory-statement/inventory-statement.component';
import { PaymentBankComponent } from './components/payment-bank/payment-bank.component';
import { PaymentCashComponent } from './components/payment-cash/payment-cash.component';
import { RecieptsBankComponent } from './components/reciepts-bank/reciepts-bank.component';
import { RecieptsCashComponent } from './components/reciepts-cash/reciepts-cash.component';
import { JournalOpeningBalanceComponent } from './components/journal-opening-balance/journal-opening-balance.component';
import { JournalVoucherComponent } from './components/journal-voucher/journal-voucher.component';
import { JournalDebitNoteComponent } from './components/journal-debit-note/journal-debit-note.component';
import { JournalCreditNoteComponent } from './components/journal-credit-note/journal-credit-note.component';
import { AlertsService,AlertsModule } from 'angular-alert-module';
import { AddCustomerModalComponent } from './components/add-customer-modal/add-customer-modal.component';
import { EditSalesQuotationComponent } from './components/edit-sales-quotation/edit-sales-quotation.component';
import { EditSalesEnquiryComponent } from './components/edit-sales-enquiry/edit-sales-enquiry.component';
import { EditSalesOrderComponent } from './components/edit-sales-order/edit-sales-order.component';
import { EditSalesDeliveryNoteComponent } from './components/edit-sales-delivery-note/edit-sales-delivery-note.component';
import { EditSalesInvoiceComponent } from './components/edit-sales-invoice/edit-sales-invoice.component';
import { EditPurchaseSupplierLpoComponent } from './components/edit-purchase-supplier-lpo/edit-purchase-supplier-lpo.component';
import { EditPurchaseInvoiceComponent } from './components/edit-purchase-invoice/edit-purchase-invoice.component';
import { EditInventoryLedgerComponent } from './components/edit-inventory-ledger/edit-inventory-ledger.component';
import { EditInventoryStatementComponent } from './components/edit-inventory-statement/edit-inventory-statement.component';
import { InventoryItemsComponent } from './components/inventory-items/inventory-items.component';
import { InventoryItemsAdjustmentsComponent } from './components/inventory-items-adjustments/inventory-items-adjustments.component';
import { EditInventoryItemsAdjustmentsComponent } from './components/edit-inventory-items-adjustments/edit-inventory-items-adjustments.component';
import { EditInventoryItemsComponent } from './components/edit-inventory-items/edit-inventory-items.component';
import { EditPaymentBankComponent } from './components/edit-payment-bank/edit-payment-bank.component';
import { EditPaymentCashComponent } from './components/edit-payment-cash/edit-payment-cash.component';
import { EditRecieptsCashComponent } from './components/edit-reciepts-cash/edit-reciepts-cash.component';
import { EditRecieptsBankComponent } from './components/edit-reciepts-bank/edit-reciepts-bank.component';
import { EditJournalOpeningBalanceComponent } from './components/edit-journal-opening-balance/edit-journal-opening-balance.component';
import { EditJournalVoucherComponent } from './components/edit-journal-voucher/edit-journal-voucher.component';
import { EditJournalDebitNoteComponent } from './components/edit-journal-debit-note/edit-journal-debit-note.component';
import { EditJournalCreditNoteComponent } from './components/edit-journal-credit-note/edit-journal-credit-note.component';
import { NewJournalCreditNoteComponent } from './components/new-journal-credit-note/new-journal-credit-note.component';
import { NewJournalDebitNoteComponent } from './components/new-journal-debit-note/new-journal-debit-note.component';
import { NewJournalVoucherComponent } from './components/new-journal-voucher/new-journal-voucher.component';
import { NewJournalOpeningBalanceComponent } from './components/new-journal-opening-balance/new-journal-opening-balance.component';
import { NewRecieptsBankComponent } from './components/new-reciepts-bank/new-reciepts-bank.component';
import { NewRecieptsCashComponent } from './components/new-reciepts-cash/new-reciepts-cash.component';
import { NewPaymentCashComponent } from './components/new-payment-cash/new-payment-cash.component';
import { NewPaymentBankComponent } from './components/new-payment-bank/new-payment-bank.component';
import { NewInventoryLedgerComponent } from './components/new-inventory-ledger/new-inventory-ledger.component';
import { NewInventoryStockStatementComponent } from './components/new-inventory-stock-statement/new-inventory-stock-statement.component';
import { NewInventoryItemsComponent } from './components/new-inventory-items/new-inventory-items.component';
import { NewInventoryItemsAdjustmentsComponent } from './components/new-inventory-items-adjustments/new-inventory-items-adjustments.component';
import { NewPurchaseSupplierLpoComponent } from './components/new-purchase-supplier-lpo/new-purchase-supplier-lpo.component';
import { NewPurchaseInvoiceComponent } from './components/new-purchase-invoice/new-purchase-invoice.component';
import { NewSalesQuotationComponent } from './components/new-sales-quotation/new-sales-quotation.component';
import { NewSalesEnquiryComponent } from './components/new-sales-enquiry/new-sales-enquiry.component';
import { NewSalesOrderComponent } from './components/new-sales-order/new-sales-order.component';
import { NewSalesDeliveryNoteComponent } from './components/new-sales-delivery-note/new-sales-delivery-note.component';
import { NewSalesInvoiceComponent } from './components/new-sales-invoice/new-sales-invoice.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { NewContactsComponent } from './components/new-contacts/new-contacts.component';
import { EditContactsComponent } from './components/edit-contacts/edit-contacts.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogService} from './confirmation-dialog/confirmation-dialog-service';
import {SalesService} from './services/sales.service';
import { NewBankComponent } from './components/new-bank/new-bank.component';
import { EditBankComponent } from './components/edit-bank/edit-bank.component';
import { ListBankComponent } from './components/list-bank/list-bank.component';
import { DropzoneModule, DROPZONE_CONFIG, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { AddBankModelComponent } from './components/add-bank-model/add-bank-model.component';
import { SalesInvoicePrintComponent } from './components/sales-invoice-print/sales-invoice-print.component';
import { SuplierLpoPrintComponent } from './components/suplier-lpo-print/suplier-lpo-print.component';
import { DeliveryNotePrintComponent } from './components/delivery-note-print/delivery-note-print.component';
import { QuotationPrintComponent } from './components/quotation-print/quotation-print.component';
import { SalesOrderPrintComponent } from './components/sales-order-print/sales-order-print.component';
import { SalesModalComponent } from './components/sales-modal/sales-modal.component';
import { PurchaseModalComponent } from './components/purchase-modal/purchase-modal.component';
import { NewAccountMasterComponent } from './components/new-account-master/new-account-master.component';
import { EditAccountMasterComponent } from './components/edit-account-master/edit-account-master.component';
import { AccountMasterComponent } from './components/account-master/account-master.component';
import { AccountsTreeComponent } from './components/accounts-tree/accounts-tree.component';
import { DxTreeViewModule } from 'devextreme-angular';
import { AddAccountTypeModalComponent } from './components/add-account-type-modal/add-account-type-modal.component';
import { AddAccountGroupComponent } from './components/add-account-group/add-account-group.component';
import { AdminMasterModuleComponent } from './components/admin-master-module/admin-master-module.component';
import { AdminMasterSubModuleComponent } from './components/admin-master-sub-module/admin-master-sub-module.component';
import { NewMasterModuleComponent } from './components/new-master-module/new-master-module.component';
import { EditMasterModuleComponent } from './components/edit-master-module/edit-master-module.component';
import { NewMasterSubModuleComponent } from './components/new-master-sub-module/new-master-sub-module.component';
import { EditMasterSubModuleComponent } from './components/edit-master-sub-module/edit-master-sub-module.component';
import { UserAccessManagementComponent } from './components/user-access-management/user-access-management.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ReturnPurchaseInvoiceComponent } from './components/return-purchase-invoice/return-purchase-invoice.component';




const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
 // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 25,
  clickable: true,
  maxFiles: 5,
  uploadMultiple: false,
  addRemoveLinks: true,
  acceptedFiles: 'image/*,application/pdf,.docx,.xlsx',
  previewsContainer : null,
};
@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    LoginComponent,
    PageNotFoundComponent,
    AdminLayoutComponent,
    UserListComponent,
    AdminSidebarComponent,
    HeaderComponent,
    FooterComponent,
    CreateUserComponent,
    ListUserComponent,
    EditUserComponent,
    CreateOrganizationComponent,
    ConfirmationDialogComponent,
    EditOrganizationComponent,
    ListOrganizationComponent,
    AppLayoutComponent,
    AppSidebarComponent,
    SalesEnquiryComponent,
    SalesQuotationComponent,
    SalesOrderComponent,
    SalesDeliveryNoteComponent,
    SalesInvoiceComponent,
    PurchaseSupplierLPOComponent,
    PurchaseInvoiceComponent,
    InventoryLedgerComponent,
    InventoryStatementComponent,
    PaymentBankComponent,
    PaymentCashComponent,
    RecieptsBankComponent,
    RecieptsCashComponent,
    JournalOpeningBalanceComponent,
    JournalVoucherComponent,
    JournalDebitNoteComponent,
    JournalCreditNoteComponent,
    AddCustomerModalComponent,
    EditSalesQuotationComponent,
    EditSalesEnquiryComponent,
    EditSalesOrderComponent,
    EditSalesDeliveryNoteComponent,
    EditSalesInvoiceComponent,
    EditPurchaseSupplierLpoComponent,
    EditPurchaseInvoiceComponent,
    EditInventoryLedgerComponent,
    EditInventoryStatementComponent,
    InventoryItemsComponent,
    InventoryItemsAdjustmentsComponent,
    EditInventoryItemsAdjustmentsComponent,
    EditInventoryItemsComponent,
    EditPaymentBankComponent,
    EditPaymentCashComponent,
    EditRecieptsCashComponent,
    EditRecieptsBankComponent,
    EditJournalOpeningBalanceComponent,
    EditJournalVoucherComponent,
    EditJournalDebitNoteComponent,
    EditJournalCreditNoteComponent,
    NewJournalCreditNoteComponent,
    NewJournalDebitNoteComponent,
    NewJournalVoucherComponent,
    NewJournalOpeningBalanceComponent,
    NewRecieptsBankComponent,
    NewRecieptsCashComponent,
    NewPaymentCashComponent,
    NewPaymentBankComponent,
    NewInventoryLedgerComponent,
    NewInventoryStockStatementComponent,
    NewInventoryItemsComponent,
    NewInventoryItemsAdjustmentsComponent,
    NewPurchaseSupplierLpoComponent,
    NewPurchaseInvoiceComponent,
    NewSalesQuotationComponent,
    NewSalesEnquiryComponent,
    NewSalesOrderComponent,
    NewSalesDeliveryNoteComponent,
    NewSalesInvoiceComponent,
    ContactsComponent,
    NewContactsComponent,
    EditContactsComponent,
    NewBankComponent,
    EditBankComponent,
    ListBankComponent,
    AddBankModelComponent,
    SalesInvoicePrintComponent,
    SuplierLpoPrintComponent,
    DeliveryNotePrintComponent,
    QuotationPrintComponent,
    SalesOrderPrintComponent,
    SalesModalComponent,
    PurchaseModalComponent,
    NewAccountMasterComponent,
    EditAccountMasterComponent,
    AccountMasterComponent,
    AccountsTreeComponent,
    AddAccountTypeModalComponent,
    AddAccountGroupComponent,
    AdminMasterModuleComponent,
    AdminMasterSubModuleComponent,
    NewMasterModuleComponent,
    EditMasterModuleComponent,
    NewMasterSubModuleComponent,
    EditMasterSubModuleComponent,
    UserAccessManagementComponent,
    WelcomeComponent,
    ReturnPurchaseInvoiceComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    DropzoneModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    NgbModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    FormsModule,
    AlertsModule.forRoot(),
    DxTreeViewModule
  ],
  providers: [Config,Constants,
    NgxPermissionsService,
    StompRService,
    WebsocketService,LoginService,
    UserAuthenticationService,
    AlertsService,
    SalesService,
    ConfirmationDialogService,
    { provide: HTTP_INTERCEPTORS, useClass:  JwtInterceptorService, multi: true },
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateFormatter},{
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddCustomerModalComponent,
    ConfirmationDialogComponent,
    AddBankModelComponent,
    SalesModalComponent,
    PurchaseModalComponent,
    AddAccountGroupComponent,
    AddAccountTypeModalComponent
  ]
})
export class AppModule { }
