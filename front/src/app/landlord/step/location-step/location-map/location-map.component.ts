import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { tileLayer, latLng, circle, polygon, LatLng, marker } from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Country } from 'src/app/model/country.model';
import { StatusNotification } from 'src/app/model/state.model';
import { CountryService } from 'src/app/services/country.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'location-map',
  standalone: true,
  imports: [
    AutoCompleteModule,
    FormsModule,
    LeafletModule
  ],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.scss'
})
export class LocationMapComponent {
  countryService = inject(CountryService);
  toastService = inject(ToastService);

  private map: L.Map | undefined;
  private provider: OpenStreetMapProvider | undefined;

  location = input.required<string>();
  placeholder = input<string>("Select your home country");
  currentLoaction: Country | undefined;

  @Output() locationEvent = new EventEmitter<string>();

  formatLabel = (c: Country) => c.flag + "   " + c.name.common;

  constructor() {
    this.listenToLocation();
  }

  options = {
    layers: [
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "..." }),
    ],
    zoom: 5,
    center: latLng(46.87996, -121.726909)
  }

  layersControl = {
    baseLayers: {
      "Open Street Map": tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "..." })
    },
    overlays: {
      "Big circle": circle([46.95, -122], { radius: 5000 }),
      "Big square": polygon([[46.95, -122], [46.95, -122], [46.95, -122], [46.95, -122]]),
    }
  }

  countries: Array<Country> = [];
  filteredCountries: Array<Country> = [];

  isMapReady(map: L.Map) {
    this.map = map;
    this.configSearchControl();
  }

  private configSearchControl() {
    this.provider = new OpenStreetMapProvider();
  }

  locationChange(e: AutoCompleteSelectEvent) {
    const newCountry = e.value as Country;
    this.locationEvent.emit(newCountry.cca3);
  }

  private listenToLocation() {
    effect(() => {
      const countriesState = this.countryService.countries();
      if (countriesState.status === StatusNotification.OK && countriesState.value) {
        this.countries = countriesState.value;
        this.filteredCountries = countriesState.value;
        this.locationMapChange(this.location());
      } else if (countriesState.status === StatusNotification.ERROR) {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Something went wrong while loading countries on change location"
        })
      }

    });
  }

  locationMapChange(term: string) {
    this.currentLoaction = this.countries.find(c => c.cca3 === term);
    if (this.currentLoaction) {
      this.provider!.search({ query: this.currentLoaction.name.common })
        .then((res) => {
          if (res && res.length > 0) {
            const first = res[0];
            this.map!.setView(new LatLng(first.y, first.x), 13);
            marker([first.y, first.x])
              .addTo(this.map!)
              .bindPopup(first.label)
              .openPopup();
          }
        })
    }
  }

  search(e: AutoCompleteCompleteEvent) {
    this.filteredCountries = this.countries.filter(c => c.name.common.toLowerCase().startsWith(e.query));
  }

}
