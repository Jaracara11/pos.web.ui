import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';
import { OrderService } from '../../core/services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { OrderProduct } from '../../shared/interfaces/order-product.interface';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  orderInfo: OrderInfo | null = null;
  orderId: string | null = '';
  recentOrders: RecentOrder[] = [];

  constructor(
    private route: ActivatedRoute,
    private swalAlertService: SwalAlertService,
    private orderService: OrderService,
    private router: Router
  ) { }

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
            takeUntil(this.destroy$)
          ).subscribe({
            next: () => {
              this.swalAlertService.swalMessageAlert('Order cancelled successfully', 'info');
            },
            error: (error: HttpErrorResponse) => {
              this.swalAlertService.swalValidationErrorAlert(error);
            }
          });
        }
      });
  }

  printInvoice(): void {
    window.print();
  }

  formatOrderID(orderID: string): string {
    const formattedOrderID = orderID.split('-');
    return formattedOrderID[formattedOrderID.length - 1];
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
          this.swalAlertService.swalValidationErrorAlert(error);
        }
      });
  }

  private parseOrderInfo(orderData: OrderInfo): OrderInfo {
    if (typeof orderData.products === 'string') {
      try {
        const parsedProducts: OrderProduct[] = JSON.parse(orderData.products).map((product: {
          ProductName: string;
          ProductDescription: string;
          ProductQuantity: number;
          ProductPrice: number;
        }) => ({
          productName: product.ProductName,
          productDescription: product.ProductDescription,
          productQuantity: product.ProductQuantity,
          productPrice: product.ProductPrice
        }));

        orderData.products = parsedProducts;
      } catch {
        this.swalAlertService.swalAlertWithTitle('Parsing Error', 'Failed to load products for the order', 'error');
      }
    }
    return orderData;
  }
}