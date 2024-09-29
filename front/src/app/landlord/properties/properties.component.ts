import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListing } from 'src/app/model/listing.model';
import { StatusNotification } from 'src/app/model/state.model';
import { LandlordListingService } from 'src/app/services/landlord_listing.service';
import { ToastService } from 'src/app/services/toast.service';
import { CardListingComponent } from 'src/app/shared/card-listing/card-listing.component';

@Component({
  selector: 'properties',
  standalone: true,
  imports: [CardListingComponent, FaIconComponent],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit, OnDestroy {
  landlordListingService = inject(LandlordListingService);
  toastService = inject(ToastService);

  listing?: Array<CardListing> = [];
  loadingDelete = false;
  loadingFetch = false;

  constructor() {
    this.listenFetchAll();
    this.listenDelete();
  }


  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.fetchListing();
  }

  listenFetchAll() {
    effect(() => {
      const state = this.landlordListingService.getAllSignal();
      if (state.status === StatusNotification.OK && state.value) {
        this.loadingFetch = false;
        this.listing = state.value;
      } else if (state.status === StatusNotification.ERROR) {
        this.toastService.send({ severity: "error", summary: "Error", detail: "Error while loading the listing" });
      }
    })
  }

  listenDelete() {
    effect(() => {
      const state = this.landlordListingService.deleteSignal();
      const i = this.listing?.findIndex(l => l.pid === state.value);
      if (state.status === StatusNotification.OK && state.value) {
        this.listing?.splice(i!, 1);
        this.toastService.send({ severity: "success", summary: "Deleted successfully", detail: "Listing deleted successfully" });
      } else if (state.status === StatusNotification.ERROR) {
        this.listing![i!].loading = false;
        this.toastService.send({ severity: "error", summary: "Error", detail: "Error while deleting the listing" });
      }
      this.loadingDelete = false;
    });
  }

  fetchListing() {
    this.loadingFetch = true;
    this.landlordListingService.getAll();
  }

  delete(l: CardListing) {
    l.loading = true;
    this.landlordListingService.delete(l.pid);
  }

}
