import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  orderID = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.getOrderID();
  }

  private getOrderID(): void {
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('orderID');
      if (orderId) { this.orderID = orderId; }
    });
  }
}
