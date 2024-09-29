import { HttpClient, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { State } from "../model/state.model";
import { BookedDatesClient, BookedDatesServer, BookedListing, CreateBooking } from "../model/tenant.model";
import { environment } from "src/environments/environment.development";
import * as dayjs from "dayjs";
import { map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    http = inject(HttpClient);

    private createWritable: WritableSignal<State<boolean>> = signal(State.Builder<boolean>().forInit());
    createSignal = computed(() => this.createWritable());

    private checkAvailableWritable: WritableSignal<State<Array<BookedDatesClient>>> = signal(State.Builder<Array<BookedDatesClient>>().forInit());
    checkAvailableSignal = computed(() => this.checkAvailableWritable());

    private getBookedListingWritable: WritableSignal<State<Array<BookedListing>>> = signal(State.Builder<Array<BookedListing>>().forInit());
    getBookedListingSignal = computed(() => this.getBookedListingWritable());

    private cancelWritable: WritableSignal<State<string>> = signal(State.Builder<string>().forInit());
    cancelSignal = computed(() => this.cancelWritable());

    private getBookedListingLandlordWritable: WritableSignal<State<Array<BookedListing>>> = signal(State.Builder<Array<BookedListing>>().forInit());
    getBookedListingLandlordSignal = computed(() => this.getBookedListingLandlordWritable());

    constructor() { }

    create(c: CreateBooking) {
        this.http.post<boolean>(`${environment.API_URL}/booking/create`, c)
            .subscribe({
                next: c => this.createWritable.set(State.Builder<boolean>().forSuccess(c)),
                error: e => this.createWritable.set(State.Builder<boolean>().forError(e))
            });
    }

    checkAvailable(pid: string) {
        const params = new HttpParams().set("listingPid", pid);
        console.log(pid);
        this.http.get<Array<BookedDatesServer>>(`${environment.API_URL}/booking/check-available`, { params })
            .pipe(
                map(this.mapDayToDayjs())
            )
            .subscribe({
                next: a => { console.log(a); this.checkAvailableWritable.set(State.Builder<Array<BookedDatesClient>>().forSuccess(a)) },
                error: e => this.checkAvailableWritable.set(State.Builder<Array<BookedDatesClient>>().forError(e))
            });
    }

    getBookedListing() {
        this.http.get<Array<BookedListing>>(`${environment.API_URL}/booking/get`)
            .subscribe({
                next: b => this.getBookedListingWritable.set(State.Builder<Array<BookedListing>>().forSuccess(b)),
                error: e => this.getBookedListingWritable.set(State.Builder<Array<BookedListing>>().forError(e))
            });
    }

    getBookedListingLandlord() {
        this.http.get<Array<BookedListing>>(`${environment.API_URL}/booking/get-landlord`)
            .subscribe({
                next: b => this.getBookedListingLandlordWritable.set(State.Builder<Array<BookedListing>>().forSuccess(b)),
                error: e => this.getBookedListingLandlordWritable.set(State.Builder<Array<BookedListing>>().forError(e))
            });
    }

    cancel(bookingPid: string, listingPid: string, isLandlord: boolean) {
        const params = new HttpParams().set("bookingPid", bookingPid).set("listingPid", listingPid).set("isLandlord", isLandlord);
        this.http.delete<string>(`${environment.API_URL}/booking/cancel`, { params })
            .subscribe({
                next: c => this.cancelWritable.set(State.Builder<string>().forSuccess(c)),
                error: e => this.cancelWritable.set(State.Builder<string>().forError(e))
            });
    }

    mapDayToDayjs = () => {
        return (d: Array<BookedDatesServer>): Array<BookedDatesClient> => {
            return d.map(reserved => this.dayToDayjs(reserved))
        }
    }

    dayToDayjs<T extends BookedDatesServer>(d: T): BookedDatesClient {
        return {
            ...d,
            start: dayjs(d.start),
            end: dayjs(d.end),
        };
    }

    resetCreate() {
        this.createWritable.set(State.Builder<boolean>().forInit());
    }

    resetCheckAvailable() {
        this.checkAvailableWritable.set(State.Builder<Array<BookedDatesClient>>().forInit());
    }

    resetCancel() {
        this.cancelWritable.set(State.Builder<string>().forInit());
    }

    resetGetBookedListing() {
        this.getBookedListingWritable.set(State.Builder<Array<BookedListing>>().forInit());
    }
}  