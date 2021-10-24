import { Component, OnInit } from '@angular/core';
import { BankService } from '../../services/bank.service';
import { BankSpecDto } from '../../model/bankSpecDto';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: ['./list-bank.component.css']
})
export class ListBankComponent implements OnInit {
  bankSpec: BankSpecDto = {
    page: 1,
    size: 10,
    bankName: '',
    bankCode: '',
  };
  banks: any;
  totalCount : any;
  arrayOfBanks : Array<any> =[];
  constructor(
    private bs: BankService,
    private router : Router,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.getBankList();
  }

  public getBankList() {
    this.bs.listBanks(this.bankSpec).subscribe(res => {
      if (res.code === 200) {
        this.banks = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  }

  public pageChange(x){    
    this.bankSpec.page = x;
    this.getBankList();
  }

  toggeleItem(evnt,bank){
    if(evnt.currentTarget.checked){
      this.arrayOfBanks.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfBanks = [];
      bank.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfBanks.push(bank);
    }else{
      var index = this.arrayOfBanks.indexOf(bank);
      this.arrayOfBanks.splice(index, 1);
    }  
  };
  edit(){
    if(this.arrayOfBanks.length === 1){
      let id;
      this.arrayOfBanks.forEach(bank => {
        id = bank.id;
        localStorage.setItem('bankId',id);
    });
    this.router.navigate(['/edit/bank']);
  }else{
    this.alerts.setMessage("Please Select One Bank !",'warn');
  }
  };
}
