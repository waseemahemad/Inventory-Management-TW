import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from "../commons/config";
import { JournalVoucherDto } from '../model/JournalVoucherDto';
import { ResponseDto } from '../model/ResponseDto';
import { Observable } from '../../../node_modules/rxjs';
import { JournalVoucherSpecDto } from '../model/journalVoucherSpecDto';

@Injectable({
  providedIn: 'root'
})
export class JournalvoucherService {

  constructor(
    private http:HttpClient,
    private config : Config) { }


    public createJournalVoucher(jvdto : JournalVoucherDto) : Observable<ResponseDto>{
      return this.http.post <ResponseDto>(this.config._urladdjournalvoucher,jvdto);
    }

    public listJournalEntries(jvspec : JournalVoucherSpecDto) : Observable<ResponseDto>{
      return this.http.post <ResponseDto>(this.config._urlListJournalVouchers,jvspec);
    }

    public getVoucherById(id:any) : Observable<ResponseDto>{
      return this.http.get <ResponseDto>(this.config._urlGetJournalVoucherById+id);
    }
}
