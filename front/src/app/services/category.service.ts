import { Injectable } from '@angular/core';
import { Category, CategoryName, categories } from '../model/category.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor() { }

  private changeCategoryBehaviour = new BehaviorSubject<Category>(this.getDefaultCategory());
  changeCategoryObs = this.changeCategoryBehaviour.asObservable();

  changeCategory(category: Category): void {
    this.changeCategoryBehaviour.next(category);
  }

  getCategories(): Category[] {
    return categories;
  }

  getDefaultCategory() {
    return categories[0];
  }

  getCategoryByCategory(t: CategoryName): Category | undefined {
    return categories.find(c => c.category === t);
  }

}
