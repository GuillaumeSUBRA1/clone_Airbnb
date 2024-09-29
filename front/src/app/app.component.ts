import { Component, OnInit, inject } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { ToastService } from './services/toast.service';
import { MessageService } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FooterComponent } from './footer/footer.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, FontAwesomeModule, NavigationBarComponent, FooterComponent, ToastModule],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  faIconLibrary = inject(FaIconLibrary);
  toastService = inject(ToastService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.initFontAwesome();
    this.listenToast();
  }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private listenToast() {
    this.toastService.sendObservable.subscribe({
      next: message => {
        if (message && message.summary !== this.toastService.INIT) {
          this.messageService.add(message);
        }
      }
    });
  }
}
