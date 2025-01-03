import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../../shared/interfaces/product.interface';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';
import { environment } from '../../../environments/environment';
import { ProductApiResponse } from '../../shared/interfaces/product-api-response.interface';
import { mapProductListResponse } from '../../shared/utils/product-mapper';

@Injectable({
  providedIn: 'root'
})
export class ProductRepository {
  private _productsUrl = `${environment.apiUrl}/product`;
  private _bestSellersUrl = `${this._productsUrl}/best-sellers`;

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<ProductApiResponse[]>(this._productsUrl).pipe(
      map(products => mapProductListResponse(products))
    );
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

  deleteProduct(productID: number): Observable<void> {
    return this.http.delete<void>(`${this._productsUrl}/${productID}/delete`);
  }
}