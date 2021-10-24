import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-add-account-type-modal',
  templateUrl: './add-account-type-modal.component.html',
  styleUrls: ['./add-account-type-modal.component.css']
})
export class AddAccountTypeModalComponent implements OnInit {

  addTypeForm : FormGroup;
  submitted : boolean = false;
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private fb : FormBuilder,
    private accServ : AccountsService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(){
    this.addTypeForm = this.fb.group({
        name:['',[Validators.required]],
        code:['',[Validators.required]]
    });
  }

  makeData(){
      return {
        name : this.fc.name.value,
        code : this.fc.code.value
      }    
  }
  public addType(){
    this.submitted = true;
    if(this.submitted && this.addTypeForm.valid){
      this.accServ.addAccountType(this.makeData()).subscribe(res=>{
        this.submitted = false;
        if(res.code === 201){
          alert(res.message);
          this.activeModal.dismiss('Account Type Added');
        }
      });
    }
  }

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  get fc(){return this.addTypeForm.controls;}

}
