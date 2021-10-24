import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from '../../services/admin-panel.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactsService } from '../../services/contacts.service';
import { CscService } from '../../services/csc.service';
import { Router } from '@angular/router';
import { CompanyDto } from '../../model/companyDto';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css']
})
export class CreateOrganizationComponent implements OnInit {
  countries : Array<any> = [];
  states : Array<any> = [];
  cities : Array<any> = [];
  createCompanyForm : FormGroup;
  compDto : CompanyDto;

  constructor(
    private admServ : AdminPanelService,
    private fb : FormBuilder,
    private contactService : ContactsService,
    private cscService : CscService,
    private router : Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.initCsc();
  }

  public initForm(){
    this.createCompanyForm = this.fb.group({
      id : [null,[]],
      name : ['',[]],
      email : ['',[]],
      website : ['',[]],
      address : ['',[]],
      street : ['',[]],
      zipCode : ['',[]],
      phoneNo : ['',[]],
      mobileNo : ['',[]],
      fax : ['',[]],
      currency : ['',[]],
      trnno : ['',[]],
      cityId : ['',[]],
      cityName : ['',[]],
      stateId : ['',[]],
      stateName : ['',[]],
      countryId : ['',[]],
      countryName : ['',[]],
    });
  }

  getCountries(){
    this.cscService.getCountries().subscribe(result => {
      this.countries = result.data;
    });
  }

  initCsc(){
    this.states = [];
    this.cities = [];
    this.getCountries();
    this.fc.countryId.valueChanges.subscribe(val => {
      this.fc.stateId.setValue('');
      this.fc.cityId.setValue('');
      if ( val ) {
        this.cscService.getStates(val).subscribe(result => {
          this.states = result.data;
        });
      }
    });

    this.fc.stateId.valueChanges.subscribe(val => {
      this.fc.cityId.setValue('');
      if ( val ) {
        this.cscService.getCities(val).subscribe(result => {
          this.cities = result.data;
        });
      }
    });
  }

  get fc(){return this.createCompanyForm.controls;}

  public createCompany(){
    this.makeData();
    this.admServ.createCompany(this.compDto).subscribe(res=>{
      if(res.code===201){
        alert(res.message);
        this.router.navigate(['/list/user']);
      }
    });
  }

  public makeData(){
    this.compDto = {
      id : this.fc.id.value,
      name : this.fc.name.value,
      email : this.fc.email.value,
      website : this.fc.website.value,
      address : this.fc.address.value,
      street : this.fc.street.value,
      zipCode : this.fc.zipCode.value,
      phoneNo : this.fc.phoneNo.value,
      mobileNo : this.fc.mobileNo.value,
      fax : this.fc.fax.value,
      currency : this.fc.currency.value,
      trnno : this.fc.trnno.value,
      city : {id:this.fc.cityId.value,name:''},
      state : {id:this.fc.stateId.value,name:''},
      country : {id:this.fc.countryId.value,name:''}
    }
  }
}
