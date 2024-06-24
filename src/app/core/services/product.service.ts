import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productsUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<BestSellerProduct[]>(`${this._productsUrl}/best-sellers`, { headers });
  }
}
