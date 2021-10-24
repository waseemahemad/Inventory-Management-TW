import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {UserAuthenticationService} from '../../services/user-authentication-service';
import {AppConstants} from '../../commons/app-constant';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserAccessService } from 'src/app/user-access.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [NgbCarouselConfig]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor( private formBuilder: FormBuilder, private loginService : LoginService, private userAuthenticationService: UserAuthenticationService,config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
   }

  ngOnInit() {
      this.loginService.signout();
      this.loginForm = this.formBuilder.group({
          username: ['', [Validators.required]],
          password: ['', [Validators.required, Validators.minLength(5)]]
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.valid) {
        this.loginService.login(this.loginForm.value).subscribe(data => {       
            this.loginService.signing(data);    
            this.loginService.saveUserName(this.loginForm.controls.username.value);
            this.userAuthenticationService.loginSuccess();
          }, error => {
            if(error.status == 401){
              alert(AppConstants._invalidCredentials);
            }else{
              alert(AppConstants._wentWrongContactSupport);
            }
          });
          } else {
              Object.keys(this.loginForm.controls).forEach(field => { // {1}
                  const control = this.loginForm.get(field);            // {2}
                  control.markAsTouched({ onlySelf: true });       // {3}
            });
        }
      }

      
  }


