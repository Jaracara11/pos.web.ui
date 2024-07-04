import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _ordersUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getRecentOrders(): Observable<RecentOrder[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<RecentOrder[]>(`${this._ordersUrl}/recent-orders`, { headers });
  }
}
