
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserDetails } from '../model/user-details';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor{

	constructor() {}

  	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    	var authToken : string = this.getAuthToken();
    	if(authToken){
    		request = request.clone({
	      		setHeaders: {
		        	Authorization : this.getAuthToken()
		      	}
		    });
    	}
    		
	    return next.handle(request);
	}

	public getAuthToken() : string {
	    let userDetails : UserDetails = JSON.parse(sessionStorage.getItem('userDetails'));
	    return userDetails ? userDetails.authToken : null;
	}
}
