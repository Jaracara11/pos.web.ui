import { Component } from '@angular/core';
import { BestSellerProduct } from '../../../shared/interfaces/best-seller-product.interface';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../services/swal-alert.service';

@Component({
  selector: 'app-best-seller-products',
  standalone: true,
  imports: [],
  templateUrl: './best-seller-products.component.html',
  styleUrl: './best-seller-products.component.css'
})
export class BestSellerProductsComponent {
  bestSellerProducts: BestSellerProduct[] = [];

  constructor(private productService: ProductService, private swalAlertService: SwalAlertService) { }

  ngOnInit(): void {
    this.loadBestSellerProducts();
  }

  private loadBestSellerProducts(): void {
    this.productService.getBestSellerProducts().subscribe({
      next: (response: BestSellerProduct[]) => {
        this.bestSellerProducts = response;
      },
      error: (error: HttpErrorResponse) => {
        this.swalAlertService.swalAlertWithTitle(
          error.statusText,
          error.error.message,
          'error',
        );
      }
    });
  }
}
