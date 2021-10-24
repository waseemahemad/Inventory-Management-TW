import { Component, OnInit } from '@angular/core';
import {Router}  from '@angular/router';
import { AlertsService } from 'angular-alert-module';
import { LoadingService } from '../../services/loading.service';
import { AdminPanelService } from '../../services/admin-panel.service';


@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})

export class ListUserComponent implements OnInit {
  listSpec = {
    page: 1,
    size: 10
  };
  userList : any;
  userDtoList : any =[];
  userId : any;
  totalCount : any;
  
    constructor(
      private router: Router,
      private alerts: AlertsService,
      private loading: LoadingService,
      private aps : AdminPanelService
      ) { }

  ngOnInit() {
    //this.loading.loader.next(true);
    this.getUserList();
  }

  public getUserList(){
    this.aps.getUserList(this.listSpec).subscribe(result => {
      this.userList = result.data.data;
      this.totalCount = result.data.totalCount;
      //this.loading.loader.next(false);
    }, error => {
      console.log(error);
    });
  }
  //  toggeleItem(evnt,user){
  //   if(evnt.currentTarget.checked){
  //     this.userDtoList.push(user);
  //   }else{
  //     var index = this.userDtoList.indexOf(user);
  //     this.userDtoList.splice(index, 1);
  //   }  
  // };

  toggeleItem(evnt,user){
    if(evnt.currentTarget.checked){
      this.userDtoList.forEach(i=>{
        i.checked = false;
      });
      this.userDtoList = [];
      user.checked = true;
      evnt.currentTarget.checked = true;
      this.userDtoList.push(user);
    }else{
      var index = this.userDtoList.indexOf(user);
      this.userDtoList.splice(index, 1);
    }  
  };
  editUser() {
    if (this.userDtoList.length === 1) {
      sessionStorage.setItem("euserInfo", JSON.stringify(this.userDtoList));
      this.router.navigate(['edit/user']);
    } else {
      this.alerts.setMessage('Please select one user', 'warn');
    }
  }

  public pageChange(x){    
    this.listSpec.page = x;
    this.getUserList();
  }
  // resetPassword() {
  //   if (this.userDtoList.length === 1) {
  //     sessionStorage.setItem("userInfo", JSON.stringify(this.userDtoList));
  //     this.router.navigate(['user/reset/password']);
  //   } else {
  //     this.alerts.setMessage('Please select only one user', 'warn');
  //   }
  // }
  // deActiveUser() {
  //   if (this.userDtoList.length === 1) {
  //     for (let entry of this.userDtoList) {
  //       this.userId = {
  //         "id": entry.id,
  //         "status": entry.status,
  //         "name": entry.name
  //       }
  //     }
  //     this.confirmationDialogService.confirm('Confirmation Alert', 'Do you really want to ' + (this.userId.status === 'Deactive' ? 'Activate ' : 'Deactivate ') + this.userId.name + '  ?')
  //       .then((confirmed) => {
  //         if (confirmed) {
  //           this.loading.loader.next(true);
  //           this.userService.deActivateUser(this.userId.id).subscribe((pageDto: PageDto) => {
  //             if (pageDto.code === 202) {
  //               this.loading.loader.next(false);
  //               this.alerts.setMessage(pageDto.message, 'success');
  //               this.stateChanged(event, this.userId)
  //               this.ngOnInit();
  //             }
  //           })
  //         }
  //         else {
  //           console.log('User dismissed the dialog');
  //         }
  //       })

  //   }
  //   else {
  //     this.alerts.setMessage('Please select only one user', 'warn');
  //   }
  // }





}
