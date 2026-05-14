// ─── Inventory Item (one physical SKU on the vehicle) ─────────────────────────
export type DeliveryStatus = 'LOADED' | 'DELIVERED' | 'FAILED';
export type InventoryStatus = 'PENDING' | 'PARTIAL' | 'COMPLETE' | 'RETURN';
export type ItemCondition = 'GOOD' | 'DAMAGED' | 'PARTIALLY_DAMAGED';

export type DamageType = 'Crushed' | 'Wet damage' | 'Torn packaging' | 'Missing labels' | 'Contamination' | 'Other';
export type DamageSeverity = 'Minor' | 'Moderate' | 'Severe';
export type DamageResponsibility = 'Vendor' | 'In transit' | 'Unknown';

export interface DamageReport {
    id: string;
    itemId: string;
    type: DamageType;
    qtyAffected: number;
    severity: DamageSeverity;
    description?: string;
    photoDataUrl?: string;
    responsibility: DamageResponsibility;
    reportedAt: string;
}

export type ReturnReason = 'Undeliverable' | 'Damaged' | 'Wrong item' | 'Overstock';

export interface ReturnRecord {
    id: string;
    itemId: string;
    reason: ReturnReason;
    qtyToReturn: number;
    vendorName: string;
    vendorAddress: string;
    returnWindow: string;
    reportedAt: string;
}

export interface InventoryItem {
    id:          string;
    poNumber:    string;          // links back to a pickup order
    sku:         string;
    productName: string;
    productImage?: string;
    vendorName:  string;
    qtyOrdered:  number;          // what was originally expected
    qtyLoaded:   number;          // what was actually collected
    qtyDelivered:number;
    unitWeightKg:number;
    recipient:   string;         // primary buyer company name
    destinations: string[];      // list of company names this item goes to
    deliveryAddress: string;
    status:      DeliveryStatus;
    invStatus:   InventoryStatus;
    condition:   ItemCondition;
    damagedCount?: number;
    damageReports?: DamageReport[];
    returnRecord?: ReturnRecord;
    deliveredAt?: string;        // ISO timestamp
    failureNote?: string;
}

// ─── Vehicle profile snippet ───────────────────────────────────────────────────
export interface VehicleProfile {
    registration: string;
    type:         string;        // e.g. "1-ton Bakkie"
    maxWeightKg:  number;
}
