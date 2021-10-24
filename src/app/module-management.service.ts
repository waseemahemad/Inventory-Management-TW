import { Injectable } from '@angular/core';
import { Config } from './commons/config';
import { addModuleMasterDto } from './model/addModuleMasterDto';
import { Observable } from 'rxjs';
import { ResponseDto } from './model/ResponseDto';
import { HttpClient } from '@angular/common/http';
import { moduleMasterSpecDto } from './model/moduleMasterSpec';
import { createSubModuleDto } from './model/createSubModuleDto';
import { UserAccessDto } from './model/userAccessDto';
import { UserAccessSpecDto } from './model/userAccessSpecDto';

@Injectable({
  providedIn: 'root'
})
export class ModuleManagementService {

  constructor(
    private config : Config,
    private http : HttpClient
  ) { }

  //==============================MASTER MODULE================================
  public addMasterModule(dto:addModuleMasterDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlAddMasterModule,dto);
  }

  public listMasterModules(dto:moduleMasterSpecDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlListMasterModule,dto);
  }

  public getMasterModuleById(id:any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlGetMasterModuleById+id);
  }

  //==============================SUB MASTER MODULE===============================
  public addSubMasterModule(dto:createSubModuleDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlAddSubMasterModule,dto);
  }

  public listSubMasterModules() : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlListSubMasterModule);
  }

  public getSubMasterModuleById(id:any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlGetSubMasterModuleById+id);
  }

  public getSubMasterModuleByMasterId(id:any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlgetSubModulesByMasterId+id);
  }
  //=================================USER ACCESS CONTROLLS===========================
  public assignUserAccess(dto:UserAccessDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlAssignUserAccess,dto);
  }

  public getUserAccessByModuleId(dto:UserAccessSpecDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlGetUserAccessByModuleId,dto);
  }
}
