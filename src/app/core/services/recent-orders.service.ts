import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';

@Injectable({
  providedIn: 'root'
})
export class RecentOrdersService {
  private recentOrders: RecentOrder[] = [];
  private recentOrdersSubject = new Subject<RecentOrder[]>();

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.recentOrdersSubject.asObservable();
  }

  setRecentOrders(orders: RecentOrder[]): void {
    this.recentOrders = orders;
    this.recentOrdersSubject.next(this.recentOrders);
  }
}
