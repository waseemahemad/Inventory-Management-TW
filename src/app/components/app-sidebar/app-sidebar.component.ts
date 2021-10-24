import { Component, OnInit } from '@angular/core';
import { UserAccessService } from 'src/app/user-access.service';
import { Constants } from 'src/app/commons/constant';
import { NgxPermissionsService } from 'ngx-permissions';
@Component({
  selector: '[app-app-sidebar]',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.css'],
})
export class AppSidebarComponent implements OnInit {
  sales: boolean = false;
  purchase: boolean = false;
  inventory: boolean = false;
  payments: boolean = false;
  receipts: boolean = false;
  journal: boolean = false;
  contacts: boolean = false;
  accounts: boolean = false;
  userAccessDets = [];
  isSalesAllowed: boolean = false;
  constructor(
    private userAccessService: UserAccessService,
    private constants: Constants,
    private permissionsService: NgxPermissionsService
  ) { }

  ngOnInit() {
    // const perm = this.userAccessService.getMasterModules();
    // this.permissionsService.loadPermissions(perm);
  }

  closeMenu() {
    document.getElementById("menu").style.display = "none";
  }

  closeTab(tab) {
    if (tab === 'sales') {
      this.purchase = false;
      this.inventory = false;
      this.payments = false;
      this.receipts = false;
      this.journal = false;
      this.contacts = false;
      this.accounts = false;
    } else if (tab === 'purchase') {
      this.sales = false;
      this.inventory = false;
      this.payments = false;
      this.receipts = false;
      this.journal = false;
      this.contacts = false;
      this.accounts = false;

    } else if (tab === 'inventory') {
      this.sales = false;
      this.purchase = false;
      this.payments = false;
      this.receipts = false;
      this.journal = false;
      this.contacts = false;
      this.accounts = false;

    } else if (tab === 'payments') {
      this.sales = false;
      this.purchase = false;
      this.inventory = false;
      this.receipts = false;
      this.journal = false;
      this.contacts = false;
      this.accounts = false;

    } else if (tab === 'receipts') {
      this.sales = false;
      this.purchase = false;
      this.inventory = false;
      this.payments = false;
      this.journal = false;
      this.contacts = false;
      this.accounts = false;

    } else if (tab === 'journal') {
      this.sales = false;
      this.purchase = false;
      this.inventory = false;
      this.payments = false;
      this.receipts = false;
      this.contacts = false;
      this.accounts = false;
    } else if (tab === 'contacts') {
      this.sales = false;
      this.purchase = false;
      this.inventory = false;
      this.payments = false;
      this.receipts = false;
      this.journal = false;
      this.accounts = false;
    } else if (tab === 'accounts') {
      this.sales = false;
      this.purchase = false;
      this.inventory = false;
      this.payments = false;
      this.receipts = false;
      this.journal = false;
      this.contacts = false;
    } else {
      this.sales = false;
      this.purchase = false;
      this.inventory = false;
      this.payments = false;
      this.receipts = false;
      this.journal = false;
      this.contacts = false;
      this.contacts = false;
    }
  }

}
