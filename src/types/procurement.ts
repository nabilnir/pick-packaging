// ─── Procurement Types ────────────────────────────────────────────────────────

export type PickupStatus = 'PENDING' | 'CONFIRMED' | 'COLLECTED';

export interface VendorPickup {
    id: string;
    orderRef: string;
    vendorName: string;
    vendorAddress: string;
    contactPhone: string;
    items: PickupLineItem[];
    status: PickupStatus;
    windowStart: string; // HH:mm
    windowEnd: string;   // HH:mm
    estimatedWeight: number; // kg
    notes?: string;
}

export interface PickupLineItem {
    sku: string;
    description: string;
    qty: number;
    unitWeight: number; // kg
}
