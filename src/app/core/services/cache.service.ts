import { Injectable } from '@angular/core';
import { CacheContent } from '../../shared/interfaces/cache-content.interface';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private _cache = new Map<string, CacheContent>();

  get(key: string): Observable<any> | undefined {
    const data = this._cache.get(key);
    if (!data) {
      return undefined;
    }

    const now = new Date().getTime();

    if (now > data.expiry) {
      this._cache.delete(key);
      return undefined;
    }

    return of(data.value);
  }

  set(key: string, value: any, ttl: number = 300000): Observable<any> {
    const expiry = new Date().getTime() + ttl;
    this._cache.set(key, { expiry, value });
    return of(value);
  }

  cacheObservable(key: string, fallback: Observable<any>, ttl?: number): Observable<any> {
    const cached = this.get(key);
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
}
