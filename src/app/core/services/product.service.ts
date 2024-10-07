import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { Observable, shareReplay, tap, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../../shared/interfaces/product.interface';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productsUrl = `${environment.apiUrl}/products`;
  private _bestSellersUrl = `${this._productsUrl}/best-sellers`;
  private productChangeSubject = new Subject<void>();
  private productsCache$: Observable<Product[]> | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cacheService: CacheService<Product[]>
  ) { }

  getAllProducts(): Observable<Product[]> {
    if (this.productsCache$) {
      return this.productsCache$;
    }

    const headers = this.authService.userAuthorizationHeaders();
    this.productsCache$ = this.http.get<Product[]>(this._productsUrl, { headers }).pipe(
      tap((products) => this.cacheService.setData(products)),
      shareReplay(1)
    );

    return this.productsCache$;
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<BestSellerProduct[]>(this._bestSellersUrl, { headers }).pipe(
      shareReplay(1)
    );
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
    this.cacheService.clearCache();
    this.productsCache$ = null;
    this.productChangeSubject.next();
  }

  onProductChange(): Observable<void> {
    return this.productChangeSubject.asObservable();
  }
}