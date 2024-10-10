import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepository {
  private _categoriesUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this._categoriesUrl);
  }
}
