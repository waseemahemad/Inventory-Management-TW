import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactDto } from '../model/contactDto';
import { ResponseDto } from '../model/ResponseDto';
import { Config } from '../commons/config';
import { ContactSpecDto } from '../model/contactSpecDto';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(
    private http : HttpClient,
    private config : Config

  ) { }

  public createContact(contactDto : ContactDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto> (this.config._urlCreateContact,contactDto);
  }

  public listContacts(contactSpecDto : ContactSpecDto) : Observable<ResponseDto>{
    return this.http.post <ResponseDto> (this.config._urlListContacts,contactSpecDto);
  }

  public getContactById(id : any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto> (this.config._urlGetContactById+id);
  }

  public deleteContactPersonById(id:any) : Observable<ResponseDto>{
    return this.http.get <ResponseDto> (this.config._urlDeleteContactPersonById+id);
  }
}
