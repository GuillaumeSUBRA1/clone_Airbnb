import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'logo',
  templateUrl: './logo.component.html',
  standalone:true,
  imports:[FaIconComponent,NgClass],
  styleUrl: './logo.component.scss'
})
export class LogoComponent {
  logoSize = input<"logo-sm"|"logo-xl">();
  logoUrl = input<string>();
}
