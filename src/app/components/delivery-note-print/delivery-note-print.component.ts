import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { CommonService } from '../../services/common.service';
import { AdminPanelService } from '../../services/admin-panel.service';

@Component({
  selector: 'app-delivery-note-print',
  templateUrl: './delivery-note-print.component.html',
  styleUrls: ['./delivery-note-print.component.css']
})
export class DeliveryNotePrintComponent implements OnInit {

  printDto: any = {};
  contacts: any = {};
  user: any = {};
  inwords : any;
  trnNo :any;
  totalqty : number=0;
  printDtoItem:Array<any>=[];

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
    this.invoiceService.printDeliveryNoteById(id).subscribe(result => {
      if (result.code === 200) {
        this.printDto = result.data;
        this.printDtoItem =result.data.deliveryNoteItems;
        this.contacts = result.data.contacts;
        this.user = result.data.user;
        
        this.calculateTotal();
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
 
  public calculateTotal(){
    this.printDtoItem.forEach(e =>{
       let tqty = e.qty;
       this.totalqty = this.totalqty +tqty;
    })
    this.inwords = this.commonService.convertNumberToWords( this.totalqty);
  };

}
