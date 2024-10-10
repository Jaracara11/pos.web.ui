import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Product } from '../../shared/interfaces/product.interface';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productsUrl = `${environment.apiUrl}/products`;
  private _bestSellersUrl = `${this._productsUrl}/best-sellers`;
  private productChangeSubject = new BehaviorSubject<void>(undefined);
  public productsSubject = new BehaviorSubject<Product[] | null>(null);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllProducts(): Observable<Product[]> {
    if (this.productsSubject.value) {
      return this.productsSubject.asObservable().pipe(
        filter(products => products !== null)
      ) as Observable<Product[]>;
    }

    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<Product[]>(this._productsUrl, { headers }).pipe(
      tap(products => this.productsSubject.next(products))
    );
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<BestSellerProduct[]>(this._bestSellersUrl, { headers });
  }

  addProduct(newProduct: Product): Observable<Product> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.post<Product>(this._productsUrl, newProduct, { headers }).pipe(
      tap(() => {
        this.clearCacheAndNotify();
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.put<Product>(`${this._productsUrl}/edit`, product, { headers }).pipe(
      tap(() => {
        this.clearCacheAndNotify();
      })
    );
  }

  deleteProduct(productID: string): Observable<void> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.delete<void>(`${this._productsUrl}/${productID}/delete`, { headers }).pipe(
      tap(() => {
        this.clearCacheAndNotify();
      })
    );
  }

  clearCacheAndNotify(): void {
    this.productsSubject.next(null);
    this.productChangeSubject.next();
  }

  onProductChange(): Observable<void> {
    return this.productChangeSubject.asObservable();
  }
}