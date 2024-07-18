import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';

@Injectable({
  providedIn: 'root'
})
export class RecentOrdersService {
  private recentOrdersSubject = new Subject<RecentOrder[]>();

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.recentOrdersSubject.asObservable();
  }

  setRecentOrders(orders: RecentOrder[]): void {
    this.recentOrdersSubject.next(orders);
  }
}
