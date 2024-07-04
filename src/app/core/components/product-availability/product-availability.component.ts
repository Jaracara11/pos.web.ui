import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { CacheService } from '../../services/cache.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-availability',
  standalone: true,
  imports: [],
  templateUrl: './product-availability.component.html',
  styleUrl: './product-availability.component.css'
})
export class ProductAvailabilityComponent {
  private _productsSub$ = Subscription.EMPTY;
  lowStockProducts: Product[] = [];

  constructor(private productService: ProductService,
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  ngOnDestroy(): void {
    this._productsSub$.unsubscribe();
  }

  private loadAllProducts(): void {
    const cacheKey = 'products';
    const fallbackObservable: Observable<Product[]> = this.productService.getAllProducts();

    this._productsSub$ = this.cacheService.cacheObservable(cacheKey, fallbackObservable).subscribe({
      next: (response: Product[]) => {
        if (response) {
          this.lowStockProducts = this.getLowStockProducts(response);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.swalAlertService.swalAlertWithTitle(
          error.statusText,
          error.error.message,
          'error'
        );
      }
    });
  }

  private getLowStockProducts(products: Product[]): Product[] {
    const sortedProducts = [...products].sort((a, b) => a.productStock - b.productStock);
    return sortedProducts.slice(0, 3);
  }
}
