import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../../shared/interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  public categoriesSubject = new BehaviorSubject<Category[] | null>(null);

  constructor(private categoryRepository: CategoryRepository) { }

  getAllCategories(): Observable<Category[]> {
    if (this.categoriesSubject.value) {
      return this.categoriesSubject.asObservable().pipe(
        filter(categories => categories !== null)
      ) as Observable<Category[]>;
    }

    return this.categoryRepository.getAllCategories().pipe(
      tap(categories => this.categoriesSubject.next(categories))
    );
  }
  
  refreshCategories(): void {
    this.categoryRepository.getAllCategories().subscribe(categories => {
      this.categoriesSubject.next(categories);
    });
  }
}