import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { State } from '../model/state.model';
import { Country } from '../model/country.model';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  http = inject(HttpClient);

  private countriesSignal: WritableSignal<State<Array<Country>>> = signal(State.Builder<Array<Country>>().forInit());
  countries = computed(() => this.countriesSignal());

  private fetchCountryObservable = new Observable<Array<Country>>();

  constructor() {
    this.initFetchCountries();
    this.fetchCountryObservable.subscribe();
  }

  initFetchCountries() {
    this.fetchCountryObservable = this.http.get<Array<Country>>("/assets/countries.json")
      .pipe(
        tap(c =>
          this.countriesSignal.set(
            State.Builder<Array<Country>>().forSuccess(c)
          )
        ),
        catchError(e => {
          this.countriesSignal.set(
            State.Builder<Array<Country>>().forError(e)
          );
          return of(e);
        }),
        shareReplay(1)
      );
  }

  getCountryByCode(code: string): Observable<Country> {
    return this.fetchCountryObservable.pipe(
      map(c => c.filter(ct => ct.cca3 === code)),
      map(c => c[0])
    );
  }
}
