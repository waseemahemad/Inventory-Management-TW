import { Injectable } from '@angular/core';
import { Constants } from './commons/constant';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  constructor(
    private constants: Constants,

  ) { }

  public getMasterModules(): any {
    let userAccessDetails = JSON.parse(sessionStorage.getItem('userAccessDetails'));
    let userModules = [];
    userAccessDetails.forEach(e => {
        if(e.masteraccess){
          userModules.push(e.master.name);
          e.useraccessslave.forEach(x =>{
            if(x.authorize === false && x.canDelete === false && x.create === false && x.ctdn === false && x.cti === false && x.cto === false && x.ctq === false && x.date === false && x.edit === false && x.print === false && x.unAuthorize === false && x.view === false ){
              return;
            }else{
              userModules.push(e.master.name+'-'+x.name);
            }
            if(x.authorize===true){
              userModules.push(e.master.name+'-'+x.name+'-authorize');
            }
            if(x.canDelete===true){
              userModules.push(e.master.name+'-'+x.name+'-canDelete');
            }
            if(x.create===true){
              userModules.push(e.master.name+'-'+x.name+'-create');
            }
            if(x.ctdn===true){
              userModules.push(e.master.name+'-'+x.name+'-ctdn');
            }
            if(x.cti===true){
              userModules.push(e.master.name+'-'+x.name+'-cti');
            }
            if(x.cto===true){
              userModules.push(e.master.name+'-'+x.name+'-cto');
            }
            if(x.ctq===true){
              userModules.push(e.master.name+'-'+x.name+'-ctq');
            }
            if(x.date===true){
              userModules.push(e.master.name+'-'+x.name+'-date');
            }
            if(x.edit===true){
              userModules.push(e.master.name+'-'+x.name+'-edit');
            }
            if(x.print===true){
              userModules.push(e.master.name+'-'+x.name+'-print');
            }
            if(x.unAuthorize===true){
              userModules.push(e.master.name+'-'+x.name+'-unAuthorize');
            }
            if(x.view===true){
              userModules.push(e.master.name+'-'+x.name+'-view');
            }
          })
        }
    });
    return userModules;
  }
  

}
