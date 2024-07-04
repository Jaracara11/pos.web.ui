import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Product } from '../../shared/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
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
}
