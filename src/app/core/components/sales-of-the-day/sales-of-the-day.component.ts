import { Component } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { CacheService } from '../../services/cache.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-sales-of-the-day',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './sales-of-the-day.component.html',
  styleUrl: './sales-of-the-day.component.css'
})
export class SalesOfTheDayComponent {
  private destroy$ = new Subject<void>();
  salesOfTheDay = 0;

  constructor(private orderService: OrderService,
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loadTotalSalesOfTheDay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTotalSalesOfTheDay(): void {
    const cacheKey = 'salesToday';
    const fallbackObservable: Observable<number> = this.orderService.getTotalSalesOfTheDay();

    this.cacheService.cacheObservable(cacheKey, fallbackObservable)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: number) => {
          this.salesOfTheDay = response;
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(error.statusText, error?.error?.message, 'error');
        }
      });
  }
}
