import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCustomerModalComponent } from '../add-customer-modal/add-customer-modal.component';
import { SalesService } from '../../services/sales.service';
import { SalesEnquirySpecDto } from '../../model/saleEnquirySpecDto';
import { PageDt } from '../../model/page-dt';
import { Router } from '@angular/router';
import { Constants } from '../../commons/constant';
import { AppConstants } from '../../commons/app-constant';
import { LoginService } from '../../services/login.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';
import { AlertsService } from 'angular-alert-module';
import { SalesModalComponent } from '../../components/sales-modal/sales-modal.component';
@Component({
  selector: 'app-sales-enquiry',
  templateUrl: './sales-enquiry.component.html',
  styleUrls: ['./sales-enquiry.component.css']
})
export class SalesEnquiryComponent implements OnInit {
  closeResult: string;
  salesForm: FormGroup;
  salesEnquirySpec: SalesEnquirySpecDto = {
    page: 1,
    size: 10,
    enqNo: '',
    customername: '',
    status: '',
  };
  pageDto: PageDt = new PageDt();
  salesDto: any = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private enquiryService: SalesService,
    private router: Router,
    private constant: Constants,
    private loginService: LoginService,
    private saleService: SalesService,
    private confirmationAlert: ConfirmationDialogService,
    private alerts: AlertsService,
  ) { }

  openFormModal() {
    const modalRef = this.modalService.open(SalesModalComponent);
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.initForm();
    this.getEnquiryList();
  };

  public initForm() {
    this.salesForm = this.fb.group({
      enqNo: ['', []],
      customername: ['', []],
      status: ['', []]
    })
  }
  public getEnquiryList() {
    this.enquiryService.listSalesEnquiry(this.salesEnquirySpec).subscribe(result => {
      if (result.code === 200) {
        this.pageDto = result.data;
      }
    });
  };

  public delete() {
    if (this.salesDto.length === 1) {
      let id;
      this.salesDto.forEach(element => {
        id = element.id;
      });
      if (this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR || this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER) {
        this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
          .then((confirmed) => {
            if (confirmed) {
              this.saleService.deleteSalesEnquiryById(id).subscribe(res => {
                if (res.code === 200) {
                  this.alerts.setMessage(res.message, 'success');
                  this.getEnquiryList();
                  this.salesDto = [];
                }
              });
            }
          });
      } else {
        this.alerts.setMessage("You are not authorized to delete Enquiry", 'warn');
      }
    } else {
      this.alerts.setMessage("Please Select One Enquiry !", 'warn');
    }
  }

  pageChange(x) {
    this.salesEnquirySpec.page = x;
    this.search();
  };

  search() {
    this.salesEnquirySpec.enqNo = this.f.enqNo.value;
    this.salesEnquirySpec.customername = this.f.customername.value;
    this.salesEnquirySpec.status = this.f.status.value;
    this.getEnquiryList();
  }

  toggeleItem(evnt, enq) {
    if (evnt.currentTarget.checked) {
      this.salesDto.forEach(i => {
        i.checked = false;
      });
      this.salesDto = [];
      enq.checked = true;
      evnt.currentTarget.checked = true;
      this.salesDto.push(enq);
    } else {
      var index = this.salesDto.indexOf(enq);
      this.salesDto.splice(index, 1);
    }
  };

  public clearSearch() {
    this.salesEnquirySpec.page = 1;
    this.salesEnquirySpec.size = 10;
    this.salesForm.controls.enqNo.setValue('');
    this.salesForm.controls.customername.setValue('');
    this.salesForm.controls.status.setValue('');
    this.search();
  }


  editEnquiry() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if (status == this.constant.AUTHORIZED && this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR) {
        this.router.navigate(['/sales/edit/' + id + '/enquiry']);
      } else if (status == this.constant.AUTHORIZED) {
        this.alerts.setMessage("Sale Enquiry Can't Be Edited Once Authorized!", 'warn');
        return;
      } else {
        this.router.navigate(['/sales/edit/' + id + '/enquiry']);
      }
    } else {
      this.alerts.setMessage("Please Select One Enquiry !", 'warn');
    }
  };

  createQuotation() {
    if (this.salesDto.length === 1) {
      let id;
      let status;
      this.salesDto.forEach(element => {
        id = element.id;
        status = element.status;
      });
      if (status == this.constant.AUTHORIZED) {
        this.router.navigate(['/sales/new/' + id + '/quotation']);
      } else {
        this.alerts.setMessage("This Sale Enquiry is not Authorized Can't convert!", 'warn');
        return;
      }
    } else {
      this.alerts.setMessage("Please Select One Enquiry !", 'warn');
    }
  };
  get f() { return this.salesForm.controls; }
}
