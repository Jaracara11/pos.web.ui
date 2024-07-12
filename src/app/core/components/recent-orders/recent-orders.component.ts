import { Component } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RecentOrder } from '../../../shared/interfaces/recent-order.interface';
import { OrderService } from '../../services/order.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { CacheService } from '../../services/cache.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent {
  private destroy$ = new Subject<void>();
  recentOrders: RecentOrder[] = [];

  constructor(private orderService: OrderService,
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loadRecentOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecentOrders(): void {
    const cacheKey = 'orders';
    const fallbackObservable: Observable<RecentOrder[]> = this.orderService.getRecentOrders();

    this.cacheService.cacheObservable(cacheKey, fallbackObservable)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: RecentOrder[]) => {
          this.recentOrders = response;
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(error.statusText, error?.error?.message, 'error');
        }
      });
  }
}
