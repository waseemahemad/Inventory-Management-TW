import { Component, OnInit } from '@angular/core';
import { ModuleManagementService } from 'src/app/module-management.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/commons/constant';
import { LoginService } from 'src/app/services/login.service';
import { AlertsService } from 'angular-alert-module';
import { AppConstants } from 'src/app/commons/app-constant';

@Component({
  selector: 'app-admin-master-sub-module',
  templateUrl: './admin-master-sub-module.component.html',
  styleUrls: ['./admin-master-sub-module.component.css']
})
export class AdminMasterSubModuleComponent implements OnInit {

  constructor(
    private mmServ : ModuleManagementService,
    private constant : Constants,
    private loginService : LoginService,
    private router : Router,
    private alerts : AlertsService
  ) { }

  list : any = [];
  arrayOfmods : any = [];

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
        this.router.navigate(['admin/'+id+'/edit-sub-master']);
      }else if(status == this.constant.AUTHORIZED){
        this.alerts.setMessage("This Sale Invoice Can't Edit it's an Authorized!",'warn');
        return;
      }
      else{
        this.router.navigate(['admin/'+id+'/edit-sub-master']);
      }
    }else{
      this.alerts.setMessage("Please Select One Module !",'warn');
    }
  };

  public getList(){
      this.mmServ.listSubMasterModules().subscribe(res=>{
        if(res.code === 200){
          this.list = res.data;
        }
      });
  }

}
