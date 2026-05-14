// ─── Inventory Item (one physical SKU on the vehicle) ─────────────────────────
export type DeliveryStatus = 'LOADED' | 'DELIVERED' | 'FAILED';

export interface InventoryItem {
    id:          string;
    poNumber:    string;          // links back to a pickup order
    sku:         string;
    productName: string;
    qtyLoaded:   number;
    qtyDelivered:number;
    unitWeightKg:number;
    recipient:   string;         // buyer company name
    deliveryAddress: string;
    status:      DeliveryStatus;
    deliveredAt?: string;        // ISO timestamp
    failureNote?: string;
}

// ─── Vehicle profile snippet ───────────────────────────────────────────────────
export interface VehicleProfile {
    registration: string;
    type:         string;        // e.g. "1-ton Bakkie"
    maxWeightKg:  number;
}
