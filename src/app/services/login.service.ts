import { Injectable } from '@angular/core';
import {NgxPermissionsService} from 'ngx-permissions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import * as _ from 'underscore';
import {Config} from '../commons/config';
import {User} from '../model/user'
import {UserDetails} from '../model/user-details';
import {WebsocketService} from './websocket.service'
import {AppConstants} from '../commons/app-constant'
import { UserAccessService } from '../user-access.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private webSocketService : WebsocketService,
    private ngxService : NgxPermissionsService,
    private http: HttpClient, 
    private config : Config, 
    private router : Router,
    private userAccessService : UserAccessService
    ) { }

  public login(user : User) : Observable<UserDetails> {
		return this.http.post<UserDetails>(this.config._urlLogin, user);
  }

  public signing(userDetails : UserDetails) : void{
    sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.setProfileID(userDetails.document);
    this.setProfileName(userDetails.name);
    sessionStorage.setItem('userAccessDetails',JSON.stringify(userDetails.list));
    this.addPermissionRole();
    //this.connectWebSocket(userDetails.authToken);	    
  }

  public saveUserName(userName){
    sessionStorage.setItem('userName', JSON.stringify(userName));
  }

  public isSignedIn() : boolean {
  	if(sessionStorage.getItem('userDetails')){
  		return true;
  	}
  	return false;
  }

  public setProfileID(document) : void {
    sessionStorage.setItem('profileID', document);   
  }

  public setProfileName(name) : void {
    sessionStorage.setItem('profileName', name);
  }

  public getAuthToken() : string {
    let userDetails : UserDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if(userDetails !=null ){
      return userDetails.authToken;
    }
    return null;
  }

  public getLoggedUserName() : string{
    let name  = sessionStorage.getItem('profileName');
    return name;
  }

  public getLoggedUserID() : number  {
    let userDetails : UserDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    return userDetails.id;
  }

  public getLoggedRole() : string {
    let userDetails : UserDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    let userRole = _.pluck(userDetails.authorities,'authority');
    if(_.contains(userRole,AppConstants._ROLE_ADMIN)){
      return AppConstants._ROLE_ADMIN;
    } else if(_.contains(userRole,AppConstants._ROLE_SA)){
      return AppConstants._ROLE_SA;
    } else if(_.contains(userRole,AppConstants._ROLE_PURCHASE)){
      return AppConstants._ROLE_PURCHASE;
    } else if(_.contains(userRole,AppConstants._ROLE_SALE)){
      return AppConstants._ROLE_SALE;
    } else if(_.contains(userRole,AppConstants._ROLE_EMP)){
      return AppConstants._ROLE_EMP;
    } else if(_.contains(userRole,AppConstants._ROLE_FINANCE)){
      return AppConstants._ROLE_FINANCE;
    } else if(_.contains(userRole,AppConstants._ROLE_OPS)){
      return AppConstants._ROLE_OPS;
    } else if(_.contains(userRole,AppConstants._ROLE_DIRECTOR)){
      return AppConstants._ROLE_DIRECTOR;
    }else if(_.contains(userRole,AppConstants._ROLE_MANAGER)){
      return AppConstants._ROLE_MANAGER;
    }
  }

  public getLoggedUserDetails() : UserDetails {
    let userDetails : UserDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    return userDetails;
  }

  public getLoggedDocument() : string {
    let document = sessionStorage.getItem('profileID');
    return document;
  }

  public signout() : void {
    sessionStorage.removeItem('userDetails');
    sessionStorage.removeItem('userName');
    this.removePermissionRole();
    this.webSocketService.disConnectWebSocket();
    this.router.navigate(['login']);
  };

  public addPermissionRole() : void {
    // let userDetails : UserDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    // if(userDetails != null){      
    //   let roleList : string [] = [];
    //   roleList.push(userDetails.role);
     
    //   this.ngxService.loadPermissions(roleList); 
    // } else {
    //   console.log("PLEASE LOGIN !");
    // }     
    const perm = this.userAccessService.getMasterModules();
    this.ngxService.loadPermissions(perm);
  }

  private connectWebSocket(authToken : any){
    if(authToken !=null){
      console.log("WEBSOCKET CONNECT");
      this.webSocketService.connectWebSocket(authToken);
    } 
  }

  public removePermissionRole(){
    this.ngxService.flushPermissions();
  }
}
