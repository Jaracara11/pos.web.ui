import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable, Subject, takeUntil } from 'rxjs';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';
import { OrderService } from '../../core/services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { OrderProduct } from '../../shared/interfaces/order-product.interface';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';
import { CacheService } from '../../core/services/cache.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  private destroy$ = new Subject<void>();
  orderInfo: OrderInfo | null = null;
  orderId: string | null = '';
  recentOrders: RecentOrder[] = [];

  constructor(private route: ActivatedRoute,
    private swalAlertService: SwalAlertService,
    private orderService: OrderService,
    private router: Router,
    private cacheService: CacheService) { }

  ngOnInit() {
    this.loadOrderInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancelOrder(): void {
    const confirmTitle = 'Are you sure you want to cancel this order?';

    this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning')
      .then((isConfirmed: boolean) => {
        if (isConfirmed && this.orderId) {
          this.orderService.cancelOrder(this.orderId).pipe(
            finalize(() => {
              this.swalAlertService.swalMessageAlert('Order cancelled successfully', 'info')
                .then(() => this.router.navigateByUrl('/'))
            })
          ).subscribe({
            next: () => { },
            error: (error: HttpErrorResponse) => {
              this.swalAlertService.swalAlertWithTitle(error.statusText, error?.error?.message, 'error');
            }
          })
        }
      })
  }

  printInvoice(): void {
    window.print();
  }

  calculateOrderTotal(index: number, productList: OrderProduct[]): number {
    return productList.slice(0, index + 1).reduce((total, item) =>
      total + (item.productPrice || 0) * (item.productQuantity || 1), 0)
  }

  private loadOrderInfo(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderID');

    if (!this.orderId) { return; }

    this.orderService.getOrderByID(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OrderInfo) => {
          this.orderInfo = this.parseOrderInfo(response);
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(error.statusText, error?.error?.message, 'error');
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