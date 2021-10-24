import { Component, OnInit } from '@angular/core';
import { ModuleManagementService } from 'src/app/module-management.service';
import { moduleMasterSpecDto } from 'src/app/model/moduleMasterSpec';
import { Constants } from 'src/app/commons/constant';
import { LoginService } from 'src/app/services/login.service';
import { AppConstants } from 'src/app/commons/app-constant';
import { Router } from '@angular/router';
import { AlertsService } from 'angular-alert-module';

@Component({
  selector: 'app-admin-master-module',
  templateUrl: './admin-master-module.component.html',
  styleUrls: ['./admin-master-module.component.css']
})
export class AdminMasterModuleComponent implements OnInit {
  listSpec : moduleMasterSpecDto = {
    page : 1,
    size : 1000,
    name : '',
    code : '',
  };
  list : any = [];
  arrayOfmods : any = [];

  constructor(
    private mmServ : ModuleManagementService,
    private constant : Constants,
    private loginService : LoginService,
    private router : Router,
    private alerts : AlertsService
  ) { }

  ngOnInit() {
    this.getList();
  }

  toggeleItem(evnt,mod){
    if(evnt.currentTarget.checked){
      this.arrayOfmods.forEach(i=>{
        i.checked = false;
      });
      this.arrayOfmods = [];
      mod.checked = true;
      evnt.currentTarget.checked = true;
      this.arrayOfmods.push(mod);
    }else{
      var index = this.arrayOfmods.indexOf(mod);
      this.arrayOfmods.splice(index, 1);
    }  
  };

  edit(){
    if(this.arrayOfmods.length === 1){
      let id;
      let status;
      this.arrayOfmods.forEach(inv => {
        id = inv.id;
        status= inv.status;
      });
      
      if(status == this.constant.AUTHORIZED && this.loginService.getLoggedRole()===AppConstants._ROLE_DIRECTOR){
        this.router.navigate(['admin/'+id+'/edit-master']);
      }else if(status == this.constant.AUTHORIZED){
        this.alerts.setMessage("This Sale Invoice Can't Edit it's an Authorized!",'warn');
        return;
      }
      else{
        this.router.navigate(['admin/'+id+'/edit-master']);
      }
    }else{
      this.alerts.setMessage("Please Select One Module !",'warn');
    }
  };

  public getList(){
      this.mmServ.listMasterModules(this.listSpec).subscribe(res=>{
        if(res.code === 200){
          this.list = res.data;
        }
      });
  }

}
