import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RecentOrder } from '../../../shared/interfaces/recent-order.interface';
import { OrderService } from '../../services/order.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { CacheService } from '../../services/cache.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './recent-orders.component.html',
  styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent {
  private _recentOrdersSub$ = Subscription.EMPTY;
  recentOrders: RecentOrder[] = [];

  constructor(private orderService: OrderService,
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loadRecentOrders();
  }

  ngOnDestroy(): void {
    this._recentOrdersSub$.unsubscribe();
  }

  private loadRecentOrders(): void {
    const cacheKey = 'bestSellerProducts';
    const fallbackObservable: Observable<RecentOrder[]> = this.orderService.getRecentOrders();

    this._recentOrdersSub$ = this.cacheService.cacheObservable(cacheKey, fallbackObservable).subscribe({
      next: (response: RecentOrder[]) => {
        this.recentOrders = response;
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
