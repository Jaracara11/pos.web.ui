import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { AuthService } from './auth.service';
import { Category } from '../../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private _categoriesUrl = `${environment.apiUrl}/categories`;

  private categoriesCache$: Observable<Category[]> | null = null;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllCategories(): Observable<Category[]> {
    if (!this.categoriesCache$) {
      const headers = this.authService.userAuthorizationHeaders();
      this.categoriesCache$ = this.http.get<Category[]>(this._categoriesUrl, { headers }).pipe(
        shareReplay(1)
      );
    }
    return this.categoriesCache$;
  }

  clearCategoriesCache(): void {
    this.categoriesCache$ = null;
  }
}
