import { Component, OnInit, OnDestroy } from '@angular/core';
import { BestSellerProduct } from '../../../shared/interfaces/best-seller-product.interface';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../services/swal-alert.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-best-seller-products',
  standalone: true,
  imports: [],
  templateUrl: './best-seller-products.component.html',
  styleUrl: './best-seller-products.component.css'
})
export class BestSellerProductsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  bestSellerProducts: BestSellerProduct[] = [];

  constructor(
    private productService: ProductService,
    private swalAlertService: SwalAlertService
  ) { }

  ngOnInit(): void {
    this.loadBestSellerProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBestSellerProducts(): void {
    this.productService.getBestSellerProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: BestSellerProduct[]) => {
          this.bestSellerProducts = response;
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalValidationErrorAlert(error);
        }
      });
  }
}
