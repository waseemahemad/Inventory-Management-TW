import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseInvoiceSpecDto } from '../../model/purchaseInvoiceSpecDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.css']
})
export class PurchaseInvoiceComponent implements OnInit {
  arrayOfInvoices : Array<any> = [];
  searchForm : FormGroup;
  totalCount : any;
  invoices : any = [];
  purInvSpcDto : PurchaseInvoiceSpecDto={
    page : 1,
    size : 10,
    pono : '',
    grnno : '',
    contactname : '',
    status : '',
  }
  constructor(
    private purServ : PurchaseService,
    private fb : FormBuilder,
    private router : Router,
    private constant :Constants,
    private loginService : LoginService,
    private confirmationAlert : ConfirmationDialogService,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.listInvoices();
  }

  public initForm(){
    this.searchForm = this.fb.group({
      grnno : ['',[]],
      contactname : ['',[]],
      status : ['',[]]
    });
  }

  public listInvoices(){
    this.purServ.listPurchaseInvoices(this.purInvSpcDto).subscribe(res=>{
      if(res.code===200){
        this.invoices = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  };

  public clearSearch(){
    this.purInvSpcDto.page =1 ;
    this.purInvSpcDto.size =10 ;
    this.searchForm.controls.grnno.setValue('');
    this.searchForm.controls.contactname.setValue('');
    this.searchForm.controls.status.setValue('');
    this.search();
  };

  public search(){
    this.purInvSpcDto.grnno = this.sf.grnno.value;
    this.purInvSpcDto.contactname = this.sf.contactname.value;
    this.purInvSpcDto.status = this.sf.status.value;
    this.listInvoices();
  }

  public pageChange(x){    
    this.purInvSpcDto.page = x;
    this.search();    
  }

  get sf(){return this.searchForm.controls;}

  
  toggeleItem(evnt,inv){
    if(evnt.currentTarget.checked){
      this.arrayOfInvoices.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfInvoices = [];
      inv.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfInvoices.push(inv);
    }else{
      var index = this.arrayOfInvoices.indexOf(inv);
      this.arrayOfInvoices.splice(index, 1);
    }  
  };

  editInv(){
    if(this.arrayOfInvoices.length === 1){
      let id;
      let status;
      this.arrayOfInvoices.forEach(inv => {
        id = inv.id;
        status= inv.status;
    });
    if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
      this.router.navigate(['/purchase/edit/'+id+'/invoice']);
    }else if(status == this.constant.AUTHORIZED){
      this.alerts.setMessage("This Purchase  Can't Edit it's an Authorized!",'warn');
      return;
    }
    else{
      this.router.navigate(['/purchase/edit/'+id+'/invoice']);
    }
  }else{
    this.alerts.setMessage("Please Select One LPO !",'warn');
  }
  };
  
  public delete(){
    if(this.arrayOfInvoices.length === 1){
          let id;
          this.arrayOfInvoices.forEach(element => {
            id = element.id;
          });
              if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR || this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
                this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
                .then((confirmed) => {
                  if(confirmed){
                    this.purServ.deletePurchaseInvoiceById(id).subscribe(res=>{
                      if(res.code===200){
                        this.alerts.setMessage(res.message,'success');
                        this.listInvoices();
                        this.arrayOfInvoices = [];
                      }
                    });
                  }
                });
              }else{
                this.alerts.setMessage("You are not authorized to delete Invoice",'warn');
              }
    }else{
      this.alerts.setMessage("Please Select One Invoice !",'warn');
    }
  }
}
