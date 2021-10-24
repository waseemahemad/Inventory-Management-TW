import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public loader:Subject<boolean> = new Subject();

  public employeeTabs:Subject<string> = new Subject();

  constructor() { }
}
