import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { filter, map } from 'rxjs';
import { Category, CategoryName } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  standalone: true,
  imports: [FaIconComponent],
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categoryService = inject(CategoryService);
  categoryList?: Category[];
  currentCategory = this.categoryService.getDefaultCategory();

  isHome = false;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.listenRouter();
    this.currentCategory.active = false;
    this.categoryList = this.categoryService.getCategories();
  }

  listenRouter() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe({
      next: (e: NavigationEnd) => {
        this.isHome = e.url.split("?")[0] === "/";
        if (this.isHome && e.url.indexOf("?") === -1) {
          const c = this.categoryService.getCategoryByCategory(CategoryName.ALL);
          this.categoryService.changeCategory(c!);
        }
      }
    });
    this.activatedRoute.queryParams
      .pipe(
        map(p => p["category"])
      ).subscribe({
        next: (c: CategoryName) => {
          const ct = this.categoryService.getCategoryByCategory(c);
          if (ct) {
            this.activateCategory(ct);
            this.categoryService.changeCategory(ct);
          }
        }
      });
  }

  activateCategory(c: Category) {
    this.currentCategory.active = false;
    this.currentCategory = c;
    this.currentCategory.active = true;
  }

  changeCategory(c: Category) {
    this.activateCategory(c);
    this.router.navigate([], {
      queryParams: { "category": c.category },
      relativeTo: this.activatedRoute
    })
  }
}
