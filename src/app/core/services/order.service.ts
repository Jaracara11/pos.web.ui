import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { RecentOrder } from '../../shared/interfaces/recent-order.interface';
import { filter } from 'rxjs/operators';
import { OrderRepository } from '../repositories/order.repository';
import { ProductService } from '../services/product.service';
import { OrderInfo } from '../../shared/interfaces/oder-info.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private recentOrdersSubject = new BehaviorSubject<RecentOrder[] | null>(null);
  private totalSalesSubject = new BehaviorSubject<number | null>(null);

  constructor(private orderRepository: OrderRepository, private productService: ProductService) { }

  getRecentOrders(): Observable<RecentOrder[]> {
    if (this.recentOrdersSubject.value === null) {
      return this.refreshOrders();
    }
    return this.recentOrdersSubject.asObservable().pipe(
      filter((orders): orders is RecentOrder[] => orders !== null)
    );
  }

  getTotalSalesOfTheDay(): Observable<number> {
    if (this.totalSalesSubject.value === null) {
      return this.refreshSales();
    }
    return this.totalSalesSubject.asObservable().pipe(
      filter((sales): sales is number => sales !== null)
    );
  }

  getOrderByID(orderID: string): Observable<OrderInfo> {
    return this.orderRepository.getOrderByID(orderID);
  }

  cancelOrder(orderID: string): Observable<string> {
    return this.orderRepository.cancelOrder(orderID).pipe(
      tap(() => {
        this.refreshOrders();
        this.refreshSales();
        this.productService.refreshProducts();
      })
    );
  }

  private refreshOrders(): Observable<RecentOrder[]> {
    return this.orderRepository.getRecentOrders().pipe(
      tap(orders => this.recentOrdersSubject.next(orders))
    );
  }

  private refreshSales(): Observable<number> {
    return this.orderRepository.getTotalSalesOfTheDay().pipe(
      tap(sales => this.totalSalesSubject.next(sales))
    );
  }
}