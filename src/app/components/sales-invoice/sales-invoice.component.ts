import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { SalesInvoiceSpecDto } from '../../model/salesInvoiceSpecDto';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { Config } from '../../commons/config';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.css']
})
export class SalesInvoiceComponent implements OnInit {
  arrayOfInv : Array<any>=[];
  searchForm : FormGroup
  totalCount : any;
  invoices : any;
  salInvSpec : SalesInvoiceSpecDto={
    page : 1 ,
    size : 10 ,
    saleno : '' ,
    enqNo : '',
    quoteno : '',
    orderNo : '',
    deliveryNo : '',
    customername : '' ,
    status : '' ,
  };
  fileURL : any='';
  constructor(
    private salServ : SalesService,
    private fb : FormBuilder,
    private router : Router,
    private constant :Constants,
    private loginService : LoginService,
    private saleService : SalesService,
    private confirmationAlert : ConfirmationDialogService,
    private config : Config,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getList();
  }

  public getList(){
    this.salServ.listSalesInvoice(this.salInvSpec).subscribe(res=>{
        if(res.code===200){
          this.invoices = res.data.data;
          this.totalCount = res.data.totalCount;
        }
    });
  }

  public initForm(){
    this.searchForm = this.fb.group({
      saleno : ['',[]],
      customername : ['',[]],
      status : ['',[]],
    });
  }

  public search(){
    this.salInvSpec.saleno = this.sf.saleno.value;
    this.salInvSpec.customername = this.sf.customername.value;
    this.salInvSpec.status = this.sf.status.value;
    this.getList();
  }
  public pageChange(x){    
    this.salInvSpec.page = x;
    this.search();
  }

  toggeleItem(evnt,inv){
    if(evnt.currentTarget.checked){
      this.arrayOfInv.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfInv = [];
      inv.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfInv.push(inv);
    }else{
      var index = this.arrayOfInv.indexOf(inv);
      this.arrayOfInv.splice(index, 1);
    }  
  };

  edit(){
    if(this.arrayOfInv.length === 1){
      let id;
      let status;
      this.arrayOfInv.forEach(inv => {
        id = inv.id;
        status= inv.status;
      });
      
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/sales/edit/'+id+'/invoice']);
      }else if(status == this.constant.AUTHORIZED){
        this.alerts.setMessage("This Sale Invoice Can't Edit it's an Authorized!",'warn');
        return;
      }
      else{
        this.router.navigate(['/sales/edit/'+id+'/invoice']);
      }
    }else{
      this.alerts.setMessage("Please Select One Invoice !",'warn');
    }
  };

  public delete(){
    if(this.arrayOfInv.length === 1){
          let id;
          this.arrayOfInv.forEach(element => {
            id = element.id;
          });
              if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR || this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
                this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
                .then((confirmed) => {
                  if(confirmed){
                    this.saleService.deleteSalesInvoiceById(id).subscribe(res=>{
                      if(res.code===200){
                        this.alerts.setMessage(res.message,'success');
                        this.getList();
                        this.arrayOfInv = [];
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
  };

  public clearSearch(){
    this.salInvSpec.page =1 ;
    this.salInvSpec.size =10 ;
    this.searchForm.controls.saleno.setValue('');
    this.searchForm.controls.customername.setValue('');
    this.searchForm.controls.status.setValue('');
    this.search();
  };
  

  printInvoice(){
    if(this.arrayOfInv.length === 1){
      let id;
      this.arrayOfInv.forEach(inv => {
        id = inv.id;
      });
      this.saleService.getPDF(this.config._urlsaleinvoicePrint+id).subscribe((response)=>{
        let file = new Blob([response], { type: 'application/pdf' });            
        this.fileURL = URL.createObjectURL(file);
        window.open(this.fileURL) ;
      });
    }else{
      this.alerts.setMessage("Please Select One Invoice For Print!",'warn');
    }
  }

  get sf(){return this.searchForm.controls;}


}
