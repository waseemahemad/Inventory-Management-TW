import { Injectable } from '@angular/core';
import { Config } from '../commons/config';
import { BankDto } from '../model/bankDto';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { HttpClient } from '@angular/common/http';
import { BankSpecDto } from '../model/bankSpecDto';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(
    private config : Config,
    private http : HttpClient
  ) { }

  public createBank(bankDto : BankDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlCreateBank,bankDto);
  }
  public getBankById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlGetBankById+id);
  }
  public deleteBankById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlDeleteBankById+id);
  }
  public listBanks(bankSpec : BankSpecDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto>(this.config._urlListBanks,bankSpec);
  }
  public getListOfBanksDropDown() : Observable<ResponseDto>{
    return this.http.get <ResponseDto>(this.config._urlGetListOfBanksDropDown);
  }
}
