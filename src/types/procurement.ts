// ─── Procurement Types ────────────────────────────────────────────────────────

export type PickupStatus =
    | 'ASSIGNED'
    | 'CONFIRMED'
    | 'EN_ROUTE'
    | 'COLLECTED'
    | 'MISSED';

export type FilterStatus = 'ALL' | PickupStatus;

// ─── Single SKU line item ─────────────────────────────────────────────────────
export interface PickupLineItem {
    sku:           string;
    productName:   string;
    qtyToCollect:  number;
    unitWeightKg:  number;
}

// ─── Full pickup order ────────────────────────────────────────────────────────
export interface PickupOrder {
    id:              string;
    poNumber:        string;          // e.g. "PO-4421"
    vendorName:      string;
    vendorVerified:  boolean;
    vendorPhone:     string;          // international format "+27…"
    address:         string;
    status:          PickupStatus;
    windowStart:     string;          // "HH:mm"
    windowEnd:       string;          // "HH:mm"
    items:           PickupLineItem[];
    collectedAt?:    string;          // ISO timestamp, set on COLLECTED
    collectedCount?: number;          // units verified at collection
    notes?:          string;
}

// ─── Cancellation / miss reasons ─────────────────────────────────────────────
export const MISS_REASONS = [
    'Vendor not available',
    'Location inaccessible',
    'Vehicle breakdown',
    'Items not ready',
    'Safety concern',
    'Other',
] as const;

export type MissReason = typeof MISS_REASONS[number];
