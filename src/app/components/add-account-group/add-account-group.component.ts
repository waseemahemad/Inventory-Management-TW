import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccTypeSpecDto } from 'src/app/model/AccTypeSpecDto';

@Component({
  selector: 'app-add-account-group',
  templateUrl: './add-account-group.component.html',
  styleUrls: ['./add-account-group.component.css']
})
export class AddAccountGroupComponent implements OnInit {
  addGroupForm: FormGroup;
  spec: AccTypeSpecDto = {
    name: '',
    code: '',
    page: 0,
    size: 0
  };
  accTypes: Array<any> = [];
  submitted : boolean = false;
  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private accServ: AccountsService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getAccTypes();
  }

  public getAccTypes() {
    this.accServ.listAccountType(this.spec).subscribe(res => {
      if (res.code === 200) {
        this.accTypes = res.data;
      }
    });
  }

  public initForm() {
    this.addGroupForm = this.fb.group({
      id: [null, []],
      type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      arabicName: ['', []],
      accTypeId: [null,[Validators.required]]
    });
}

  closeModal() {
    this.activeModal.close('Modal Closed');
  }

  public addAccGroup() {
    this.submitted = true;
    if(this.submitted && this.addGroupForm.valid){
      this.accServ.addAccountGrp(this.makeData()).subscribe(res => {
        this.submitted = false;
        if (res.code === 201) {
          alert(res.message);
          this.activeModal.dismiss('Account Group Created');
        }
      });
    }
  }

  public makeData() {
    return {
      type: this.addGroupForm.controls.type.value,
      name: this.addGroupForm.controls.name.value,
      code: this.addGroupForm.controls.code.value,
      arabicName: this.addGroupForm.controls.arabicName.value,
      accTypeId : this.addGroupForm.controls.accTypeId.value
    }
  }

  public getType(id){
    for (var i=0; i < this.accTypes.length; i++) {
        if (this.accTypes[i].id === id) {
            return this.accTypes[i].name;
        }
    }
}

setType(evnt){
  this.addGroupForm.controls.type.setValue(this.getType(Number(evnt.currentTarget.value)));
}

get fc(){return this.addGroupForm.controls;}
}
