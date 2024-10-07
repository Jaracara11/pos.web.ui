import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _ordersUrl = `${environment.apiUrl}/orders`;
  private _recentOrdersUrl = `${this._ordersUrl}/recent-orders`;
  private _salesTodayUrl = `${this._ordersUrl}/sales-today`;

  private recentOrdersCache$: Observable<RecentOrder[]> | null = null;
  private totalSalesCache$: Observable<number> | null = null;
  private orderChangeSubject = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getRecentOrders(): Observable<RecentOrder[]> {
    if (!this.recentOrdersCache$) {
      const headers = this.authService.userAuthorizationHeaders();
      this.recentOrdersCache$ = this.http.get<RecentOrder[]>(this._recentOrdersUrl, { headers }).pipe(
        shareReplay(1)
      );
    }
    return this.recentOrdersCache$;
  }

  getTotalSalesOfTheDay(): Observable<number> {
    if (!this.totalSalesCache$) {
      const headers = this.authService.userAuthorizationHeaders();
      this.totalSalesCache$ = this.http.get<number>(this._salesTodayUrl, { headers }).pipe(
        shareReplay(1)
      );
    }
    return this.totalSalesCache$;
  }

  getOrderByID(orderID: string): Observable<OrderInfo> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<OrderInfo>(`${this._ordersUrl}/${orderID}`, { headers });
  }

  cancelOrder(orderID: string): Observable<string> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.post<string>(`${this._ordersUrl}/${orderID}/cancel`, {}, { headers }).pipe(
      tap(() => {
        this.clearOrdersCache();
        this.orderChangeSubject.next();
      })
    );
  }

  clearOrdersCache(): void {
    this.recentOrdersCache$ = null;
    this.totalSalesCache$ = null;
  }

  onOrderChange(): Observable<void> {
    return this.orderChangeSubject.asObservable();
  }
}