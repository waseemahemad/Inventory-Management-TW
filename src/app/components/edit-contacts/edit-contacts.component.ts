import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { CscService } from '../../services/csc.service';
import { ContactDto } from '../../model/contactDto';
import { AddressDto } from '../../model/addressDto';
import { ContactPersonDto } from '../../model/contactPersonDto';
import { AlertsService } from 'angular-alert-module';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog-service';

@Component({
  selector: 'app-edit-contacts',
  templateUrl: './edit-contacts.component.html',
  styleUrls: ['./edit-contacts.component.css']
})
export class EditContactsComponent implements OnInit {
  userData: any = {};
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
    private router: Router,
    private confirmationAlert: ConfirmationDialogService
  ) { }

  ngOnInit() {
    this.initForm();
    const id = localStorage.getItem("contactId");
    this.getEditData(id);
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

  public getEditData(id) {
    this.contactService.getContactById(id).subscribe(res => {
      if (res.code === 200) {
        this.userData = res.data;

        this.fc.type.setValue(this.userData.type);
        this.fc.salutation.setValue(this.userData.salutation);
        this.fc.firstName.setValue(this.userData.firstName);
        this.fc.lastName.setValue(this.userData.lastName);
        this.fc.companyName.setValue(this.userData.companyName);
        this.fc.displayName.setValue(this.userData.displayName);
        this.fc.email.setValue(this.userData.email);
        this.fc.phoneNo.setValue(this.userData.phoneNo);
        this.fc.website.setValue(this.userData.website);
        this.fc.remark.setValue(this.userData.remark);
        this.fc.currency.setValue(this.userData.currency);
        this.fc.trnno.setValue(this.userData.trnno);
        this.fc.paymentTerms.setValue(this.userData.paymentTerms);
        this.fc.addtype.setValue(this.userData.address[0].type);
        this.fc.addattension.setValue(this.userData.address[0].attension);
        this.fc.addaddress.setValue(this.userData.address[0].address);
        this.fc.addstreet.setValue(this.userData.address[0].street);
        this.fc.addzipCode.setValue(this.userData.address[0].zipCode);
        this.fc.addphoneNo.setValue(this.userData.address[0].phoneNo);
        this.fc.addfax.setValue(this.userData.address[0].fax);
        this.fc.addcountryId.setValue(this.userData.address[0].country.id);
        this.fc.addstateId.setValue(this.userData.address[0].state.id);
        this.fc.addcityId.setValue(this.userData.address[0].city.id);
        this.contactPersons = this.userData.contactPerson;
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
    // var index = this.contactPersons.indexOf(cp);
    // this.contactPersons.splice(index, 1);
    // console.log("delete Item ",index);
    if (cp.id === null) {
      var index = this.contactPersons.indexOf(cp);
      this.contactPersons.splice(index, 1);
      console.log("delete Item ", index);
    } else {
      this.confirmationAlert.confirm('Confirmation Alert', 'Do you really want to Delete ?')
        .then((confirmed) => {
          if (confirmed) {
            this.contactService.deleteContactPersonById(cp.id).subscribe(result => {
              this.alerts.setMessage(result.message, 'success');
              var index = this.contactPersons.indexOf(cp);
              this.contactPersons.splice(index, 1);
            });

          } else {
            console.log('Dismiss Alert');
          }
        });
    }
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
      id: this.userData.id,
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
        id: this.userData.address[0].id,
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



}
