import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SalesQuotationSpecDto } from '../../model/salesQuotationSpecDto';
import { PageDt } from '../../model/page-dt';
import { SalesService } from '../../services/sales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { Config } from '../../commons/config';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-sales-quotation',
  templateUrl: './sales-quotation.component.html',
  styleUrls: ['./sales-quotation.component.css']
})
export class SalesQuotationComponent implements OnInit {

  searchForm: FormGroup;
  salesQuoteSpec: SalesQuotationSpecDto={
    page :1 ,
    size :10 ,
    quoteno :'' ,
    customername :'' ,
    status :'' ,
  };
  pageDto: PageDt = new PageDt();
  salesDto: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private saleQuoteService: SalesService,
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
    this.getQuotationList();
  };
  //===========================================GET Quotation List ==============================//
  public getQuotationList() {
    this.saleQuoteService.listSalesQuotationList(this.salesQuoteSpec).subscribe(result => {
      if (result.code === 200) {
        this.pageDto = result.data;
      }
    });
  };

  initForm() {
    this.searchForm = this.fb.group({
      customername: ['', []],
      status: ['', []],
      quoteno: ['', []]
    });
  };

  //=======================================Pagination=========================//
  pageChange(x) {
    this.salesQuoteSpec.page = x;
    this.search();
  };

  search(){
    this.salesQuoteSpec.quoteno = this.f.quoteno.value;
    this.salesQuoteSpec.customername = this.f.customername.value;
    this.salesQuoteSpec.status = this.f.status.value;
    this.getQuotationList();
  }

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

  editQuotation() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status= element.status;
      });
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/sales/edit/' + id + '/quotation']);
      }else if(status == this.constant.AUTHORIZED){
        this.alerts.setMessage("Sale Quotation Can't Be Edited Once Authorized!",'warn');
        return;
      }
      else{
        this.router.navigate(['/sales/edit/' + id + '/quotation']);
      }
    } else {
      this.alerts.setMessage("Please select one Quote!",'warn');
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
                    this.saleService.deleteSalesQuotationById(id).subscribe(res=>{
                      if(res.code===200){
                        this.alerts.setMessage(res.message,'success');
                        this.getQuotationList();
                        this.salesDto = [];
                      }
                    });
                  }
                });
              }else{
                this.alerts.setMessage("You are not authorized to delete Quote",'warn');
              }
    }else{
      this.alerts.setMessage("Please select one Quote!",'warn');
    }
  };

  public clearSearch(){
    this.salesQuoteSpec.page =1 ;
    this.salesQuoteSpec.size =10 ;
    this.searchForm.controls.quoteno.setValue('');
    this.searchForm.controls.customername.setValue('');
    this.searchForm.controls.status.setValue('');
    this.search();
  }

  printQuotation() {
    if (this.salesDto.length === 1) {
      let id;
      this.salesDto.forEach(element => {
        id = element.id;
      });
      this.saleService.getPDF(this.config._urlQuotationPrint + id).subscribe((response)=>{
        let file = new Blob([response], { type: 'application/pdf' });            
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL) ;
      });
    } else {
      this.alerts.setMessage("Please select one Quote to Print!",'warn');
    }
  };

  createQuotation() {
    if (this.salesDto.length === 1) {
      let id;
      this.salesDto.forEach(element => {
        id = element.id;
      });
      this.router.navigate(['/sales/new/' + id + '/quotation']);
    } else {
      this.alerts.setMessage("Please select one Quote!",'warn');
    }
  };

  createOrder() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status= element.status;
      });      
      if(status == this.constant.AUTHORIZED){
        this.router.navigate(['/sales/new/' + id + '/order']);
      }else{
        this.alerts.setMessage("This Sales Quotation is not Authorized Can't convert!",'warn');
        return;
      }
        } else {
          this.alerts.setMessage("Please select one Quote!",'warn');
    }
  };

  createDeliveryNote() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status= element.status;
      });
      if(status == this.constant.AUTHORIZED){
        localStorage.setItem('convFrom', 'quotation');
        this.router.navigate(['/sales/new/' + id + '/delivery-note']);
      }else{
        this.alerts.setMessage("This Sales Quotation is not Authorized Can't convert!",'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please select one Quote!",'warn');
    }
  };

  createInvoice() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status= element.status;
      });
      if(status == this.constant.AUTHORIZED){
      localStorage.setItem('convFrom', 'quotation');
      this.router.navigate(['/sales/new/' + id + '/invoice']);
      }else{
        this.alerts.setMessage("This Sales Quotation is not Authorized Can't convert!",'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please select one Quote!",'warn');
    }
  }
  //===============================================Download PDF ==================================//
 
 
  get f() { return this.searchForm.controls; }

}
