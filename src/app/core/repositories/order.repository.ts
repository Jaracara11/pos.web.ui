import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderRepository {
  private _ordersUrl = `${environment.apiUrl}/orders`;
  private _recentOrdersUrl = `${this._ordersUrl}/recent-orders`;
  private _salesTodayUrl = `${this._ordersUrl}/sales-today`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRecentOrders(): Observable<RecentOrder[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<RecentOrder[]>(this._recentOrdersUrl, { headers });
  }

  getTotalSalesOfTheDay(): Observable<number> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<number>(this._salesTodayUrl, { headers });
  }

  getOrderByID(orderID: string): Observable<OrderInfo> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<OrderInfo>(`${this._ordersUrl}/${orderID}`, { headers });
  }

  cancelOrder(orderID: string): Observable<string> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.post<string>(`${this._ordersUrl}/${orderID}/cancel`, {}, { headers });
  }
}