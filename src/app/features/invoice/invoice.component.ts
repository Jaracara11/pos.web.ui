import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';
import { OrderService } from '../../core/services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { OrderProduct } from '../../shared/interfaces/order-product.interface';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  private destroy$ = new Subject<void>();
  orderInfo: OrderInfo | null = null;

  constructor(private route: ActivatedRoute,
    private swalAlertService: SwalAlertService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrderInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateOrderTotal(index: number, productList: OrderProduct[]): number {
    return productList
      .slice(0, index + 1)
      .reduce((total, item) => total + (item.productPrice || 0) * (item.productQuantity || 1), 0)
  }

  private loadOrderInfo(): void {
    const orderId = this.route.snapshot.paramMap.get('orderID');

    if (!orderId) { return; }

    this.orderService.getOrderByID(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OrderInfo) => {
          this.orderInfo = this.parseOrderInfo(response);
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(
            error.statusText,
            error.error.message,
            'error'
          );
        }
      });
  }

  private parseOrderInfo(orderData: OrderInfo): OrderInfo {
    if (typeof orderData.products === 'string') {
      orderData.products = JSON.parse(orderData.products).map((product: any) => ({
        productName: product.ProductName,
        productDescription: product.ProductDescription,
        productQuantity: product.ProductQuantity,
        productPrice: product.ProductPrice,
        productCategory: product.ProductCategoryName
      }));
    }
    return orderData;
  }
}