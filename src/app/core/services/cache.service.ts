import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheContent } from '../../shared/interfaces/cache-content.interface';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private _cache = new Map<string, CacheContent<any>>();

  get<T>(key: string): Observable<T> | undefined {
    const data = this._cache.get(key);

    if (!data) { return undefined; }

    const now = new Date().getTime();

    if (now > data.expiry) {
      this._cache.delete(key);
      return undefined;
    }

    return of(data.value as T);
  }

  set<T>(key: string, value: T, ttl: number = 300000): Observable<T> {
    const expiry = new Date().getTime() + ttl;
    this._cache.set(key, { expiry, value });
    return of(value);
  }

  cacheObservable<T>(key: string, fallback: Observable<T>, ttl?: number): Observable<T> {
    const cached = this.get<T>(key);
    if (cached) {
      return cached;
    } else {
      return fallback.pipe(
        tap(value => {
          this.set(key, value, ttl);
        })
      );
    }
  }

  clearCache(key: string): void {
    this._cache.delete(key);
  }
}
