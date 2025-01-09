import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RecentOrder } from '../../../shared/interfaces/recent-order.interface';
import { OrderService } from '../../services/order.service';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-recent-orders',
    imports: [RouterLink, CurrencyPipe, DatePipe],
    templateUrl: './recent-orders.component.html',
    styleUrl: './recent-orders.component.css'
})
export class RecentOrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  recentOrders: RecentOrder[] = [];

  constructor(private orderService: OrderService) { }

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
      .subscribe((response: RecentOrder[]) => {
        this.recentOrders = response;
      });
  }
}