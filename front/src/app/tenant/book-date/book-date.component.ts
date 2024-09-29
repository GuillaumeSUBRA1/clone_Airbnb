import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Listing } from 'src/app/model/listing.model';
import { BookedDatesClient, CreateBooking } from 'src/app/model/tenant.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import { CalendarModule } from "primeng/calendar";
import { MessageModule } from "primeng/message";
import { StatusNotification } from 'src/app/model/state.model';

@Component({
  selector: 'book-date',
  standalone: true,
  imports: [
    CurrencyPipe,
    CalendarModule,
    FormsModule,
    MessageModule
  ],
  templateUrl: './book-date.component.html'
})
export class BookDateComponent implements OnInit, OnDestroy {
  listing = input.required<Listing>();
  listingPid = input.required<string>();

  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  bookingDate = new Array<Date>();
  totalPrice = 0;
  minDate = new Date();
  bookedDates = new Array<Date>();

  constructor() {
    this.listenCheckAvailable();
  }

  ngOnInit(): void {
    this.bookingService.checkAvailable(this.listingPid());

  }
  ngOnDestroy(): void {
    this.bookingService.resetCreate();
  }

  listenCheckAvailable() {
    effect(() => {
      const check = this.bookingService.checkAvailableSignal();
      if (check.status === StatusNotification.OK) {
        this.bookedDates = this.mapBookedDatesToDate(check.value!);
      } else if (check.status === StatusNotification.ERROR) {
        this.toastService.send({
          severity: "error", detail: "Error when fetching the not available dates", summary: "Error"
        });
      }
    });
  }

  listenCreate() {
    effect(() => {
      const create = this.bookingService.createSignal();
      if (create.status === StatusNotification.OK) {
        this.toastService.send({
          severity: "success", detail: "Booking created successfully", summary: "Success"
        });
        this.router.navigate(['/booking']);
      } else if (create.status === StatusNotification.ERROR) {
        this.toastService.send({
          severity: "error", detail: "Booking created failed", summary: "Error"
        });
      }
    });
  }

  dateChange(d: Array<Date>) {
    this.bookingDate = d;
    if (this.validateMakeBooking()) {
      const startDayjs = dayjs(d[0]);
      const endDayjs = dayjs(d[1]);
      this.totalPrice = endDayjs.diff(startDayjs, "days") * this.listing().price.value;
    } else {
      this.totalPrice = 0;
    }
  }

  validateMakeBooking() {
    return this.bookingDate.length === 2
      && this.bookingDate[0] !== null
      && this.bookingDate[1] !== null
      && this.bookingDate[0] !== this.bookingDate[1]
      && this.authService.isAuthenticated();
  }

  newBooking() {
    const b: CreateBooking = {
      pid: this.listingPid(),
      start: this.bookingDate[0],
      end: this.bookingDate[1],
    };
    this.bookingService.create(b);
  }

  mapBookedDatesToDate(b: Array<BookedDatesClient>): Array<Date> {
    const d = new Array<Date>();
    for (let date of b) {
      d.push(...this.getDatesInRange(date));
    }
    return d;
  }

  getDatesInRange(d: BookedDatesClient) {
    const dates = Array<Date>();
    let currentDate = d.start;
    while (currentDate <= d.end) {
      dates.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  }
}
