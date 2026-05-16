export type StopStatus = 'upcoming' | 'current' | 'completed' | 'failed';

export interface StopItem {
    sku: string;
    productName: string;
    qty: number;
}

export interface DeliveredItem extends StopItem {
    deliveredQty: number;
    shortageReason?: string;
}

export interface PODRecord {
    receivedBy: string;
    receiverRole?: string;
    signatureBase64: string;
    photoUrl: string;
    deliveredItems: DeliveredItem[];
    timestamp: string;
}

export interface DeliveryStop {
    id: string;
    sequence: number; // Stop number
    companyName: string;
    address: string;
    contactName?: string;
    contactPhone?: string;
    items: StopItem[];
    status: StopStatus;
    estimatedArrival: string;
    arrivedAt?: string;
    completedAt?: string;
    failedReason?: string;
    podRecord?: PODRecord;
}

export interface RouteProgress {
    completedStops: number;
    totalStops: number;
    distanceRemainingKm: number;
    currentEta: string;
}
