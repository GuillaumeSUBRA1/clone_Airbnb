import { Component, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputTextModule } from 'primeng/inputtext';
import { PriceValue } from 'src/app/model/listing.model';

@Component({
  selector: 'price-step',
  standalone: true,
  imports: [FormsModule, InputTextModule, FontAwesomeModule],
  templateUrl: './price-step.component.html',
  styleUrl: './price-step.component.scss'
})
export class PriceStepComponent {
  price = input.required<PriceValue>();

  @Output() priceChangeEvent = new EventEmitter<PriceValue>();
  @Output() stepValidatedEvent = new EventEmitter<boolean>();

  @ViewChild("formPrice") formPrice: NgForm | undefined;

  priceChange(p: number) {
    this.priceChangeEvent.emit(this.price());
    this.stepValidatedEvent.emit(this.formValidated());
  }

  formValidated(): boolean {
    if (this.formPrice) {
      return this.formPrice?.valid!;
    }
    return false;
  }

}
