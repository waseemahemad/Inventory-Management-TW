import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '../../../../node_modules/@angular/forms';
import { ContactSpecDto } from '../../model/contactSpecDto';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  listOfContacts: any = [];
  contactType: any = '';
  totalCount: any = null;
  name : any='';
  searchForm : FormGroup;

  contactSpec : ContactSpecDto ={
    contactname: '',
    companyName: '',
    displayName: '',
    email: '',
    type: '',
    page: 1,
    size: 10
  }
  constructor(
    private contactService: ContactsService,
    private router: Router,
    private fb : FormBuilder
  ) { }

  ngOnInit() {
    this.getContactsList();
    this.initForm();
  }
  initForm(){
    this.searchForm = this.fb.group({
      contactType : ['',[]],
      name : ['',[]]
    });
  }
  public search() {
    this.contactSpec.type = this.sf.contactType.value;
    this.contactSpec.companyName =this.sf.name.value;
    this.getContactsList();
  }


  public getContactsList() {
    this.contactService.listContacts(this.contactSpec).subscribe(res => {
      if (res.code === 200) {
        this.listOfContacts = res.data.data;
        this.totalCount = res.data.totalCount;
      }
    });
  }

  public pageChange(x) {
    this.contactSpec.page = x;
    this.search();
  }
  public edit(id) {
    localStorage.setItem("contactId", id);
    this.router.navigate(['/contacts/edit']);
  }
  get sf(){return this.searchForm.controls;
  
  }

  public clearSearch(){
    this.searchForm.controls.name.setValue('');
    this.searchForm.controls.contactType.setValue('');
     this.search();
  }
}
