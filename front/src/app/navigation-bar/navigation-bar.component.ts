import { Component, OnInit, effect, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { RoleEnum, User } from '../model/user.model';
import { CreatePropertiesComponent } from '../landlord/create-properties/create-properties.component';
import { LogoComponent } from './logo/logo.component';
import { CategoriesComponent } from './categories/categories.component';
import { FaIconComponent, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { StatusNotification } from '../model/state.model';
import { SearchComponent } from '../tenant/search/search.component';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';

@Component({
  selector: 'navigation-bar',
  templateUrl: './navigation-bar.component.html',
  standalone: true,
  imports: [
    LogoComponent,
    CategoriesComponent,
    FontAwesomeModule,
    ToolbarModule,
    MenuModule,
    ButtonModule,
    FaIconComponent],
  styleUrl: './navigation-bar.component.scss',
  providers: [DialogService]
})
export class NavigationBarComponent implements OnInit {
  location = "Where";
  guests = "Who";
  dates = "When";

  toastService = inject(ToastService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  activatedRoute = inject(ActivatedRoute);
  dialogRef: DynamicDialogRef | undefined;

  onglets = ["Where", "Who", "When"];
  menuItems: MenuItem[] = [];
  connectedUser: User = { email: this.authService.notConnected };

  login = () => this.authService.login();
  logout = () => this.authService.logout();

  constructor() {
    effect(() => {
      if (this.authService.fetchUser().status === StatusNotification.OK) {
        this.connectedUser = this.authService.fetchUser().value!;
        this.menuItems = this.fecthMenu();
      }
    })
  }

  ngOnInit() {
    this.authService.fetch(false);
    this.extractInfoFromSearch();
  }

  private fecthMenu(): MenuItem[] {
    return this.authService.isAuthenticated() ?
      [
        {
          label: "My properties",
          routerLink: "landlord/properties",
          visible: this.isLandLord()
        },
        {
          label: "My booking",
          routerLink: "booking"
        },
        {
          label: "My reservation",
          routerLink: "landlord/reservation",
          visible: this.isLandLord()
        },
        {
          label: "Logout",
          command: this.logout
        },
      ] :
      [
        {
          label: "Sign up",
          styleClass: "font-bold",
          command: this.login
        },
        {
          label: "Log in",
          command: this.login
        }
      ];
  }

  isLandLord(): boolean {
    return this.authService.hasAuthority(RoleEnum.LANDLORD);
  }

  openNewListing() {
    this.dialogRef = this.dialogService.open(
      CreatePropertiesComponent,
      {
        width: "60%",
        header: "Airbnb your home",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true
      }
    )
  }

  openNewSearch(){
    this.dialogRef = this.dialogService.open(
      SearchComponent,
      {
        width:"40%",
        header:"Search",
        closable:true,
        focusOnShow:true,
        modal:true,
        showHeader:true
      }
    );
  }

  extractInfoFromSearch(){
    this.activatedRoute.queryParams.subscribe({
      next:p =>{
        if(p["location"]){
          this.location = p["location"];
          this.guests = p["guest"] +" guests";
          this.dates = dayjs(p["startDate"]).format("MMM-DD") +" to "+dayjs(p["endDate"]).format("MMM-DD");
        } else if(this.location!=="Anywhere"){
          this.location = this.onglets[0];
          this.guests = this.onglets[1];
          this.dates = this.onglets[2];
        }
      }
    })
  }
}
