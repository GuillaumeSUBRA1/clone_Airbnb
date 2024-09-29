import { HttpClient, HttpParams } from "@angular/common/http";
import { computed, inject, Injectable, signal, WritableSignal } from "@angular/core";
import { CardListing, CreatedListing, Listing } from "../model/listing.model";
import { State } from "../model/state.model";
import { createPaginationOption, Page, Pagination } from "../model/request.model";
import { CategoryName } from "../model/category.model";
import { environment } from "src/environments/environment.development";
import { Subject } from "rxjs";
import { Search } from "../model/search.model";

@Injectable({
    providedIn: 'root'
})
export class TenantListingService {

    http = inject(HttpClient);

    private getAllByCategoryWritable: WritableSignal<State<Page<CardListing>>> = signal(State.Builder<Page<CardListing>>().forInit());
    getAllCategorySignal = computed(() => this.getAllByCategoryWritable());

    private getOneWritable: WritableSignal<State<Listing>> = signal(State.Builder<Listing>().forInit());
    getOneSignal = computed(() => this.getOneWritable());

    private searchSubject: Subject<State<Page<CardListing>>> = new Subject<State<Page<CardListing>>>();
    searchObservable = this.searchSubject.asObservable();

    constructor() { }

    getAllByCategory(pageRequest: Pagination, c: CategoryName) {
        let params = createPaginationOption(pageRequest);
        params = params.set("category", c);
        this.http.get<Page<CardListing>>(`${environment.API_URL}/tenant/get-all-by-category`, { params })
            .subscribe({
                next: l => this.getAllByCategoryWritable.set(State.Builder<Page<CardListing>>().forSuccess(l)),
                error: e => this.getAllByCategoryWritable.set(State.Builder<Page<CardListing>>().forError(e))
            })
    }

    getOne(pid: string) {
        let params = new HttpParams().set("pid", pid);
        this.http.get<Listing>(`${environment.API_URL}/tenant/get-one`, { params })
            .subscribe({
                next: l => this.getOneWritable.set(State.Builder<Listing>().forSuccess(l)),
                error: e => this.getOneWritable.set(State.Builder<Listing>().forError(e))
            });
    }

    search(search: Search, pageRequest: Pagination) {
        const params = createPaginationOption(pageRequest)
        this.http.post<Page<CardListing>>(`${environment.API_URL}/tenant/search`, search, { params })
            .subscribe({
                next: l => this.searchSubject.next(State.Builder<Page<CardListing>>().forSuccess(l)),
                error: e => this.searchSubject.next(State.Builder<Page<CardListing>>().forError(e))
            });
    }

    resetCategory() {
        this.getAllByCategoryWritable.set(State.Builder<Page<CardListing>>().forInit());
    }

    resetGetOne() {
        this.getOneWritable.set(State.Builder<Listing>().forInit());
    }
}
