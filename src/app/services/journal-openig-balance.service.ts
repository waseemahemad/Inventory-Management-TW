import { Injectable } from '@angular/core';
import { Config } from '../commons/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { OpeningBalanceDto } from '../model/OpeningBalanceDto';
import { OpeningBalanceSpec } from '../model/OpeningBalanceSpec';

@Injectable({
  providedIn: 'root'
})
export class JournalOpenigBalanceService {

  constructor(
    private config : Config,
    private http : HttpClient
  ) { }

  public addOpeningBalance(opBalDto : OpeningBalanceDto) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlAddOpeningBalance,opBalDto);
  }
  public getOpeningBalanceById(id : any) : Observable<ResponseDto>{
    return this.http.get<ResponseDto>(this.config._urlGetOpeningBalanceByID+id);
  }
  public listOpeningBalance(OpnBalSpec : OpeningBalanceSpec) : Observable<ResponseDto>{
    return this.http.post<ResponseDto>(this.config._urlListOpeningBalance,OpnBalSpec);
  }
}
