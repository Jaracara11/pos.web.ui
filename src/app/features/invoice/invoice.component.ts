import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';
import { OrderService } from '../../core/services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [AsyncPipe],
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

  private loadOrderInfo(): void {
    const orderId = this.route.snapshot.paramMap.get('orderID');

    if (!orderId) { return; }

    this.orderService.getOrderByID(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: OrderInfo) => {
          this.orderInfo = response;
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
}