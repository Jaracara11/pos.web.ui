import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductCacheService {
  private productSubject = new BehaviorSubject<Product[]>([]);

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this.productSubject.asObservable();
  }

  setProducts(orders: Product[]): void {
    this.productSubject.next(orders);
  }
}



