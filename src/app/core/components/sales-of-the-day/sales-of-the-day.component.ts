import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sales-of-the-day',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './sales-of-the-day.component.html',
  styleUrl: './sales-of-the-day.component.css'
})
export class SalesOfTheDayComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  salesOfTheDay = 0;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadTotalSalesOfTheDay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTotalSalesOfTheDay(): void {
    this.orderService.getTotalSalesOfTheDay()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: number) => {
        this.salesOfTheDay = response;
      });
  }
}