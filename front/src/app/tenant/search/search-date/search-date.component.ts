import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BookedDatesServer } from 'src/app/model/tenant.model';

@Component({
  selector: 'search-date',
  standalone: true,
  imports: [CalendarModule, FormsModule],
  templateUrl: './search-date.component.html'
})
export class SearchDateComponent {
  dates = input.required<BookedDatesServer>();
  searchDateRaw = new Array<Date>();
  minDate = new Date();

  @Output()
  datesChangeEvent = new EventEmitter<BookedDatesServer>();

  @Output()
  stepValidityChangeEvent = new EventEmitter<boolean>();

  constructor() {
    this.restorePreviousDates();
  }

  dateChange(d: Date[]) {
    this.searchDateRaw = d;
    const valid = this.validateDateSearch();
    this.stepValidityChangeEvent.emit(valid);
    if (valid) {
      const dates: BookedDatesServer = {
        start: this.searchDateRaw[0],
        end: this.searchDateRaw[1]
      };
      this.datesChangeEvent.emit(dates);
    }
  }

  validateDateSearch() {
    return this.searchDateRaw.length === 2 && this.searchDateRaw[0] !== null && this.searchDateRaw[1] !== null
      && this.searchDateRaw[0].getDate() !== this.searchDateRaw[1].getDate();
  }

  restorePreviousDates() {
    effect(() => {
      if (this.dates()) {
        this.searchDateRaw[0] = this.dates().start;
        this.searchDateRaw[1] = this.dates().end;
      }
    });
  }
}
