export type StopStatus = 'upcoming' | 'current' | 'completed' | 'failed';

export interface StopLineItem {
    sku: string;
    productName: string;
    qty: number;
}

export interface DeliveryStop {
    id: string;
    stopNumber: number;
    status: StopStatus;
    companyName: string;
    address: string;
    contactName?: string;
    contactPhone?: string;
    items: StopLineItem[];
    etaTime: string;            // e.g. "14:20"
    arrivalMins?: number;       // live countdown in minutes (current stop)
    deliveredAt?: string;       // e.g. "11:42"
    podPhotoUrl?: string;       // proof of delivery photo URL
    failureReason?: string;
}
