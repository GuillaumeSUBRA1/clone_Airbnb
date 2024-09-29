import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  standalone:true,
  imports : [FaIconComponent],

  styleUrl: './footer.component.scss'
})
export class FooterComponent {}
