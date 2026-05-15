export type StopStatus = 'upcoming' | 'current' | 'completed' | 'failed';

export interface StopLineItem {
    sku: string;
    productName: string;
    qty: number;
}

export interface DeliveredLineItem extends StopLineItem {
    deliveredQty: number;
    shortageReason?: string;
}

export interface PODRecord {
    id: string;
    stopId: string;
    receivedByName: string;
    recipientRole?: string;
    signatureDataUrl: string;
    photoDataUrl: string;
    deliveredItems: DeliveredLineItem[];
    submittedAt: string;
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
    podRecord?: PODRecord;
    failureReason?: string;
}
