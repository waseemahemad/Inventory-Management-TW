import { Injectable } from '@angular/core';
import { Config } from '../commons/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../model/ResponseDto';
import { CreditNoteDto } from '../model/creditNoteDto';
import { CreditNoteSpecDto } from '../model/creditNoteSpecDto';
import { DebitNoteDto } from '../model/debitNoteDto';
import { DebitNoteSpecDto } from '../model/debitNoteSpecDto';


@Injectable({
  providedIn: 'root'
})
export class JournalService {

  constructor(
    private config : Config,
    private http : HttpClient
  ) { }

//=====================================================journal---creditNote=============================================================
    public addCreditNote(creditNoteDto : CreditNoteDto) : Observable<ResponseDto>{
      return this.http.post<ResponseDto>(this.config._urlAddCreditNote,creditNoteDto);
    }
    public getCreditNoteById(id : any) : Observable<ResponseDto>{
      return this.http.get<ResponseDto>(this.config._urlGetCreditNoteByID+id);
    }
    public deleteCreditNoteById(id : any) : Observable<ResponseDto>{
      return this.http.get<ResponseDto>(this.config._urlDeleteCreditNoteById+id);
    }
    public listCreditNote(creditNoteSpecDto : CreditNoteSpecDto) : Observable<ResponseDto>{
      return this.http.post<ResponseDto>(this.config._urlListCreditNote,creditNoteSpecDto);
    }
//=====================================================journal---debitNote=============================================================
public addDebitNote(debitNoteDto : DebitNoteDto) : Observable<ResponseDto>{
  return this.http.post<ResponseDto>(this.config._urlAddDebitNote,debitNoteDto);
}
public getDebitNoteById(id : any) : Observable<ResponseDto>{
  return this.http.get<ResponseDto>(this.config._urlGetDebitNoteById+id);
}
public deleteDebitNoteById(id : any) : Observable<ResponseDto>{
  return this.http.get<ResponseDto>(this.config._urlDeleteDebitNoteById+id);
}
public listDebitNote(debitNoteSpecDto : DebitNoteSpecDto) : Observable<ResponseDto>{
  return this.http.post<ResponseDto>(this.config._urlListDebitNote,debitNoteSpecDto);
}
}
