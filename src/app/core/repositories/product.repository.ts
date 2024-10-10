import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductRepository {
  private _productsUrl = `${environment.apiUrl}/products`;
  private _bestSellersUrl = `${this._productsUrl}/best-sellers`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllProducts(): Observable<Product[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<Product[]>(this._productsUrl, { headers });
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<BestSellerProduct[]>(this._bestSellersUrl, { headers });
  }

  addProduct(newProduct: Product): Observable<Product> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.post<Product>(this._productsUrl, newProduct, { headers });
  }

  updateProduct(product: Product): Observable<Product> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.put<Product>(`${this._productsUrl}/edit`, product, { headers });
  }

  deleteProduct(productID: string): Observable<void> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.delete<void>(`${this._productsUrl}/${productID}/delete`, { headers });
  }
}