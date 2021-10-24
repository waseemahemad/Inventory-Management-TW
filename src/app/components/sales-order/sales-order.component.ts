import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SalesOrderSpecDto } from '../../model/salesOrderSpecDto';
import { PageDt } from '../../model/page-dt';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesService } from '../../services/sales.service';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { Config } from '../../commons/config';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit {
  searchForm: FormGroup;
  salesOrderSpec: SalesOrderSpecDto = {
    page: 1,
    size: 10,
    orderno: '',
    customername: '',
    status: '',
  };
  pageDto: PageDt = new PageDt();
  salesDto: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private saleOrderService: SalesService,
    private router: Router,
    private constant :Constants,
    private loginService : LoginService,
    private saleService : SalesService,
    private confirmationAlert : ConfirmationDialogService,
    private config : Config,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getOrdersList();
  };
  //===========================================GET Order List ==============================//
  public getOrdersList() {
    this.saleOrderService.listSalesOrders(this.salesOrderSpec).subscribe(result => {
      if (result.code === 200) {
        this.pageDto = result.data;
      }
    });
  };

  initForm() {
    this.searchForm = this.fb.group({
      customername: [null, []],
      status: ['', []],
      orderno: [null, []]
    });
  };

  //=======================================Pagination=========================//
  pageChange(x) {
    this.salesOrderSpec.page = x;
    this.search();
  };

  public search() {
    this.salesOrderSpec.customername = this.f.customername.value;
    this.salesOrderSpec.status = this.f.status.value;
    this.salesOrderSpec.orderno = this.f.orderno.value;
    this.getOrdersList();
  };

  toggeleItem(evnt, quote) {
    if (evnt.currentTarget.checked) {
      this.salesDto.forEach(i=>{
        i.checked = false;
      });
      this.salesDto = [];
      quote.checked = true;
      evnt.currentTarget.checked = true;
      this.salesDto.push(quote);
    } else {
      var index = this.salesDto.indexOf(quote);
      this.salesDto.splice(index, 1);
    }
  };


  editOrder() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/sales/edit/' + id + '/order']);
      }else if (status == this.constant.AUTHORIZED) {
        this.alerts.setMessage("Sale Order Can't Be Edited Once Authorized!",'warn');
        return;
      }else {
        this.router.navigate(['/sales/edit/' + id + '/order']);
      }
    } else {
      this.alerts.setMessage("Please Select One Order",'warn');
    }
  };
  printorder(){
    if(this.salesDto.length === 1){
      let id;
      this.salesDto.forEach(inv => {
        id = inv.id;
      });
      this.saleService.getPDF(this.config._urlOrderPrint + id).subscribe((response)=>{
        let file = new Blob([response], { type: 'application/pdf' });            
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL) ;
      });
    }else{
      this.alerts.setMessage("Please Select One Order For Print!",'warn');
    }
  };

	public delete(){
    if(this.salesDto.length === 1){
          let id;
          this.salesDto.forEach(element => {
            id = element.id;
          });
              if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR || this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
                this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
                .then((confirmed) => {
                  if(confirmed){
                    this.saleService.deleteSalesOrder(id).subscribe(res=>{
                      if(res.code===200){
                        this.alerts.setMessage(res.message,'success');
                        this.getOrdersList();
                        this.salesDto = [];
                      }
                    });
                  }
                });
              }else{
                this.alerts.setMessage("You are not authorized to delete Order",'warn');
              }
    }else{
      this.alerts.setMessage("Please Select One Order !",'warn');
    }
  }

  public clearSearch(){
    this.salesOrderSpec.page =1 ;
    this.salesOrderSpec.size =10 ;
    this.searchForm.controls.customername.setValue('');
    this.searchForm.controls.status.setValue('');
    this.searchForm.controls.orderno.setValue('');
    this.search();
  }

  createDeliveryNote() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });

      if (status == this.constant.AUTHORIZED) {
        localStorage.setItem('convFrom', 'order');
        this.router.navigate(['sales/new/' + id + '/delivery-note']);
      } else {
        this.alerts.setMessage("This Sale Order is not Authorized Can't convert!",'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please Select One Order !",'warn');
    }
  };

  createInvoice() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if (status == this.constant.AUTHORIZED) {
        localStorage.setItem('convFrom', 'order');
        this.router.navigate(['sales/new/' + id + '/invoice']);
      } else {
        this.alerts.setMessage("This Sale Order is not Authorized Can't convert!",'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please Select One Order !",'warn');
    }
  }

  createOrder() {
    if (this.salesDto.length === 1) {
      let id;
      this.salesDto.forEach(element => {
        id = element.id;
      });
      this.router.navigate(['/sales/new/' + id + '/order']);

    } else {
      this.alerts.setMessage("Please Select One Order !",'warn');
    }
  };
  get f() { return this.searchForm.controls; }

}
