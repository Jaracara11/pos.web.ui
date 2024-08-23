import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RecentOrder } from '../../../shared/interfaces/recent-order.interface';
import { OrderService } from '../../services/order.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent {
  private destroy$ = new Subject<void>();
  recentOrders: RecentOrder[] = [];

  constructor(
    private orderService: OrderService,
    private swalAlertService: SwalAlertService
  ) { }

  ngOnInit(): void {
    this.loadRecentOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecentOrders(): void {
    this.orderService.getRecentOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recentOrders: RecentOrder[]) => {
          this.recentOrders = recentOrders;
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(error.statusText, error.error?.message || 'An error occurred', 'error');
        }
      });
  }
}
