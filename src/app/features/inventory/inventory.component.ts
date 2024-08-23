import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  validateRolePermission: boolean;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private swalAlertService: SwalAlertService
  ) {
    this.validateRolePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Product[]) => {
          this.products = response;
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error?.error?.message || 'An error occurred';
          this.swalAlertService.swalAlertWithTitle(error.statusText, errorMessage, 'error');
        }
      });
  }
}
