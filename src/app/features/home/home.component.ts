import { Component } from '@angular/core';
import { BestSellerProductsComponent } from '../../core/components/best-seller-products/best-seller-products.component';
import { RecentOrdersComponent } from '../../core/components/recent-orders/recent-orders.component';
import { ProductAvailabilityComponent } from '../../core/components/product-availability/product-availability.component';
import { SalesOfTheDayComponent } from '../../core/components/sales-of-the-day/sales-of-the-day.component';

@Component({
    selector: 'app-home',
    imports: [BestSellerProductsComponent, RecentOrdersComponent, ProductAvailabilityComponent, SalesOfTheDayComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent { }
