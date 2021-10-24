import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: '[app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails : any;
  userRole : any;
  constructor(
    private loginService : LoginService
  ) { }

  ngOnInit() {
    this.userDetails = this.loginService.getLoggedUserName();
    this.userRole = this.loginService.getLoggedRole();

  }

  public logout(){
    this.loginService.signout();
  }

  showMe(){
    document.getElementById("menu").style.display = "block";
  }
}
