// ─── Address Type ─────────────────────────────────────────────────────────────
export type AddressType = 'shipping' | 'billing' | 'both';

// ─── Full Address (persisted) ─────────────────────────────────────────────────
export interface Address {
    id: string;
    fullName: string;
    company?: string;
    phone?: string;
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string; // Always "South Africa" for now
    type: AddressType;
    isPrimary: boolean;
    usedInOrderCount: number;
}

// ─── Payload for create / update ─────────────────────────────────────────────
export type AddressPayload = Omit<Address, 'id' | 'usedInOrderCount'>;
