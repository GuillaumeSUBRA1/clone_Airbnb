import { Component, effect, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryName } from 'src/app/model/category.model';
import { CreatedListing, Description, NewListing, NewListingInfo, NewListingPicture, PriceValue } from 'src/app/model/listing.model';
import { State, StatusNotification } from 'src/app/model/state.model';
import { CreationEnum, Step } from 'src/app/model/step.model';
import { AuthService } from 'src/app/services/auth.service';
import { LandlordListingService } from 'src/app/services/landlord_listing.service';
import { ToastService } from 'src/app/services/toast.service';
import { CategoryStepComponent } from '../step/category-step/category-step.component';
import { StepComponent } from '../step/step/step.component';
import { LocationStepComponent } from '../step/location-step/location-step.component';
import { InfoStepComponent } from "../step/info-step/info-step.component";
import { PictureStepComponent } from '../step/picture-step/picture-step.component';
import { DescriptionStepComponent } from '../step/description-step/description-step.component';
import { PriceStepComponent } from '../step/price-step/price-step.component';

@Component({
  selector: 'create-properties',
  standalone: true,
  imports: [CategoryStepComponent, LocationStepComponent, StepComponent, InfoStepComponent, InfoStepComponent, PictureStepComponent, DescriptionStepComponent, PriceStepComponent],
  templateUrl: './create-properties.component.html'
})
export class CreatePropertiesComponent implements OnDestroy {
  dialogDynamicRef = inject(DynamicDialogRef);
  listingService = inject(LandlordListingService);
  toastService = inject(ToastService);
  userService = inject(AuthService);
  router = inject(Router);

  steps: Step[] = [
    {
      id: CreationEnum.CATEGORY,
      idNext: CreationEnum.LOCATION,
      idPrevious: null,
      isValid: false
    },
    {
      id: CreationEnum.LOCATION,
      idNext: CreationEnum.INFO,
      idPrevious: CreationEnum.CATEGORY,
      isValid: false
    },
    {
      id: CreationEnum.INFO,
      idNext: CreationEnum.PHOTOS,
      idPrevious: CreationEnum.LOCATION,
      isValid: false
    },
    {
      id: CreationEnum.PHOTOS,
      idNext: CreationEnum.DESCRIPTION,
      idPrevious: CreationEnum.INFO,
      isValid: false
    },
    {
      id: CreationEnum.DESCRIPTION,
      idNext: CreationEnum.PRICE,
      idPrevious: CreationEnum.PHOTOS,
      isValid: false
    },
    {
      id: CreationEnum.PRICE,
      idNext: null,
      idPrevious: CreationEnum.DESCRIPTION,
      isValid: false
    }
  ];

  currentStep = this.steps[0];

  newListing: NewListing = {
    category: CategoryName.ALL,
    infos: {
      guest: { value: 0 },
      bedroom: { value: 0 },
      bed: { value: 0 },
      bath: { value: 0 },
    },
    location: "",
    picture: new Array<NewListingPicture>(),
    description: {
      title: { value: "" },
      description: { value: "" }
    },
    price: { value: 0 }
  }

  loadingCreation = false;
  creation = CreationEnum;

  constructor() {
    this.listenFetchUser();
    this.listenListingCreation();
  }

  createListing() {
    this.loadingCreation = true;
    this.listingService.create(this.newListing);
  }

  ngOnDestroy(): void {
    this.listingService.resetListing();
  }

  listenListingCreation() {
    effect(() => {
      let createListingState = this.listingService.createSignal();
      if (createListingState.status === StatusNotification.OK) {
        this.isCreateOk(createListingState);
      } else if (createListingState.status === StatusNotification.ERROR) {
        this.isCreateError();
      }
    });
  }

  listenFetchUser() {
    effect(() => {
      if (this.userService.fetchUser().status === StatusNotification.OK &&
        this.listingService.createSignal().status === StatusNotification.OK) {
        this.router.navigate(["landlord", "properties"]);
      }
    });
  }

  isCreateOk(l: State<CreatedListing>) {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "success", summary: "Success", detail: "Listing created successfully."
    });
    this.dialogDynamicRef.close(l.value?.publicId);
    this.userService.fetch(true);
  }

  isCreateError() {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "error", summary: "Error", detail: "Couldn't create you listing, please try again."
    });
  }

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

  onCategoryChange(c: CategoryName) {
    this.newListing.category = c;
  }

  onLocationChange(l: string) {
    this.newListing.location = l;
  }

  onStepValidated(v: boolean) {
    this.currentStep.isValid = v;
  }

  onInfoChange(i: NewListingInfo) {
    this.newListing.infos = i;
  }

  onPictureChange(p: NewListingPicture[]) {
    this.newListing.picture = p;
  }

  onDescriptionChange(d: Description) {
    this.newListing.description = d;
  }

  onPriceChange(p: PriceValue) {
    this.newListing.price = p;
  }
}
