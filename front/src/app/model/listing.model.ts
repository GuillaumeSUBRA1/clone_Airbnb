import { CategoryName } from "./category.model";

export interface BedroomValue {
    value: number;
}
export interface BedValue {
    value: number;
}
export interface BathValue {
    value: number;
}
export interface GuestValue {
    value: number;
}
export interface TitleValue {
    value: string;
}
export interface DescriptionValue {
    value: string;
}
export interface PriceValue {
    value: number;
}

export interface NewListingInfo {
    guest: GuestValue,
    bedroom: BedroomValue,
    bed: BedValue,
    bath: BathValue
}

export interface NewListingPicture {
    file: File,
    url: string
}

export interface NewListing {
    category: CategoryName,
    location: string,
    infos: NewListingInfo,
    picture: Array<NewListingPicture>
    description: Description,
    price: PriceValue
}

export interface Description {
    title: TitleValue,
    description: DescriptionValue
}


export interface CreatedListing {
    publicId: string
}

export interface DisplayPicture {
    file?: string,
    fileContentType?: string,
    isCover?: boolean
}

export interface CardListing {
    price: PriceValue,
    location: string,
    cover: DisplayPicture,
    category: CategoryName,
    pid: string,
    loading: boolean
}

export interface Listing{
    description : Description,
    pictures: Array<DisplayPicture>,
    infos: NewListingInfo,
    price:PriceValue,
    category:CategoryName,
    location: string,
    landlord: LandlordListing
}

export interface LandlordListing{
    firstname:string,
    image:string
}