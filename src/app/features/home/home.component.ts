import { Component } from '@angular/core';
import { BestSellerProductsComponent } from '../../core/components/best-seller-products/best-seller-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BestSellerProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent { }
