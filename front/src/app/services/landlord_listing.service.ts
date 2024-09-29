import { HttpClient, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { CardListing, CreatedListing, NewListing } from "../model/listing.model";
import { State } from "../model/state.model";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class LandlordListingService {
    http = inject(HttpClient);
    constructor() { }

    private createWritable: WritableSignal<State<CreatedListing>> = signal(State.Builder<CreatedListing>().forInit());
    createSignal = computed(() => this.createWritable());

    private getAllWritable: WritableSignal<State<Array<CardListing>>> = signal(State.Builder<Array<CardListing>>().forInit());
    getAllSignal = computed(() => this.getAllWritable());

    private deleteWritable: WritableSignal<State<string>> = signal(State.Builder<string>().forInit());
    deleteSignal = computed(() => this.deleteWritable());

    create(newListing: NewListing): void {
        const data = new FormData();
        for (let i = 0; i < newListing.picture.length; i++) {
            data.append("picture-" + i, newListing.picture[i].file);
        }
        const clone = structuredClone(newListing);
        clone.picture = [];
        data.append("dto", JSON.stringify(newListing));
        this.http.post<CreatedListing>(`${environment.API_URL}/landlord/create`, data)
            .subscribe({
                next: l => this.createWritable.set(State.Builder<CreatedListing>().forSuccess(l)),
                error: e => this.createWritable.set(State.Builder<CreatedListing>().forError(e))
            });
    }

    getAll() {
        this.http.get<Array<CardListing>>(`${environment.API_URL}/landlord/get-all`)
            .subscribe({
                next: a => this.getAllWritable.set(State.Builder<Array<CardListing>>().forSuccess(a)),
                error: e => this.getAllWritable.set(State.Builder<Array<CardListing>>().forError(e))
            })
    }

    delete(pid: string) {
        const params = new HttpParams().set("pid", pid);
        this.http.delete<string>(`${environment.API_URL}/landlord/delete`, { params })
            .subscribe({
                next: pid => this.deleteWritable.set(State.Builder<string>().forSuccess(pid)),
                error: e => this.deleteWritable.set(State.Builder<string>().forError(e))
            })
    }

    resetListing() {
        this.createWritable.set(State.Builder<CreatedListing>().forInit());
    }

    resetDelete() {
        this.deleteWritable.set(State.Builder<string>().forInit());
    }
}  