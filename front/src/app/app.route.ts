import { Routes } from "@angular/router";
import { PropertiesComponent } from "./landlord/properties/properties.component";
import { authorityRouteAccess } from "./core/authorithy-route-access";
import { HomeComponent } from "./home/home.component";
import { DisplayListingComponent } from "./tenant/display-listing/display-listing.component";
import { BookedListingComponent } from "./tenant/booked-listing/booked-listing.component";
import { ReservationComponent } from "./landlord/reservation/reservation.component";
import { RoleEnum } from "./model/user.model";

export const routes: Routes = [
    {
        path:'',
        component:HomeComponent
    },
    {
        path:'landlord/properties',
        component:PropertiesComponent,
        canActivate:[authorityRouteAccess],
        data:{
            autorithies : [RoleEnum.LANDLORD]
        }
    },
    {
        path:'listing',
        component: DisplayListingComponent
    },
    {
        path:'booking',
        component: BookedListingComponent
    },
    {
        path:"landlord/reservation",
        component:ReservationComponent,
        canActivate:[authorityRouteAccess],
        data:{
            authorities:[RoleEnum.LANDLORD]
        }
    }

];