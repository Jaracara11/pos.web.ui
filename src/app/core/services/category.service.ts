import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../../shared/interfaces/category.interface';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[] | null>(null);
  private categoryChangeSubject = new BehaviorSubject<void>(undefined);

  constructor(private categoryRepository: CategoryRepository) { }

  getAllCategories(): Observable<Category[]> {
    if (this.categoriesSubject.value === null) {
      this.categoryRepository.getAllCategories().pipe(
        tap((categories) => this.categoriesSubject.next(categories))
      ).subscribe();
    }
    return this.categoriesSubject.asObservable().pipe(
      filter((categories): categories is Category[] => categories !== null)
    );
  }

  clearCategoriesCache(): void {
    this.categoriesSubject.next(null);
  }

  onCategoryChange(): Observable<void> {
    return this.categoryChangeSubject.asObservable();
  }
}