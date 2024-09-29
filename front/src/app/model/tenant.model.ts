import { Dayjs } from "dayjs"
import { DisplayPicture, PriceValue } from "./listing.model"

export interface BookedListing {
    location: string,
    cover: DisplayPicture,
    totalPrice: PriceValue,
    dates: BookedDatesServer,
    bookingPid: string,
    listingPid: string,
    loading: boolean
}

export interface BookedDatesClient {
    start: Dayjs,
    end: Dayjs
}

export interface BookedDatesServer {
    start: Date,
    end: Date
}

export interface CreateBooking extends BookedDatesServer {
    pid: string
}