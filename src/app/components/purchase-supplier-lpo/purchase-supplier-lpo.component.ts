import { Component, OnInit } from '@angular/core';
import { LPOSpecDto } from '../../model/LPOSpecDto';
import { PurchaseService } from '../../services/purchase.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { SalesService } from '../../services/sales.service';
import { Config } from '../../commons/config';
import { AlertsService } from 'angular-alert-module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';


@Component({
  selector: 'app-purchase-supplier-lpo',
  templateUrl: './purchase-supplier-lpo.component.html',
  styleUrls: ['./purchase-supplier-lpo.component.css']
})
export class PurchaseSupplierLPOComponent implements OnInit {
  lpoSpecDto: LPOSpecDto = {
    page: 1,
    size: 10,
    pono: '',
    displayname: '',
    status: '',
  };
  arrayOfLPOS: Array<any> = [];
  totalCount: any;
  searchForm: FormGroup;
  listLPOS: Array<any> = [];
  constructor(
    private purServ: PurchaseService,
    private fb: FormBuilder,
    private router: Router,
    private constant :Constants,
    private loginService : LoginService,
    private confirmationAlert : ConfirmationDialogService,
    private config : Config,
    private saleService : SalesService,
    private alerts : AlertsService,
    private modalService: NgbModal,
  ) { }

  openFormModal() {
    const modalRef = this.modalService.open(PurchaseModalComponent);
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.listLPO();
    this.initForm();
  }

  public initForm() {
    this.searchForm = this.fb.group({
      pono: ['', []],
      displayname: ['', []],
      status: ['', []],
    });
  }

  public search() {
    this.lpoSpecDto.pono = this.sfc.pono.value;
    this.lpoSpecDto.displayname = this.sfc.displayname.value;
    this.lpoSpecDto.status = this.sfc.status.value;
    this.listLPO();
  }

  public listLPO() {
    this.purServ.listLPO(this.lpoSpecDto).subscribe(res => {
      if (res.code === 200) {
        this.listLPOS = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  };

  toggeleItem(evnt, lpo) {
    if (evnt.currentTarget.checked) {
      this.arrayOfLPOS.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfLPOS = [];
      lpo.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfLPOS.push(lpo);
    } else {
      var index = this.arrayOfLPOS.indexOf(lpo);
      this.arrayOfLPOS.splice(index, 1);
    }
  };

  editLPO() {
    if (this.arrayOfLPOS.length === 1) {
      let id;
      let status;
      this.arrayOfLPOS.forEach(element => {
        id = element.id;
        status = element.status;
        let key = 'lpoID';
        localStorage.setItem(key, id);
      });

      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['/purchase/edit/supplier-lpo']);
      }else if (status == this.constant.AUTHORIZED) {
        this.alerts.setMessage("This Purchase Order Can't Edit it's an Authorized!",'warn');
        return;
      }
      else {
        this.router.navigate(['/purchase/edit/supplier-lpo']);
      }
    } else {
      this.alerts.setMessage("Please Select One LPO !",'warn');
    }
  };

  printLPO(){
    if(this.arrayOfLPOS.length === 1){
      let id;
      this.arrayOfLPOS.forEach(inv => {
        id = inv.id;
      });
      this.saleService.getPDF(this.config._urlpoPrint + id).subscribe((response)=>{
        let file = new Blob([response], { type: 'application/pdf' });            
        let fileURL = URL.createObjectURL(file);
        window.open(fileURL) ;
      });     
    }else{
      this.alerts.setMessage("Please Select One Invoice For Print!",'warn');
    }
  }

  public delete(){
    if(this.arrayOfLPOS.length === 1){
          let id;
          this.arrayOfLPOS.forEach(element => {
            id = element.id;
          });
              if(this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR || this.loginService.getLoggedRole()===AppConstants._ROLE_MANAGER){
                this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
                .then((confirmed) => {
                  if(confirmed){
                    this.purServ.deleteLPOById(id).subscribe(res=>{
                      if(res.code===200){
                        this.alerts.setMessage(res.message,'success');
                        this.listLPO();
                        this.arrayOfLPOS = [];
                      }
                    });
                  }
                });
              }else{
                this.alerts.setMessage("You are not authorized to delete LPO",'warn');
              }
    }else{
      this.alerts.setMessage("Please Select One LPO !",'warn');
    }
  };

  public clearSearch(){
    this.lpoSpecDto.page =1 ;
    this.lpoSpecDto.size =10 ;
    this.searchForm.controls.pono.setValue('');
    this.searchForm.controls.displayname.setValue('');
    this.searchForm.controls.status.setValue('');
    this.search();
  }


  public pageChange(x) {
    this.lpoSpecDto.page = x;
    this.search();
  }

  covertToInvoice() {
    if (this.arrayOfLPOS.length === 1) {
      let id;
      let status;
      this.arrayOfLPOS.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if (status == this.constant.AUTHORIZED) {
        this.router.navigate(['/purchase/new/' + id + '/invoice']);
      } else {
        this.alerts.setMessage("This PO is not Authorized Can't convert!",'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please Select One LPO !",'warn');
    }
  };

  get sfc() { return this.searchForm.controls; }
}
