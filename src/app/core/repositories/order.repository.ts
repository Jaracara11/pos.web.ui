import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';
import { Observable } from 'rxjs';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderRepository {
  private _ordersUrl = `${environment.apiUrl}/orders`;
  private _recentOrdersUrl = `${this._ordersUrl}/recent-orders`;
  private _salesTodayUrl = `${this._ordersUrl}/sales-today`;

  constructor(private http: HttpClient) { }

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.http.get<RecentOrder[]>(this._recentOrdersUrl);
  }

  getTotalSalesOfTheDay(): Observable<number> {
    return this.http.get<number>(this._salesTodayUrl);
  }

  getOrderByID(orderID: string): Observable<OrderInfo> {
    return this.http.get<OrderInfo>(`${this._ordersUrl}/${orderID}`);
  }

  cancelOrder(orderID: string): Observable<string> {
    return this.http.post<string>(`${this._ordersUrl}/${orderID}/cancel`, {});
  }
}