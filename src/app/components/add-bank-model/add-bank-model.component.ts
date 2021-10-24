import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BankService } from '../../services/bank.service';
import { BankDto } from '../../model/bankDto';
import { NewPaymentBankComponent } from '../new-payment-bank/new-payment-bank.component';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-add-bank-model',
  templateUrl: './add-bank-model.component.html',
  styleUrls: ['./add-bank-model.component.css']
})
export class AddBankModelComponent {
  bankDto: BankDto;
  bankForm: FormGroup;
  submitted : boolean = false;

  constructor(
    private bnkServ: BankService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  public initForm() {
    this.bankForm = this.fb.group({
      id: [null, []],
      bankName: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      bankExtNo: ['', []]
    });
  }

  public createNewBank() {
    this.assemble();
    this.submitted = true;
    if(this.submitted && this.bankForm.valid){
      this.bnkServ.createBank(this.bankDto).subscribe(res => {
        if (res.code === 201) {
          this.alerts.setMessage(res.message,'success');
          this.activeModal.dismiss('Bank Added');
        }
      },error=>{
        alert(error.error.message);
      });
    }
  }

  public assemble() {
    this.bankDto = {
      id: null,
      bankName: this.fc.bankName.value,
      bankCode: this.fc.bankCode.value,
      ifscCode: '',
      micrCode: '',
      zipCode: '',
      address: '',
      bankExtNo: this.fc.bankExtNo.value,
    }
  }

  get fc() { return this.bankForm.controls; }


}























