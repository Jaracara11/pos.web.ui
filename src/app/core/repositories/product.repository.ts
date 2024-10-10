import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductRepository {
  private _productsUrl = `${environment.apiUrl}/products`;
  private _bestSellersUrl = `${this._productsUrl}/best-sellers`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this._productsUrl);
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    return this.http.get<BestSellerProduct[]>(this._bestSellersUrl);
  }

  addProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this._productsUrl, newProduct);
  }

  updateProduct(updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this._productsUrl}/edit`, updatedProduct);
  }

  deleteProduct(productID: string): Observable<void> {
    return this.http.delete<void>(`${this._productsUrl}/${productID}/delete`);
  }
}