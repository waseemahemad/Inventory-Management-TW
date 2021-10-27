import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPurchaseInvoiceComponent } from './return-purchase-invoice.component';

describe('ReturnPurchaseInvoiceComponent', () => {
  let component: ReturnPurchaseInvoiceComponent;
  let fixture: ComponentFixture<ReturnPurchaseInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnPurchaseInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPurchaseInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
