import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  private _salesOfTheDaySub$ = Subscription.EMPTY;
  salesOfTheDay = 0;

  constructor(private orderService: OrderService,
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService) { }

  ngOnInit(): void {
    this.loadTotalSalesOfTheDay();
  }

  ngOnDestroy(): void {
    this._salesOfTheDaySub$.unsubscribe();
  }

  private loadTotalSalesOfTheDay(): void {
    const cacheKey = 'salesToday';
    const fallbackObservable: Observable<number> = this.orderService.getTotalSalesOfTheDay();

    this._salesOfTheDaySub$ = this.cacheService.cacheObservable(cacheKey, fallbackObservable).subscribe({
      next: (response: number) => {
        this.salesOfTheDay = response;
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
}
