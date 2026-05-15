export type ItemCondition = 'good' | 'damaged' | 'partially_damaged';
export type ManifestStatus = 'pending' | 'partial' | 'complete' | 'return';

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

export interface ManifestItem {
    id: string;
    sku: string;
    productName: string;
    vendorName: string;
    thumbnailUrl: string;
    collectedQty: number;
    deliveredQty: number;
    remainingQty: number;
    maxWeightKg: number;
    unitWeightKg: number;
    condition: ItemCondition;
    status: ManifestStatus;
    destinations: string[];
    damageReport?: DamageReport;
    returnRecord?: ReturnRecord;
}
