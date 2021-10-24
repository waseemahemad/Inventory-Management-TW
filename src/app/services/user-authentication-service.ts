import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { AppConstants } from '../commons/app-constant';

@Injectable()
export class UserAuthenticationService {
  
  dashBoard : string;
  constructor(
    private router : Router,
    private loginService : LoginService
    ) { }

  public loginSuccess() : void { 
    this.router.navigate([this.getDashBoardURL()]);    
  }

  roleAdmin(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_ADMIN;
  }
  roleFINANCE(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_FINANCE;
  }
  roleSA(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_SA;
  }
  roleOPS(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_OPS;
  }
  roleSALE(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_SALE;
  }
  rolePURCHASE(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_PURCHASE;
  }
  roleEMP(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_EMP;
  }
  roleManager(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_MANAGER;
  }
  roleDirector(){
    return this.loginService.getLoggedRole() === AppConstants._ROLE_DIRECTOR;
  }

  getDashBoardURL(){
    if(this.roleAdmin() || this.roleSA() || this.roleOPS()){      
      return "list/user";   
    }else if (this.roleEMP() || this.roleManager || this.roleDirector){
      return "welcome";
    }else if(this.roleFINANCE()){
      return "";
    }
  }

}
