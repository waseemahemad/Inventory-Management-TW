import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { Config } from '../commons/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountGroupSpecDto } from '../model/accountGroupSpecDto';
import { AccountSubDto } from '../model/AccountSubDto';
import { AccountSubSpecDto } from '../model/AccSubSpecDto';
import { AccMasterListSpecDto } from '../model/AccMasterListSpecDto';
import { AccTypeSpecDto } from '../model/AccTypeSpecDto';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(
    private http: HttpClient,
    private config: Config
  ) { }

  public listAccGroup(spec: AccountGroupSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlGetAccountsGroup, spec);
  }

  public createSubAccount(dto: AccountSubDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlCreateSubAccount, dto);
  }

  public getCategories(dto: AccountSubSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlGetCategory, dto);
  }

  public listAccounts(dto: AccMasterListSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlListAccounts, dto);
  }

  public getSubAccById(id: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(this.config._urlEditSubAcc+id);
  }

  public addAccountType(data:any):Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlAddAccType,data);
  }

  public editAccountType(id:any):Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlEditAccType+id);
  }

  public listAccountType(spec:AccTypeSpecDto):Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlListAccType,spec);
  }

  public addAccountGrp(data:any):Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlAddAccGrp,data);
  }
  public listAccountGrp(spec:AccTypeSpecDto):Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlListAccGrp,spec);
  }
  public EditAccountGrp(id:any):Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlEditAccGrp+id);
  }

  public forAccountsMasterLIst(dto: AccMasterListSpecDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(this.config._urlForAccMasterPageList, dto);
  }
}
