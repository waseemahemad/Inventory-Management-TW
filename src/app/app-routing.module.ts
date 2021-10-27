import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { CreateOrganizationComponent } from './components/create-organization/create-organization.component';
import { EditOrganizationComponent } from './components/edit-organization/edit-organization.component';
import { ListOrganizationComponent } from './components/list-organization/list-organization.component';
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
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthGuard } from './guard/auth.guard';
import { NewSalesEnquiryComponent } from './components/new-sales-enquiry/new-sales-enquiry.component';
import { EditSalesEnquiryComponent } from './components/edit-sales-enquiry/edit-sales-enquiry.component';
import { NewSalesQuotationComponent } from './components/new-sales-quotation/new-sales-quotation.component';
import { EditSalesQuotationComponent } from './components/edit-sales-quotation/edit-sales-quotation.component';
import { NewSalesOrderComponent } from './components/new-sales-order/new-sales-order.component';
import { EditSalesOrderComponent } from './components/edit-sales-order/edit-sales-order.component';
import { NewSalesDeliveryNoteComponent } from './components/new-sales-delivery-note/new-sales-delivery-note.component';
import { EditSalesDeliveryNoteComponent } from './components/edit-sales-delivery-note/edit-sales-delivery-note.component';
import { NewSalesInvoiceComponent } from './components/new-sales-invoice/new-sales-invoice.component';
import { EditSalesInvoiceComponent } from './components/edit-sales-invoice/edit-sales-invoice.component';
import { NewPurchaseSupplierLpoComponent } from './components/new-purchase-supplier-lpo/new-purchase-supplier-lpo.component';
import { EditPurchaseSupplierLpoComponent } from './components/edit-purchase-supplier-lpo/edit-purchase-supplier-lpo.component';
import { NewPurchaseInvoiceComponent } from './components/new-purchase-invoice/new-purchase-invoice.component';
import { EditPurchaseInvoiceComponent } from './components/edit-purchase-invoice/edit-purchase-invoice.component';
import { NewInventoryLedgerComponent } from './components/new-inventory-ledger/new-inventory-ledger.component';
import { EditInventoryLedgerComponent } from './components/edit-inventory-ledger/edit-inventory-ledger.component';
import { NewInventoryStockStatementComponent } from './components/new-inventory-stock-statement/new-inventory-stock-statement.component';
import { EditInventoryStatementComponent } from './components/edit-inventory-statement/edit-inventory-statement.component';
import { InventoryItemsComponent } from './components/inventory-items/inventory-items.component';
import { NewInventoryItemsComponent } from './components/new-inventory-items/new-inventory-items.component';
import { EditInventoryItemsComponent } from './components/edit-inventory-items/edit-inventory-items.component';
import { InventoryItemsAdjustmentsComponent } from './components/inventory-items-adjustments/inventory-items-adjustments.component';
import { NewInventoryItemsAdjustmentsComponent } from './components/new-inventory-items-adjustments/new-inventory-items-adjustments.component';
import { EditInventoryItemsAdjustmentsComponent } from './components/edit-inventory-items-adjustments/edit-inventory-items-adjustments.component';
import { NewPaymentBankComponent } from './components/new-payment-bank/new-payment-bank.component';
import { EditPaymentBankComponent } from './components/edit-payment-bank/edit-payment-bank.component';
import { NewPaymentCashComponent } from './components/new-payment-cash/new-payment-cash.component';
import { EditPaymentCashComponent } from './components/edit-payment-cash/edit-payment-cash.component';
import { NewRecieptsBankComponent } from './components/new-reciepts-bank/new-reciepts-bank.component';
import { EditRecieptsBankComponent } from './components/edit-reciepts-bank/edit-reciepts-bank.component';
import { NewRecieptsCashComponent } from './components/new-reciepts-cash/new-reciepts-cash.component';
import { EditRecieptsCashComponent } from './components/edit-reciepts-cash/edit-reciepts-cash.component';
import { NewJournalOpeningBalanceComponent } from './components/new-journal-opening-balance/new-journal-opening-balance.component';
import { EditJournalOpeningBalanceComponent } from './components/edit-journal-opening-balance/edit-journal-opening-balance.component';
import { NewJournalVoucherComponent } from './components/new-journal-voucher/new-journal-voucher.component';
import { EditJournalVoucherComponent } from './components/edit-journal-voucher/edit-journal-voucher.component';
import { NewJournalDebitNoteComponent } from './components/new-journal-debit-note/new-journal-debit-note.component';
import { EditJournalDebitNoteComponent } from './components/edit-journal-debit-note/edit-journal-debit-note.component';
import { NewJournalCreditNoteComponent } from './components/new-journal-credit-note/new-journal-credit-note.component';
import { EditJournalCreditNoteComponent } from './components/edit-journal-credit-note/edit-journal-credit-note.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { NewContactsComponent } from './components/new-contacts/new-contacts.component';
import { EditContactsComponent } from './components/edit-contacts/edit-contacts.component';
import { NewBankComponent } from './components/new-bank/new-bank.component';
import { EditBankComponent } from './components/edit-bank/edit-bank.component';
import { ListBankComponent } from './components/list-bank/list-bank.component';
import { SalesInvoicePrintComponent } from './components/sales-invoice-print/sales-invoice-print.component';
import { DeliveryNotePrintComponent } from './components/delivery-note-print/delivery-note-print.component';
import { QuotationPrintComponent } from './components/quotation-print/quotation-print.component';
import { SalesOrderPrintComponent } from './components/sales-order-print/sales-order-print.component';
import { NewAccountMasterComponent }from './components/new-account-master/new-account-master.component';
import { EditAccountMasterComponent } from './components/edit-account-master/edit-account-master.component';
import { AccountMasterComponent } from './components/account-master/account-master.component';
import { AccountsTreeComponent } from './components/accounts-tree/accounts-tree.component';
import { AdminMasterModuleComponent } from './components/admin-master-module/admin-master-module.component';
import { AdminMasterSubModuleComponent } from './components/admin-master-sub-module/admin-master-sub-module.component';
import { EditMasterModuleComponent } from './components/edit-master-module/edit-master-module.component';
import { NewMasterModuleComponent } from './components/new-master-module/new-master-module.component';
import { EditMasterSubModuleComponent } from './components/edit-master-sub-module/edit-master-sub-module.component';
import { NewMasterSubModuleComponent } from './components/new-master-sub-module/new-master-sub-module.component';
import { UserAccessManagementComponent } from './components/user-access-management/user-access-management.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ReturnPurchaseInvoiceComponent } from './components/return-purchase-invoice/return-purchase-invoice.component';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path : '',
    component : LoginLayoutComponent,
    children : [
      {
        path : 'login',
        component : LoginComponent
      },      
    ]
  },
  {
    path : '',
    component : AdminLayoutComponent,
    canActivate : [AuthGuard],
    children : [
      {
        path : 'create/user',
        component : CreateUserComponent,
      },      
      {
        path : 'edit/user',
        component : EditUserComponent
      },      
      {
        path : 'list/user',
        component : ListUserComponent
      },      
      // {
      //   path : 'create/org',
      //   component : CreateOrganizationComponent
      // },      
      {
        path : 'edit/org',
        component : EditOrganizationComponent
      },      
      {
        path : 'list/org',
        component : ListOrganizationComponent
      },
      {
        path : 'new/bank',
        component : NewBankComponent
      },
      {
        path : 'edit/bank',
        component : EditBankComponent
      },
      {
        path : 'list/bank',
        component : ListBankComponent
      },
      {
        path : 'admin/master',
        component : AdminMasterModuleComponent
      },
      {
        path : 'admin/sub-master',
        component : AdminMasterSubModuleComponent
      },
      {
        path : 'admin/new-master',
        component : NewMasterModuleComponent
      },
      {
        path : 'admin/:id/edit-master',
        component : EditMasterModuleComponent
      },
      {
        path : 'admin/new-sub-master',
        component : NewMasterSubModuleComponent
      },
      {
        path : 'admin/:id/edit-sub-master',
        component : EditMasterSubModuleComponent
      },
      {
        path : 'admin/user-access',
        component : UserAccessManagementComponent
      },
    ]
  },
  {
    path : '',
    component : AppLayoutComponent,
    canActivate : [AuthGuard],
    children : [
      {
        path:'welcome',
        component :WelcomeComponent
      },
      {
        path:'sales',
        children:[
          {
            path:'enquiry',
            component:SalesEnquiryComponent
          },
          {
            path:'new/enquiry',
            component:NewSalesEnquiryComponent
          },
          {
            path:'edit/:id/enquiry',
            component:EditSalesEnquiryComponent
          },
          {
            path:'quotation',
            component:SalesQuotationComponent
          },
          {
            path:'new/:id/quotation',
            component:NewSalesQuotationComponent
          },{
            path:'new/quotation',
            component:NewSalesQuotationComponent
          },
          {
            path:'edit/:id/quotation',
            component:EditSalesQuotationComponent
          },
          {
            path:'order',
            component:SalesOrderComponent
          },
          {
            path:'new/:id/order',
            component:NewSalesOrderComponent
          },{
            path:'new/order',
            component:NewSalesOrderComponent
          },
          {
            path:'edit/:id/order',
            component:EditSalesOrderComponent
          },
          {
            path:'deliveryNote',
            component:SalesDeliveryNoteComponent
          }, 
          {
            path:'new/:id/delivery-note',
            component:NewSalesDeliveryNoteComponent
          },{
            path:'new/delivery-note',
            component:NewSalesDeliveryNoteComponent
          },
          {
            path:'edit/:id/delivery-note',
            component:EditSalesDeliveryNoteComponent
          },
          {
            path:'invoice',
            component:SalesInvoiceComponent
          },
          {
            path:'new/:id/invoice',
            component:NewSalesInvoiceComponent
          },{
            path:'new/invoice',
            component:NewSalesInvoiceComponent
          },
          {
            path:'edit/:id/invoice',
            component:EditSalesInvoiceComponent
          },
        ]
      },
      {
        path:'purchase',
        children:[
          {
            path:'supplierLPO',
            component:PurchaseSupplierLPOComponent
          },
          {
            path:'new/supplier-lpo',
            component:NewPurchaseSupplierLpoComponent
          },
          {
            path:'edit/supplier-lpo',
            component:EditPurchaseSupplierLpoComponent
          },
          {
            path:'invoice',
            component:PurchaseInvoiceComponent
          },{
            path:'new/:id/invoice',
            component:NewPurchaseInvoiceComponent
          },
          {
            path:'new/invoice',
            component:NewPurchaseInvoiceComponent
          },
          {
            path:'edit/:id/invoice',
            component:EditPurchaseInvoiceComponent
          },
          {
            path:'new/return',
            component:ReturnPurchaseInvoiceComponent
          },
        ]
      },
      {
        path:'inventory',
        children:[
          {
            path:'ledger',
            component:InventoryLedgerComponent
          },
          {
            path:'new/ledger',
            component:NewInventoryLedgerComponent
          },
          {
            path:'edit/ledger',
            component:EditInventoryLedgerComponent
          },
          {
            path:'statement',
            component:InventoryStatementComponent
          },
          {
            path:'new/statement',
            component:NewInventoryStockStatementComponent
          },
          {
            path:'edit/statement',
            component:EditInventoryStatementComponent
          },
          {
            path:'item',
            component:InventoryItemsComponent
          },
          {
            path:'new/item',
            component:NewInventoryItemsComponent
          },
          {
            path:'item/:id/edit',
            component:EditInventoryItemsComponent
          },
          {
            path:'item-adjust',
            component:InventoryItemsAdjustmentsComponent
          },
          {
            path:'new/item-adjust',
            component:NewInventoryItemsAdjustmentsComponent
          },
          {
            path:'edit/:id/item-adjust',
            component:EditInventoryItemsAdjustmentsComponent
          },
        ]
      },
      {
        path:'payment',
        children:[
          {
            path:'bank',
            component:PaymentBankComponent
          },
          {
            path:'new/bank',
            component:NewPaymentBankComponent
          },
          {
            path:'edit/:id/bank',
            component:EditPaymentBankComponent
          },
          {
            path:'cash',
            component:PaymentCashComponent
          },
          {
            path:'new/cash',
            component:NewPaymentCashComponent
          },
          {
            path:'edit/:id/cash',
            component:EditPaymentCashComponent
          },
        ]
      },
      {
        path:'reciepts',
        children:[
          {
            path:'bank',
            component:RecieptsBankComponent
          },
          {
            path:'new/bank',
            component:NewRecieptsBankComponent
          },
          {
            path:'edit/:id/bank',
            component:EditRecieptsBankComponent
          },
          {
            path:'cash',
            component:RecieptsCashComponent
          },
          {
            path:'new/cash',
            component:NewRecieptsCashComponent
          },
          {
            path:'edit/:id/cash',
            component:EditRecieptsCashComponent
          },
        ]
      },
      {
        path:'journal',
        children:[
          {
            path:'opening-balance',
            component:JournalOpeningBalanceComponent
          },
          {
            path:'new/opening-balance',
            component:NewJournalOpeningBalanceComponent
          },
          {
            path:'edit/:id/opening-balance',
            component:EditJournalOpeningBalanceComponent
          },
          {
            path:'voucher',
            component:JournalVoucherComponent
          },
          {
            path:'new/voucher',
            component:NewJournalVoucherComponent
          },
          {
            path:'edit/voucher',
            component:EditJournalVoucherComponent
          },
          {
            path:'edit/:id/voucher',
            component:EditJournalVoucherComponent
          },
          {
            path:'debitNote',
            component:JournalDebitNoteComponent
          },
          {
            path:'new/debit-note',
            component:NewJournalDebitNoteComponent
          },
          {
            path:'edit/debit-note',
            component:EditJournalDebitNoteComponent
          },
          {
            path:'creditNote',
            component:JournalCreditNoteComponent
          },
          {
            path:'new/credit-note',
            component:NewJournalCreditNoteComponent
          },
          {
            path:'edit/credit-note',
            component:EditJournalCreditNoteComponent
          },
        ]
      },
      {
          path:'contacts',
          children :[
            {
              path:'list',
              component : ContactsComponent
            },
            {
              path:'new',
              component:NewContactsComponent
            },
            {
              path:'edit',
              component:EditContactsComponent
            }
          ]
      },
      {
        path:'accounts',
        children :[
          {
            path:'list',
            component : AccountMasterComponent
          },
          {
            path:'new',
            component:NewAccountMasterComponent
          },
          {
            path:':id/edit',
            component:EditAccountMasterComponent
          },
          {
            path:'tree',
            component:AccountsTreeComponent
          }
        ]
    }
      
      
    ]
  },
  {
    path : 'sales/invocie/:id/print',
    component : SalesInvoicePrintComponent

  },
  {
    path : 'delivery/note/:id/print',
    component : DeliveryNotePrintComponent

  },
  {
    path : 'quotation/:id/print',
    component : QuotationPrintComponent

  },
  {
    path : 'sales/order/:id/print',
    component : SalesOrderPrintComponent

  },
  {
    path : '**',
    component : PageNotFoundComponent
  }
  
];
