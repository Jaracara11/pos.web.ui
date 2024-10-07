import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService<T> {
  private dataSubject = new BehaviorSubject<T | null>(null);

  setData(data: T | null): void {
    this.dataSubject.next(data);
  }

  getData(): Observable<T> {
    return this.dataSubject.asObservable().pipe(
      map(data => data || [] as T)
    );
  }

  clearCache(): void {
    this.dataSubject.next(null);
  }
}