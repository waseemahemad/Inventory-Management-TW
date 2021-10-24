import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { DeliveryNoteSpecDto } from '../../model/deliveryNoteSpecDto';
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
  selector: 'app-sales-delivery-note',
  templateUrl: './sales-delivery-note.component.html',
  styleUrls: ['./sales-delivery-note.component.css']
})
export class SalesDeliveryNoteComponent implements OnInit {

  searchForm: FormGroup;
  deliverySpec: DeliveryNoteSpecDto = {
    page: 1,
    size: 10,
    deliveryNo: '',
    customername: '',
    status: '',
  };
  pageDto: PageDt = new PageDt();
  salesDto: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private deliveryService: SalesService,
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
    this.getDeliveryList();
  };
  //===========================================GET Order List ==============================//
  public getDeliveryList() {
    this.deliveryService.listDeliveryNotes(this.deliverySpec).subscribe(result => {
      if (result.code === 200) {
        this.pageDto = result.data;
      }
    });
  };

  initForm() {
    this.searchForm = this.fb.group({
      customername: [null, []],
      status: ['', []],
      deliveryNo: [null, []]
    });
  };

  //=======================================Pagination=========================//
  pageChange(x) {
    this.deliverySpec.page = x;
    this.search();
  };
  public search() {
    this.deliverySpec.deliveryNo = this.f.deliveryNo.value;
    this.deliverySpec.customername = this.f.customername.value;
    this.deliverySpec.status = this.f.status.value;
    this.getDeliveryList();
  }

  toggeleItem(evnt, item) {
    if (evnt.currentTarget.checked) {
      this.salesDto.forEach(i=>{
        i.checked = false;
      });
      this.salesDto = [];
      item.checked = true;
      evnt.currentTarget.checked = true;
      this.salesDto.push(item);
    } else {
      var index = this.salesDto.indexOf(item);
      this.salesDto.splice(index, 1);
    }
  };


  editDelivery() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/sales/edit/' + id + '/delivery-note']);
      }else if (status == this.constant.AUTHORIZED) {
        this.alerts.setMessage("Delivery Note Can't Be Edited Once Authorized!",'warn');
        return;
      } else {
        this.router.navigate(['/sales/edit/' + id + '/delivery-note']);
      }
    } else {
      this.alerts.setMessage("Please Select One Delivery Note !",'warn');
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
                    this.saleService.deleteDeliveryNoteById(id).subscribe(res=>{
                      if(res.code===200){
                        this.alerts.setMessage(res.message,'success');
                        this.getDeliveryList();
                        this.salesDto = [];
                      }
                    });
                  }
                });
              }else{
                this.alerts.setMessage("You are not authorized to delete Delivery Note",'warn');
              }
    }else{
      this.alerts.setMessage("Please Select One Delivery Note !",'warn');
    }
  };

  printdelivery() {

    if (this.salesDto.length === 1) {
      let id;
      this.salesDto.forEach(element => {
        id = element.id;
      });
      this.saleService.getPDF(this.config._urldeliveryPrint + id).subscribe((response)=>{
        let file = new Blob([response], { type: 'application/pdf' });            
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL) ;
      });      
    } else {
      this.alerts.setMessage("Please Select One Delivery Note For Print !",'warn');
    }
  }

  public clearSearch(){
    this.deliverySpec.page =1 ;
    this.deliverySpec.size =10 ;
    this.searchForm.controls.deliveryNo.setValue('');
    this.searchForm.controls.customername.setValue('');
    this.searchForm.controls.status.setValue('');
    this.search();
  }

  convertToInvoice() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if (status == this.constant.AUTHORIZED) {
        localStorage.setItem('convFrom', 'deliveryNote');
        this.router.navigate(['sales/new/' + id + '/invoice']);
      } else {
        this.alerts.setMessage("This Delivery Note is not Authorized Can't convert!",'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please Select one Delivery Note",'warn');
    }
  };
  get f() { return this.searchForm.controls; }

}
