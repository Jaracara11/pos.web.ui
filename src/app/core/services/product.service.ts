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

  clearProductsCache(): void {
    this.productsCache$ = null;
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<BestSellerProduct[]>(this._bestSellersUrl, { headers });
  }
}
