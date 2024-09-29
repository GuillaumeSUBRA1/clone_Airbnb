import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { StatusNotification } from 'src/app/model/state.model';
import { BookedListing } from 'src/app/model/tenant.model';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import { CardListingComponent } from 'src/app/shared/card-listing/card-listing.component';

@Component({
  selector: 'booked-listing',
  standalone: true,
  imports: [CardListingComponent,FaIconComponent],
  templateUrl: './booked-listing.component.html'
})
export class BookedListingComponent implements OnInit, OnDestroy {

  bookingService = inject(BookingService)
  toastService = inject(ToastService);
  bookedListing = new Array<BookedListing>();

  loading = false;

  constructor() {
    this.listenFetchBooking();
    this.listenCancel();
  }

  ngOnInit(): void {
    this.fetchBooking();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel();
  }

  fetchBooking() {
    this.loading = true;
    this.bookingService.getBookedListing();
  }

  listenFetchBooking() {
    effect(() => {
      const state = this.bookingService.getBookedListingSignal();
      if (state.status === StatusNotification.OK) {
        this.loading = false;
        this.bookedListing = state.value!;
      } else if(state.status === StatusNotification.ERROR){
        this.loading = false;
        this.toastService.send({ severity: "error", detail: "Error when fetching the booking" });
      }
    });
  }

  listenCancel() {
    effect(() => {
      const state = this.bookingService.cancelSignal();
      const i = this.bookedListing.findIndex(l => l.bookingPid === state.value!);
      if (state.status === StatusNotification.OK) {
        this.loading = false;
        this.bookedListing.splice(i, 1);
        this.toastService.send({ severity: "success", detail: "Booking canceled successfully" });
      } else if(state.status === StatusNotification.ERROR){
        this.loading = false;
        this.bookedListing[i].loading = false;
        this.toastService.send({ severity: "error", detail: "Error when canceling the booking" });
      }
    });
  }

  cancelBooking(b: BookedListing) {
    b.loading = true;
    this.bookingService.cancel(b.bookingPid, b.listingPid,false);
  }

}
