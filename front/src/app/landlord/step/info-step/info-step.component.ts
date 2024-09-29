import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { NewListingInfo } from 'src/app/model/listing.model';
import { InfoStepControlComponent } from "./info-step-control/info-step-control.component";

export type Control = "GUEST" | "BEDROOM" | "BED" | "BATH";

@Component({
  selector: 'info-step',
  standalone: true,
  imports: [FormsModule, ButtonModule, FontAwesomeModule, InfoStepComponent, InfoStepControlComponent],
  templateUrl: './info-step.component.html'
})
export class InfoStepComponent {

  infos = input.required<NewListingInfo>();

  @Output() infoEvent = new EventEmitter<NewListingInfo>();
  @Output() stepValidated = new EventEmitter<boolean>();

  onInfoChange(newValue: number, type: Control) {
    switch (type) {
      case "BATH":
        this.infos().bath = { value: newValue }
        break;
      case "BEDROOM":
        this.infos().bedroom = { value: newValue }
        break;
      case "BED":
        this.infos().bed = { value: newValue }
        break;
      case "GUEST":
        this.infos().guest = { value: newValue }
        break;
    }
    this.infoEvent.emit(this.infos());
    this.stepValidated.emit(this.validationRules());
  }

  validationRules(): boolean {
    return this.infos().guest.value > 0;
  }
}
