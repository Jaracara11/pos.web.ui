import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../../shared/interfaces/category.interface';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepository {
  private _categoriesUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllCategories(): Observable<Category[]> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.get<Category[]>(this._categoriesUrl, { headers });
  }
}
