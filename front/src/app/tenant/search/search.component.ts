import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocationMapComponent } from 'src/app/landlord/step/location-step/location-map/location-map.component';
import { NewListingInfo } from 'src/app/model/listing.model';
import { Search } from 'src/app/model/search.model';
import { SearchEnum, Step } from 'src/app/model/step.model';
import { BookedDatesServer } from 'src/app/model/tenant.model';
import { StepComponent } from "../../landlord/step/step/step.component";
import { SearchDateComponent } from "./search-date/search-date.component";
import { InfoStepComponent } from "../../landlord/step/info-step/info-step.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [LocationMapComponent, StepComponent, SearchDateComponent, InfoStepComponent],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  steps: Step[] = [
    {
      id: SearchEnum.LOCATION,
      idNext: SearchEnum.DATES,
      idPrevious: null,
      isValid: false
    },
    {
      id: SearchEnum.DATES,
      idNext: SearchEnum.GUESTS,
      idPrevious: SearchEnum.LOCATION,
      isValid: false
    },
    {
      id: SearchEnum.GUESTS,
      idNext: null,
      idPrevious: SearchEnum.DATES,
      isValid: false
    }
  ];

  currentStep = this.steps[0];

  newSearch: Search = {
    dates: {
      start: new Date(),
      end: new Date(),
    },
    infos: {
      guest: { value: 0 },
      bed: { value: 0 },
      bedroom: { value: 0 },
      bath: { value: 0 }
    },
    location: ""
  };

  loading = false;
  dialogDynamicRef = inject(DynamicDialogRef);
  router = inject(Router);

  nextStep() {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext!)[0];
    }
  }

  previousStep() {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious!)[0];
    }
  }

  allStepsValid(): boolean {
    return this.steps.filter(s => !s.isValid).length === 0;
  }

  onStepValidated(v: boolean) {
    this.currentStep.isValid = v;
  }

  onLocationChange(l: string) {
    this.currentStep.isValid = true;
    this.newSearch.location = l;
  }

  onDateChange(d: BookedDatesServer) {
    this.newSearch.dates = d;
  }

  onInfoChange(i: NewListingInfo) {
    this.newSearch.infos = i;
  }

  search() {
    this.loading = false;
    this.router.navigate(["/"],
      {
        queryParams: {
          location: this.newSearch.location,
          guest: this.newSearch.infos.guest.value,
          bed: this.newSearch.infos.bed.value,
          bath: this.newSearch.infos.bath.value,
          bedroom: this.newSearch.infos.bedroom.value,
          startDate: dayjs(this.newSearch.dates.start).format("YYYY-MM-DD"),
          endDate: dayjs(this.newSearch.dates.end).format("YYYY-MM-DD")
        }
      }
    );
    this.dialogDynamicRef.close();
  }
}
