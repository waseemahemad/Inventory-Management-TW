import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import {Config} from '../commons/config';
import {ResponseDto } from '../model/responseDto';

@Injectable({
  providedIn: 'root'
})
export class CscService {

  constructor(private http : HttpClient, private config : Config) { }

  public getCountries(): Observable<ResponseDto>  {
    return this.http.get<ResponseDto>(this.config._urlGetCountries);
  }

  public getStates(countryId : string): Observable<ResponseDto>  {
    return this.http.get<ResponseDto>(this.config._urlGetStates + countryId);
  }

  public getCities(stateId : string): Observable<ResponseDto>  {
    return this.http.get<ResponseDto>(this.config._urlGetCities + stateId);
  }
}
