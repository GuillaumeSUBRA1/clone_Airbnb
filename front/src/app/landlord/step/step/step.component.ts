import { Component, EventEmitter, input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Step } from 'src/app/model/step.model';

@Component({
  selector: 'step',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class StepComponent {

  currentStep = input.required<Step>();
  loading = input<boolean>(false);
  allValid = input<boolean>(false);
  labelFinished = input<string>("Finish");

  @Output() finishEvent = new EventEmitter<boolean>();
  @Output() previousEvent = new EventEmitter<boolean>();
  @Output() nextEvent = new EventEmitter<boolean>();

  finish(){
    this.finishEvent.emit(true);
  }

  previous(){
    this.previousEvent.emit(true);
  }
  
  next(){
    this.nextEvent.emit(true);
  }

  
}
