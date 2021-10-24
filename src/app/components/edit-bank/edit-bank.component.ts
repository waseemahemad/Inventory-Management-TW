import { Component, OnInit } from '@angular/core';
import { BankService } from '../../services/bank.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankDto } from '../../model/bankDto';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.css']
})
export class EditBankComponent implements OnInit {
  bankDto : BankDto;
  bankForm : FormGroup;
  submitted : boolean = false;
  constructor(
    private bnkServ : BankService,
    private fb : FormBuilder,
    private router : Router,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.initForm();
    let id = localStorage.getItem('bankId');
    this.getBankDetails(id);
  }

  public initForm(){
    this.bankForm = this.fb.group({
      id : [null,[]],
      bankName : ['',[Validators.required]],
      bankCode : ['',[Validators.required]],
      bankExtNo : ['',[]]
    });
  }

  public getBankDetails(id){
    this.bnkServ.getBankById(id).subscribe(res=>{
      if(res.code===200){
        this.fc.bankName.setValue(res.data.bankName);
        this.fc.id.setValue(res.data.id);
        this.fc.bankCode.setValue(res.data.bankCode);
        this.fc.bankExtNo.setValue(res.data.bankExtNo);
      }
    });
  }
  public createNewBank(){
    this.submitted = true;
    this.assemble();
    if(this.submitted && this.bankForm.valid){
      this.bnkServ.createBank(this.bankDto).subscribe(res=>{
        if(res.code===201){
          this.alerts.setMessage(res.message,'success');
          this.router.navigate(['/list/bank']);
        }
      },error=>{
        this.alerts.setMessage(error.error.message,'warn');
      });
    }
  }

  public assemble(){
    this.bankDto={
      id : this.fc.id.value,
      bankName : this.fc.bankName.value,
      bankCode : this.fc.bankCode.value,
      ifscCode : '',
      micrCode : '',
      zipCode : '',
      address : '',
      bankExtNo : this.fc.bankExtNo.value,
    }
  }

  get fc(){return this.bankForm.controls;}

}
