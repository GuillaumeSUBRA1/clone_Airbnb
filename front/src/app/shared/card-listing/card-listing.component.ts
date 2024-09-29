import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CardListing } from 'src/app/model/listing.model';
import { BookedListing } from 'src/app/model/tenant.model';
import { CategoryService } from 'src/app/services/category.service';
import { CountryService } from 'src/app/services/country.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'card-listing',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, FaIconComponent],
  templateUrl: './card-listing.component.html',
  styleUrl: './card-listing.component.scss'
})
export class CardListingComponent {
  listing = input.required<CardListing | BookedListing>();
  cardMode = input<"landlord" | "booking">();

  @Output() deleteEvent = new EventEmitter<CardListing>();
  @Output() cancelEvent = new EventEmitter<BookedListing>();

  booking?: BookedListing;
  card?: CardListing;

  router = inject(Router);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);

  constructor() {
    this.listenListing();
    this.listenCardMode();
  }

  listenListing() {
    effect(() => {
      const l = this.listing();
      this.countryService.getCountryByCode(l.location)
        .subscribe({
          next: c => {
            if (l) {
              this.listing().location = c.region + ", " + c.name.common
            }
          }
        });
    });
  }

  listenCardMode() {
    effect(() => {
      const c = this.cardMode();
      if (c && c === "booking") {
        this.booking = this.listing() as BookedListing;
      } else {
        this.card = this.listing() as CardListing;
      }
    });
  }

  delete(c: CardListing) {
    this.deleteEvent.emit(c);
  }

  cancel(b: BookedListing) {
    this.cancelEvent.emit(b);
  }

  clickCard(pid: string) {
    this.router.navigate(['listing'], { queryParams: { id: pid } });
  }
}
