import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { Observable, shareReplay, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productsUrl = `${environment.apiUrl}/products`;
  private _bestSellersUrl = `${this._productsUrl}/best-sellers`;

  private productsCache$: Observable<Product[]> | null = null;
  private bestSellersCache$: Observable<BestSellerProduct[]> | null = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllProducts(): Observable<Product[]> {
    if (!this.productsCache$) {
      const headers = this.authService.userAuthorizationHeaders();
      this.productsCache$ = this.http.get<Product[]>(this._productsUrl, { headers }).pipe(
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    if (!this.bestSellersCache$) {
      const headers = this.authService.userAuthorizationHeaders();
      this.bestSellersCache$ = this.http.get<BestSellerProduct[]>(this._bestSellersUrl, { headers }).pipe(
        shareReplay(1)
      );
    }
    return this.bestSellersCache$;
  }

  addProduct(newProduct: Product): Observable<Product> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.post<Product>(this._productsUrl, newProduct, { headers }).pipe(
      tap(() => this.clearProductsCache())
    );
  }

  updateProduct(product: Product): Observable<Product> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.put<Product>(this._productsUrl, product, { headers }).pipe(
      tap(() => this.clearProductsCache()));
  }

  deleteProduct(productID: string): Observable<void> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.delete<void>(`${this._productsUrl}/${productID}/delete`, { headers }).pipe(
      tap(() => this.clearProductsCache()));
  }

  clearProductsCache(): void {
    this.productsCache$ = null;
    this.bestSellersCache$ = null;
  }
}
