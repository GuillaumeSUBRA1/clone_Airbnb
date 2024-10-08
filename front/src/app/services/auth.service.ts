import { HttpClient, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Location } from '@angular/common';
import { State } from '../model/state.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  location = inject(Location);
  notConnected = "NOT_CONNECTED";

  private fetchUserWritable: WritableSignal<State<User>> = signal(State.Builder<User>().forSuccess({ email: this.notConnected }));
  fetchUser = computed(() => this.fetchUserWritable());

  fetch(forceResync: boolean) {
    this.fetchHttpUser(forceResync)
      .subscribe({
        next: u => this.fetchUserWritable.set(State.Builder<User>().forSuccess(u)),
        error: e => {
          if (e.status === HttpStatusCode.Unauthorized && this.isAuthenticated()) {
            this.fetchUserWritable.set(State.Builder<User>().forSuccess({ email: this.notConnected }))
          } else {
            this.fetchUserWritable.set(State.Builder<User>().forError(e));
          }
        },
      });
  }

  isAuthenticated(): boolean {
    if (this.fetchUserWritable().value) {
      return this.fetchUserWritable().value!.email !== this.notConnected;
    }
    return false;
  }

  login() {
    location.href = `${location.origin}${this.location.prepareExternalUrl("oauth2/authorization/okta")}`;
  }

  logout() {
    this.http.post(`${environment.API_URL}/auth/logout`, {}).subscribe(
      {
        next: () => {
          this.fetchUserWritable.set(State.Builder<User>().forSuccess({ email: this.notConnected }));
          location.href = environment.API_URL;
        },
      }
    );
  }

  fetchHttpUser(forceResync: boolean): Observable<User> {
    const params = new HttpParams().set('forceResync', forceResync);
    return this.http.get<User>(`${environment.API_URL}/auth/get_authenticated_user`, { params });
  }

  hasAuthority(authorities: string[] | string): boolean {
    if (this.fetchUserWritable().value!.email === this.notConnected) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.fetchUserWritable().value!.authorities!.some((auth: string) => authorities.includes(auth));
  }
}
