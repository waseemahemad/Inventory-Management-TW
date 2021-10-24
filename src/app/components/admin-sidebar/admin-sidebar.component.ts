import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[app-admin-sidebar]',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

users : boolean = false;
organizations : boolean = false;
bank : boolean = false;
master : boolean = false;
uaccess : boolean = false;

  constructor() { }

  ngOnInit() {
  }
  public closeTab(tab){
    if(tab === 'users'){
      this.organizations = false;
      this.bank = false;
      this.master = false;
      this.uaccess = false;
    }else if(tab === 'organizations'){
      this.users = false;
      this.bank = false;
      this.master = false;
      this.uaccess = false;
    }else if(tab === 'bank'){
      this.users = false;
      this.organizations = false;
      this.master = false;
      this.uaccess = false;
    }else if(tab === 'master'){
      this.users = false;
      this.organizations = false;
      this.bank = false;
      this.uaccess = false;
    }else if(tab === 'uaccess'){
      this.users = false;
      this.organizations = false;
      this.bank = false;
      this.master = false;
    }else{
      this.users = false;
      this.organizations = false;
      this.bank = false;
      this.master = false;
      this.uaccess = false;
    }
  }
}
