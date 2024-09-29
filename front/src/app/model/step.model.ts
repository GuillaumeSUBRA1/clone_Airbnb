export interface Step{
    id:string,
    idNext?:string | null,
    idPrevious?:string | null,
    isValid:boolean
}

export enum CreationEnum{
    CATEGORY = "category",
    LOCATION = "location",
    INFO = "info",
    PHOTOS = "photo",
    DESCRIPTION = "description",
    PRICE = "price"
}

export enum SearchEnum{
    LOCATION = "location",
    DATES = "date",
    GUESTS = "guest"
}