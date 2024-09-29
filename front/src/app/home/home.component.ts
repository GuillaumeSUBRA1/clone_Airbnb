import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { TenantListingService } from '../services/tenant_listing.service';
import { ToastService } from '../services/toast.service';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardListing } from '../model/listing.model';
import { Pagination } from '../model/request.model';
import { Category } from '../model/category.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from '../shared/card-listing/card-listing.component';
import { filter, Subscription } from 'rxjs';
import { StatusNotification } from '../model/state.model';
import { Search } from '../model/search.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'home',
  standalone: true,
  imports: [FaIconComponent, CardListingComponent],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {

  tenantService = inject(TenantListingService);
  toastService = inject(ToastService);
  categoryServie = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  listing?: Array<CardListing>;
  pageRequest: Pagination = { size: 20, page: 0, sort: [] };
  loading = false;
  searchLoading = false;
  emptySearch = false;
  categoryServiceSubscription?: Subscription;
  searchSubscription?: Subscription;

  constructor() {
    this.listenToGetAllCategory();
    this.listenToSearch();
  }

  ngOnInit(): void {
    this.startNewSearch();
    this.listenChangeCategory();
  }

  ngOnDestroy(): void {
    this.tenantService.resetCategory();
    if (this.categoryServiceSubscription) {
      this.categoryServiceSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  listenChangeCategory() {
    this.categoryServiceSubscription = this.categoryServie.changeCategoryObs.pipe()
      .subscribe({
        next: (c: Category) => {
          this.loading = true;
          this.tenantService.getAllByCategory(this.pageRequest, c.category)
        }
      })
  }

  listenToGetAllCategory() {
    effect(() => {
      const s = this.tenantService.getAllCategorySignal();
      if (s.status === StatusNotification.OK) {
        this.listing = s.value?.content;
        this.loading = false;
      } else if (s.status === StatusNotification.ERROR) {
        this.toastService.send({ severity: "error", detail: "", summary: "Error when fetching the listing" });
        this.loading = false;
      }
    });
  }

  listenToSearch() {
    this.searchSubscription = this.tenantService.searchObservable.subscribe({
      next: s => {
        this.loading = false;
        this.searchLoading = false;
        if (s.status === StatusNotification.OK) {
          this.listing = s.value?.content;
          this.emptySearch = this.listing?.length === 0;
        } else if (s.status === StatusNotification.ERROR) {
          this.toastService.send({ severity: "error", detail: "", summary: "Error when searching the listing" });
        }
      }
    });
  }

  startNewSearch() {
    this.activatedRoute.queryParams.pipe(
      filter(p => p['location'])
    )
      .subscribe({
        next: p => {
          this.searchLoading = true;
          this.loading = true;
          const search: Search = {
            dates: {
              start: dayjs(p["startDate"]).toDate(),
              end: dayjs(p["endDate"]).toDate(),
            },
            infos: {
              guest: { value: p['guest'] },
              bedroom: { value: p['bedroom'] },
              bed: { value: p['bed'] },
              bath: { value: p['bath'] },
            },
            location: p['location']
          };
          this.tenantService.search(search, this.pageRequest);
        }
      })
  }

  onResetSearch() {
    this.router.navigate(["/"], {
      queryParams: { "category": this.categoryServie.getDefaultCategory().category }
    });
    this.loading = true;
    this.emptySearch = false;
  }
}
