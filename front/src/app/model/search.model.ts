import { NewListingInfo } from "./listing.model";
import { BookedDatesServer } from "./tenant.model";

export interface Search{
    location: string,
    dates: BookedDatesServer,
    infos: NewListingInfo
}