import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderCacheService {
  private ordersSubject = new BehaviorSubject<RecentOrder[]>([]);

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.ordersSubject.asObservable();
  }

  setRecentOrders(orders: RecentOrder[]): void {
    this.ordersSubject.next(orders);
  }
}
