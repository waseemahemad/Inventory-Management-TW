import { Component, OnInit } from '@angular/core';
import { BankService } from '../../services/bank.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankDto } from '../../model/bankDto';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.css']
})
export class NewBankComponent implements OnInit {
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
  }

  public initForm(){
    this.bankForm = this.fb.group({
      id : [null,[]],
      bankName : ['',[Validators.required]],
      bankCode : ['',[Validators.required]],
      bankExtNo : ['',[]]
    });
  }

  public createNewBank(){
    this.submitted = true;
    this.assemble();
    if(this.submitted && this.bankForm.valid){
      this.bnkServ.createBank(this.bankDto).subscribe(res=>{
        this.submitted = false;
        if(res.code===201){
          this.alerts.setMessage(res.message,'success');
          this.router.navigate(['/list/bank']);
        }
      },error=>{
        this.alerts.setMessage(error.error.message,'error');
      });
    }
  }

  public assemble(){
    this.bankDto={
      id : null,
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
