import { NgClass } from '@angular/common';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { map } from 'rxjs';
import { Category } from 'src/app/model/category.model';
import { DisplayPicture, Listing } from 'src/app/model/listing.model';
import { LogoComponent } from 'src/app/navigation-bar/logo/logo.component';
import { CategoryService } from 'src/app/services/category.service';
import { CountryService } from 'src/app/services/country.service';
import { TenantListingService } from 'src/app/services/tenant_listing.service';
import { ToastService } from 'src/app/services/toast.service';
import { BookDateComponent } from '../book-date/book-date.component';
import { StatusNotification } from 'src/app/model/state.model';

@Component({
  selector: 'app-display-listing',
  standalone: true,
  imports: [NgClass, FaIconComponent, LogoComponent, BookDateComponent],
  templateUrl: './display-listing.component.html',
  styleUrl: './display-listing.component.scss'
})
export class DisplayListingComponent implements OnInit, OnDestroy {
  tenantService = inject(TenantListingService);
  activatedRoute = inject(ActivatedRoute)
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);

  listing?: Listing;
  category?: Category;
  currentPid = "";
  loading = true;

  constructor() {
    this.listenFetchListing();
  }

  ngOnInit(): void {
    this.getIdFromRouter();
  }

  ngOnDestroy(): void {
    this.tenantService.resetGetOne();
  }

  getIdFromRouter() {
    this.activatedRoute.queryParams.pipe(
      map(p => p['id'])
    ).subscribe({
      next: id => this.fetchListing(id)
    })
  }

  listenFetchListing() {
    effect(() => {
      const state = this.tenantService.getOneSignal();
      if (state.status === StatusNotification.OK) {
        this.loading = false;
        this.listing = state.value!;
        if (this.listing) {
          this.listing.pictures = this.coverFirst(this.listing.pictures);
          this.category = this.categoryService.getCategoryByCategory(this.listing.category);
          this.countryService.getCountryByCode(this.listing.location)
            .subscribe({
              next: c => {
                if (this.listing) {
                  this.listing.location = c.region + ", " + c.name.common;
                }
              }
            });

        }
      } else if (state.status === StatusNotification.ERROR) {
        this.loading = false;
        this.toastService.send({ severity: "error", detail: "Error when fetching the listing" });
      }
    })
  }

  fetchListing(pid: string) {
    this.loading = true;
    this.currentPid = pid;
    this.tenantService.getOne(pid);
  }

  coverFirst(pic: Array<DisplayPicture>) {
    const i = pic.findIndex(p => p.isCover);
    if (i) {
      const cover = pic[i];
      pic.splice(i, 1);
      pic.unshift(cover);
    }
    return pic;
  }
}
