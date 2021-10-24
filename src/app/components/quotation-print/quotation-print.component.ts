import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { CommonService } from '../../services/common.service';
import { AdminPanelService } from '../../services/admin-panel.service';

@Component({
  selector: 'app-quotation-print',
  templateUrl: './quotation-print.component.html',
  styleUrls: ['./quotation-print.component.css']
})
export class QuotationPrintComponent implements OnInit {

  printDto: any = {};
  contacts: any = {};
  user: any = {};
  amount : any;
  trnNo :any;

  constructor(private invoiceService: SalesService,
    private activatedRoute: ActivatedRoute,
     private commonService : CommonService,
    private orgService : AdminPanelService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.getInv(id);
    this.getOrg();
  }

  public getInv(id) {
    this.invoiceService.printSalesQuotationById(id).subscribe(result => {
      if (result.code === 200) {
        this.printDto = result.data; 
        this.contacts = result.data.contacts;
        this.user = result.data.user;
        this.amount = this.commonService.convertNumberToWords(result.data.netAmt);
      }
    })
  };
  public getOrg(){
    this.orgService.listCompany({name:"",email:""}).subscribe(res=>{
      if(res.code===200){
        this.trnNo=res.data[0].trnno;
      }
    });
  };

  public print(){
    window.print();
  }
 
}
