import { Component } from '@angular/core';
import { BestSellerProductsComponent } from '../../core/components/best-seller-products/best-seller-products.component';
import { RecentOrdersComponent } from '../../core/components/recent-orders/recent-orders.component';
import { ProductAvailabilityComponent } from '../../core/components/product-availability/product-availability.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BestSellerProductsComponent, RecentOrdersComponent, ProductAvailabilityComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent { }
