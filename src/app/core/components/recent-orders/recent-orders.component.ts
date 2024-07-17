import { Component } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RecentOrder } from '../../../shared/interfaces/recent-order.interface';
import { OrderService } from '../../services/order.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { CacheService } from '../../services/cache.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RecentOrdersService } from '../../services/recent-orders.service';
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
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService,
    private recentOrdersService: RecentOrdersService
  ) { }

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
          this.recentOrdersService.setRecentOrders(response);
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(error.statusText, error?.error?.message, 'error');
        }
      });

    this.recentOrdersService.getRecentOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.recentOrders = orders;
      });
  }
}