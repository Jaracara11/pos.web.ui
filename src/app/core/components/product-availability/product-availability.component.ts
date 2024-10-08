import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-product-availability',
  standalone: true,
  imports: [NgClass],
  templateUrl: './product-availability.component.html',
  styleUrl: './product-availability.component.css'
})
export class ProductAvailabilityComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  lowStockProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private swalAlertService: SwalAlertService
  ) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTableRowClass(index: number): string {
    switch (index) {
      case 0:
        return 'table-danger';
      case 1:
        return 'table-warning';
      case 2:
        return 'table-info';
      default:
        return '';
    }
  }

  private loadAllProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Product[]) => {
          this.lowStockProducts = this.getLowStockProducts(response);
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalValidationErrorAlert(error);
        }
      });
  }

  private getLowStockProducts(products: Product[]): Product[] {
    const sortedProducts = [...products].sort((a, b) => a.productStock - b.productStock);
    return sortedProducts.slice(0, 3);
  }
}
