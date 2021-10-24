import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationPrintComponent } from './quotation-print.component';

describe('QuotationPrintComponent', () => {
  let component: QuotationPrintComponent;
  let fixture: ComponentFixture<QuotationPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
