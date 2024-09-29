import { Component, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {InputTextareaModule} from "primeng/inputtextarea";
import { InputTextModule } from 'primeng/inputtext';
import { Description } from 'src/app/model/listing.model';

@Component({
  selector: 'description-step',
  standalone: true,
  imports: [InputTextModule,FormsModule,InputTextareaModule],
  templateUrl: './description-step.component.html',
  styleUrl: './description-step.component.scss'
})
export class DescriptionStepComponent {
  description = input.required<Description>();

  @Output() descriptionChangeEvent = new EventEmitter<Description>();
  @Output() stepValidatedEvent = new EventEmitter<boolean>();

  @ViewChild("formDescription")  formDescription: NgForm|undefined;

  titleChange(t:string){
    this.description().title = {value:t};
    this.descriptionChangeEvent.emit(this.description());
    this.stepValidatedEvent.emit(this.formValidated());
  }

  descriptionChange(d:string){
    this.description().description = {value:d};
    this.descriptionChangeEvent.emit(this.description());
    this.stepValidatedEvent.emit(this.formValidated());
  }

  formValidated():boolean{
    if (this.formDescription) {
      return this.formDescription?.valid!;
    }
    return false;
  }

}
