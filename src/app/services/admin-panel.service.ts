import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseDto } from '../model/ResponseDto';
import { CreateUserDto } from '../model/createUserDto';
import { Config } from '../commons/config';
import { CompanyDto } from '../model/companyDto';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {

  constructor(
    private http : HttpClient,
    private config : Config
  ) { }
//=========================User=====================================================================================================
  public createUser(userDto: CreateUserDto) : Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateUser, userDto);
  }

  public getUserList(data:any) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlGetUserList,data);
  }
  
  public updateUser(data:any) : Observable<ResponseDto>{
    return this.http.post <ResponseDto> (this.config._urlUpdateUser,data);
  }

//======================================Company======================================================================================
  public createCompany(companyDto : CompanyDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto> (this.config._urlCreateCompany,companyDto);
  }

  public listCompany(companySpec : any) : Observable<ResponseDto>{
    return this.http.post <ResponseDto> (this.config._urlListCompany,companySpec);
  }

  public getCompanyById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto> (this.config._urlGetCompanyById+id);
  }
}
