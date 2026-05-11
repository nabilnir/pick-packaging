export type AddressType = 'SHIPPING' | 'BILLING' | 'BOTH';

export interface Address {
    _id: string;
    userEmail: string;
    fullName: string;
    companyName?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string; // "South Africa"
    phone?: string;
    type: AddressType;
    isPrimary: boolean;
    orderCount?: number; // Used for deletion warning
}
