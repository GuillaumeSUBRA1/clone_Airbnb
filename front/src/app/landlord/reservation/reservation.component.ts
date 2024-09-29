import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { StatusNotification } from 'src/app/model/state.model';
import { BookedListing } from 'src/app/model/tenant.model';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import { CardListingComponent } from 'src/app/shared/card-listing/card-listing.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CardListingComponent,FaIconComponent],
  templateUrl: './reservation.component.html'
})
export class ReservationComponent implements OnInit, OnDestroy {
  bookingService = inject(BookingService);
  toastService = inject(ToastService);

  reservation = new Array<BookedListing>();

  loading = false;

  constructor() {
    this.listenFetchReservation();
    this.listenCancel();
  }

  ngOnInit(): void {
    this.fetchReservation();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCancel();
  }

  fetchReservation() {
    this.loading = true;
    this.bookingService.getBookedListingLandlord();
  }

  listenFetchReservation() {
    effect(() => {
      const state = this.bookingService.getBookedListingLandlordSignal();
      if (state.status === StatusNotification.OK && state.value) {
        this.loading = false;
        this.reservation = state.value;
      } else if (state.status === StatusNotification.ERROR) {
        this.loading = false;
        this.toastService.send({ severity: "error", summary: "Error", detail: "Error while loading the listing" });
      }
    })
  }

  listenCancel() {
    effect(() => {
      const state = this.bookingService.cancelSignal();
      const i = this.reservation.findIndex(l => l.bookingPid === state.value!);
      if (state.status === StatusNotification.OK) {
        this.loading = false;
        this.reservation.splice(i, 1);
        this.toastService.send({ severity: "success", detail: "Reservation canceled successfully" });
      } else if (state.status === StatusNotification.ERROR) {
        this.loading = false;
        this.reservation[i].loading = false;
        this.toastService.send({ severity: "error", detail: "Error when canceling the reservation" });
      }
    });
  }

  cancelReservation(r: BookedListing) {
    r.loading = true;
    this.bookingService.cancel(r.bookingPid, r.listingPid, true);
  }

}
