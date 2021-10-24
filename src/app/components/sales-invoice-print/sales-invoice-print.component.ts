import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FormsModule } from '@angular/forms'
import { SalesInvoiceItemDto } from '../../model/invoiceItemDto';
import { SaleInvoicePrintDto } from '../../model/saleinvoiceprintDto';
import { CommonService } from '../../services/common.service';
import { AdminPanelService } from '../../services/admin-panel.service';


@Component({
  selector: 'app-sales-invoice-print',
  templateUrl: './sales-invoice-print.component.html',
  styleUrls: ['./sales-invoice-print.component.css']
})
export class SalesInvoicePrintComponent implements OnInit {

  salesDto: any = {};
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
    this.invoiceService.getSalesInvoiceById(id).subscribe(result => {
      if (result.code === 200) {
        this.salesDto = result.data;
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
  }
 
}
