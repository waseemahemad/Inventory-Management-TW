import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { CscService } from '../../services/csc.service';
import { ContactDto } from '../../model/contactDto';
import { AddressDto } from '../../model/addressDto';
import { ContactPersonDto } from '../../model/contactPersonDto';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-contacts',
  templateUrl: './new-contacts.component.html',
  styleUrls: ['./new-contacts.component.css']
})
export class NewContactsComponent implements OnInit {
  newContactForm: FormGroup;
  countries: Array<any> = [];
  states: Array<any> = [];
  cities: Array<any> = [];
  contactPersons: Array<ContactPersonDto> = [];
  data: ContactDto;
  address: AddressDto;
  isEditing: boolean = false;
  submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private contactService: ContactsService,
    private cscService: CscService,
    private alerts: AlertsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.initCsc();
  }

  public initForm() {
    this.newContactForm = this.fb.group({
      id: [null, []],
      type: ['', [Validators.required]],
      salutation: ['', []],
      firstName: ['', [Validators.required]],
      lastName: ['', []],
      companyName: ['', [Validators.required]],
      displayName: ['', []],
      email: ['', []],
      phoneNo: ['', []],
      website: ['', []],
      remark: ['', []],
      currency: ['', []],
      trnno: ['', [Validators.required]],
      paymentTerms: ['', []],
      addid: [null, []],
      addtype: ['', []],
      addattension: ['', []],
      addaddress: ['', []],
      addstreet: ['', []],
      addzipCode: ['', []],
      addphoneNo: ['', []],
      addfax: ['', []],
      addcityId: ['', []],
      addstateId: ['', []],
      addcountryId: ['', []],
      cpid: [null, []],
      cpsalutation: ['', []],
      cpfirstName: ['', []],
      cplastName: ['', []],
      cpemail: ['', []],
      cpphoneNo: ['', []],
      cpmobileNo: ['', []],
    });
  }
  getCountries() {
    this.cscService.getCountries().subscribe(result => {
      this.countries = result.data;
    });
  }

  initCsc() {
    this.states = [];
    this.cities = [];
    this.getCountries();
    this.fc.addcountryId.valueChanges.subscribe(val => {
      this.fc.addstateId.setValue('');
      this.fc.addcityId.setValue('');
      if (val) {
        this.cscService.getStates(val).subscribe(result => {
          this.states = result.data;
        });
      }
    });

    this.fc.addstateId.valueChanges.subscribe(val => {
      this.fc.addcityId.setValue('');
      if (val) {
        this.cscService.getCities(val).subscribe(result => {
          this.cities = result.data;
        });
      }
    });
  }

  public createContact() {
    this.submitted = true;
    this.makeData();
    if (this.submitted && this.newContactForm.valid) {
      this.contactService.createContact(this.data).subscribe(res => {
        this.submitted = false;
        if (res.code === 201) {
          this.alerts.setMessage(res.message, 'success');
          this.router.navigate(['/contacts/list']);
        }
      },
        e => {
          this.alerts.setMessage(e.error.message, 'error');
        });
    }
  }

  public addContactPerson() {

    this.contactPersons.push({
      id: this.fc.cpid.value,
      salutation: this.fc.cpsalutation.value,
      firstName: this.fc.cpfirstName.value,
      lastName: this.fc.cplastName.value,
      email: this.fc.cpemail.value,
      phoneNo: this.fc.cpphoneNo.value,
      mobileNo: this.fc.cpmobileNo.value
    });
    this.isEditing = false;
    this.resetContactPersons();
  }

  public resetContactPersons() {
    this.fc.cpsalutation.setValue('');
    this.fc.cpfirstName.setValue('');
    this.fc.cplastName.setValue('');
    this.fc.cpemail.setValue('');
    this.fc.cpphoneNo.setValue('');
    this.fc.cpmobileNo.setValue('');
  }

  delete(cp) {
    var index = this.contactPersons.indexOf(cp);
    this.contactPersons.splice(index, 1);
    console.log("delete Item ", index);
  };

  edit(cp) {
    this.isEditing = true;
    this.fc.cpsalutation.setValue(cp.salutation);
    this.fc.cpfirstName.setValue(cp.firstName);
    this.fc.cplastName.setValue(cp.lastName);
    this.fc.cpemail.setValue(cp.email);
    this.fc.cpphoneNo.setValue(cp.phoneNo);
    this.fc.cpmobileNo.setValue(cp.mobileNo);
    var index = this.contactPersons.indexOf(cp);
    this.contactPersons.splice(index, 1);
  }

  makeData() {
    this.data = {
      id: null,
      type: this.fc.type.value,
      salutation: this.fc.salutation.value,
      firstName: this.fc.firstName.value,
      lastName: this.fc.lastName.value,
      companyName: this.fc.companyName.value,
      displayName: this.fc.displayName.value,
      email: this.fc.email.value,
      phoneNo: this.fc.phoneNo.value,
      website: this.fc.website.value,
      remark: this.fc.remark.value,
      currency: this.fc.currency.value,
      trnno: this.fc.trnno.value,
      paymentTerms: this.fc.paymentTerms.value,
      address: [{
        id: null,
        type: this.fc.addtype.value,
        attension: this.fc.addattension.value,
        address: this.fc.addaddress.value,
        street: this.fc.addstreet.value,
        zipCode: this.fc.addzipCode.value,
        phoneNo: this.fc.addphoneNo.value,
        fax: this.fc.addfax.value,
        city: { id: this.fc.addcityId.value, name: '' },
        state: { id: this.fc.addstateId.value, name: '' },
        country: { id: this.fc.addcountryId.value, name: '' },

      }],
      contactPerson: this.contactPersons
    };
  }
  get fc() {
    return this.newContactForm.controls;
  }

  public reset() {
    this.fc.type.setValue('');
    this.fc.salutation.setValue('');
    this.fc.firstName.setValue('');
    this.fc.lastName.setValue('');
    this.fc.companyName.setValue('');
    this.fc.displayName.setValue('');
    this.fc.email.setValue('');
    this.fc.phoneNo.setValue('');
    this.fc.website.setValue('');
    this.fc.remark.setValue('');
    this.fc.currency.setValue('');
    this.fc.trnno.setValue('');
    this.fc.paymentTerms.setValue('');
    this.fc.addid.setValue(null);
    this.fc.addtype.setValue('');
    this.fc.addattension.setValue('');
    this.fc.addaddress.setValue('');
    this.fc.addstreet.setValue('');
    this.fc.addzipCode.setValue('');
    this.fc.addphoneNo.setValue('');
    this.fc.addfax.setValue('');
    this.fc.addcityId.setValue(null);
    this.fc.addstateId.setValue(null);
    this.fc.addcountryId.setValue(null);
    this.fc.cpid.setValue(null);
    this.fc.cpsalutation.setValue('');
    this.fc.cpfirstName.setValue('');
    this.fc.cplastName.setValue('');
    this.fc.cpemail.setValue('');
    this.fc.cpphoneNo.setValue('');
    this.fc.cpmobileNo.setValue('');
  }

}
