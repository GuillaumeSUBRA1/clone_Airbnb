import { Component, EventEmitter, input, Output } from '@angular/core';
import { LocationMapComponent } from "./location-map/location-map.component";

@Component({
  selector: 'location-step',
  standalone: true,
  imports: [LocationMapComponent],
  templateUrl: './location-step.component.html'
})
export class LocationStepComponent {
  location = input.required<string>();
  @Output() locationChangeEvent = new EventEmitter<string>();
  @Output() stepValidatedEvent = new EventEmitter<boolean>();

  locationChange(l:string){
    this.locationChangeEvent.emit(l);
    this.stepValidatedEvent.emit(true);
  }
}
