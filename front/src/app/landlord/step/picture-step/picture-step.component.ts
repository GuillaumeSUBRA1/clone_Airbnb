import { Component, EventEmitter, input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NewListingPicture } from 'src/app/model/listing.model';

@Component({
  selector: 'picture-step',
  standalone: true,
  imports: [FontAwesomeModule, InputTextModule, ButtonModule],
  templateUrl: './picture-step.component.html',
  styleUrl: './picture-step.component.scss'
})
export class PictureStepComponent {
  pictures = input.required<Array<NewListingPicture>>();
  @Output() picturesEvent = new EventEmitter<Array<NewListingPicture>>();
  @Output() stepValidatedEvent = new EventEmitter<boolean>();

  extractFileFromTarget(target: EventTarget | null) {
    const file = target as HTMLInputElement;
    if (target === null || file.files === null) {
      return null;
    }
    return file.files;
  }

  uploadNewPicture(target: EventTarget | null) {
    const picturesFileList = this.extractFileFromTarget(target);
    if (picturesFileList !== null) {
      for (let i = 0; i < picturesFileList.length; i++) {
        const p = picturesFileList.item(i);
        if (p !== null) {
          const displayPic: NewListingPicture = {
            file: p,
            url: URL.createObjectURL(p)
          }
          this.pictures().push(displayPic);
        }
      }
      this.picturesEvent.emit(this.pictures());
      this.validatePictures();
    }
  }

  deletePicture(p: NewListingPicture) {
    const index = this.pictures().indexOf(p);
    this.pictures().splice(index, 1);
    this.validatePictures();
  }

  validatePictures() {
    this.stepValidatedEvent.emit(this.pictures().length > 4);
  }
}
