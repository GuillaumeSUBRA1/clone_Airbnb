import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CategoryName, Category } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'category-step',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './category-step.component.html',
  styleUrl: './category-step.component.scss'
})
export class CategoryStepComponent implements OnInit {

  category = input.required<CategoryName>();

  @Output() categoryChangeEvent = new EventEmitter<CategoryName>();
  @Output() stepValidatedEvent = new EventEmitter<boolean>();

  categoryService = inject(CategoryService);
  categories: Category[] | undefined;

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
  }

  selectCategory(c:CategoryName){
    this.categoryChangeEvent.emit(c);
    this.stepValidatedEvent.emit(true);
  }
}
