import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../../shared/interfaces/product.interface';
import { BestSellerProduct } from '../../shared/interfaces/best-seller-product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public productsSubject = new BehaviorSubject<Product[] | null>(null);

  constructor(private productRepository: ProductRepository) { }

  getAllProducts(): Observable<Product[]> {
    if (this.productsSubject.value) {
      return this.productsSubject.asObservable().pipe(
        filter(products => products !== null)
      ) as Observable<Product[]>;
    }

    return this.productRepository.getAllProducts().pipe(
      tap(products => this.productsSubject.next(products))
    );
  }

  getBestSellerProducts(): Observable<BestSellerProduct[]> {
    return this.productRepository.getBestSellerProducts();
  }

  addProduct(newProduct: Product): Observable<void> {
    return this.productRepository.addProduct(newProduct).pipe(
      tap(() => this.refreshProducts())
    );
  }

  updateProduct(product: Product): Observable<void> {
    return this.productRepository.updateProduct(product).pipe(
      tap(() => this.refreshProducts())
    );
  }

  deleteProduct(productID: number): Observable<void> {
    return this.productRepository.deleteProduct(productID).pipe(
      tap(() => this.refreshProducts())
    );
  }

  refreshProducts(): void {
    this.productRepository.getAllProducts().subscribe(products => {
      this.productsSubject.next(products);
    });
  }
}