export enum RoleEnum{
    LANDLORD = "ROLE_LANDLORD",
    ADMIN = "ROLE_ADMIN",
    TENANT = "ROLE_TENANT"
}

export interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
    authorities?: string[];
}