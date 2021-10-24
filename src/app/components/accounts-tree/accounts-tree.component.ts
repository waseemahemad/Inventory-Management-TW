import { Component, OnInit, Injector, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { AccountGroupSpecDto } from 'src/app/model/accountGroupSpecDto';
import { AccountsService } from 'src/app/services/accounts.service';
import { AccMasterListSpecDto } from 'src/app/model/AccMasterListSpecDto';

import { Config } from 'src/app/commons/config';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-accounts-tree',
  templateUrl: './accounts-tree.component.html',
  styleUrls: ['./accounts-tree.component.css'],
})
export class AccountsTreeComponent implements OnInit {
  accountList: any;
  spec: AccountGroupSpecDto = {
    name: '',
    code: '',
    type: '',
    page: 0,
    size: 0,
    typeId : null
  };
  listSpec: AccMasterListSpecDto = {
    category: '',
    masterid: null,
    selfid: null,
    name: '',
    code: null,
    page: 1,
    size: 1000,
  };
  list: Array<any> = [];
  temp = '';
  dataSource: any;
  constructor(
    private accountService: AccountsService,
    private config: Config,
    private rd :Renderer2
  ) { 
   
  }

  ngOnInit() {
    this.getAccGroup();
  }

  public getAccGroup() {
    this.accountService.listAccGroup(this.spec).subscribe(res => {
      if (res.code === 200) {
        this.accountList = res.data;
      }
    });
  };

  public getSubAccs(event, masterid) {
    // var iconId;  
    var meId = event.currentTarget.id;
    this.listSpec.masterid = masterid;
    
    if(event.target.id.replace(/[0-9]/g, '') === "limaster"){
      // iconId ="icon-master"+event.target.id.replace(/[^0-9\.]+/g, "");
      // console.log(iconId);
      // document.getElementById(iconId).classList.toggle("zmdi-chevron-down");
      //$("#"+iconId).classList.toggle("zmdi zmdi-chevron-down");
      // $("#"+iconId).removeClass("zmdi zmdi-chevron-right");
      // $("#"+iconId).addClass("zmdi zmdi-chevron-down");
      $("#"+meId+" ul").remove();
      this.listSpec.selfid = 0;
      this.accountService.listAccounts(this.listSpec).subscribe(res => {
        if (res.code === 200) {
          var html = document.getElementById(meId).innerHTML;
          var newHtml='';
          res.data.data.forEach(sitem => {
            if(sitem.category =="Y"){
              newHtml = newHtml + '<ul id='+"ulslave"+sitem.id+'><li style="list-style:none;" id=lislave'+sitem.id+'><i class="zmdi zmdi-chevron-right" style="margin-right:5px; color:#fe967a;"></i>'+ sitem.name +'<span style="float:right;"><span style="display:inline-block; margin-right:300px;"><span style="color:#fe967a; margin-left:5px;">Type: </span><span style="margin-right:20px;">'+sitem.accountType.name+'</span></span><span style="display:inline-block; margin-right:5px; "><span style="color:#fe967a;" >Is Category: </span><span>'+sitem.category+'</span></span></span>'+ '</li></ul>';
            }else{
              newHtml = newHtml + '<ul id='+"ulslave"+sitem.id+'><li style="list-style:none;" id=lislave'+sitem.id+'>' + sitem.name +'<span style="float:right;"><span style="display:inline-block; margin-right:300px;"><span style="color:#fe967a; margin-left:5px;">Type: </span><span style="margin-right:20px;">'+sitem.accountType.name+'</span></span><span style="display:inline-block; margin-right:5px; "><span style="color:#fe967a;" >Is Category: </span><span>'+sitem.category+'</span></span></span>'+ '</li></ul>';
            }
          });
          html +=newHtml;
          document.getElementById(meId).innerHTML=(html);
        }
      });
    }else{
      
      $("#"+event.target.id+" ul").remove();
      this.listSpec.selfid = event.target.id.replace(/[^0-9\.]+/g, "");
      this.accountService.listAccounts(this.listSpec).subscribe(res => {
        if (res.code === 200) {
          var html = document.getElementById(event.target.id).innerHTML;
          var newHtml = '';
          res.data.data.forEach(sitem => {
            if(sitem.category =="Y"){
              // newHtml = newHtml + '<ul id='+"ulslave"+sitem.id+'><li style="list-style:none;" id=lislave'+sitem.id+'><i class="zmdi zmdi-chevron-right" style="margin-right:5px; color:#fe967a;"></i>' +sitem.accountType.name+'</span></span><span style="display:inline-block; margin-right:5px; "><span style="color:#fe967a;" >Is Category: </span><span>'+sitem.category+'</span></span></span>'+ '</li></ul>';
              newHtml = newHtml + '<ul id='+"ulslave"+sitem.id+'><li style="list-style:none;" id=lislave'+sitem.id+'><i class="zmdi zmdi-chevron-right" style="margin-right:5px; color:#fe967a;"></i>'+ sitem.name +'<span style="float:right;"><span style="display:inline-block; margin-right:300px;"><span style="color:#fe967a; margin-left:5px;">Type: </span><span style="margin-right:20px;">'+sitem.accountType.name+'</span></span><span style="display:inline-block; margin-right:5px; "><span style="color:#fe967a;" >Is Category: </span><span>'+sitem.category+'</span></span></span>'+ '</li></ul>';
            }else{
              newHtml = newHtml + '<ul id='+"ulslave"+sitem.id+'><li style="list-style:none;" id=lislave'+sitem.id+'>' + sitem.name +'<span style="float:right;"><span style="display:inline-block; margin-right:300px;"><span style="color:#fe967a; margin-left:10px;">Type: </span><span style="margin-right:10px;">'+sitem.accountType.name+'</span></span><span style="display:inline-block; margin-right:5px; "><span style="color:#fe967a;" >Is Category: </span><span>'+sitem.category+'</span></span></span>'+ '</li></ul>';
            }
          });
          html +=newHtml;
          document.getElementById(event.target.id).innerHTML=(html);
        }
      });
    }
  }
 
}
