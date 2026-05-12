import type { PickupOrder } from '@/types/procurement';

// NB: windowEnd times are near-future so the countdown is meaningful.
// In production these come from the API.

export const MOCK_ORDERS: PickupOrder[] = [
    {
        id: 'po-001',
        poNumber: 'PO-4421',
        vendorName: 'PackMaster SA',
        vendorVerified: true,
        vendorPhone: '+27 21 555 0101',
        address: '14 Industrial Ave, Epping Industria, Cape Town, 7460',
        status: 'ASSIGNED',
        windowStart: '08:00',
        windowEnd: '10:30',
        notes: 'Ring buzzer at Gate B. Ask for Thabo.',
        items: [
            { sku: 'KPM-250350', productName: 'Kraft Paper Mailer 250×350mm',  qtyToCollect: 200, unitWeightKg: 0.05 },
            { sku: 'BWR-1000-50', productName: 'Bubble Wrap Roll 1000×50m',     qtyToCollect: 2,   unitWeightKg: 6.25 },
            { sku: 'CEP-50',      productName: 'Cardboard Edge Protectors 50mm', qtyToCollect: 60,  unitWeightKg: 0.12 },
        ],
    },
    {
        id: 'po-002',
        poNumber: 'PO-4422',
        vendorName: 'BoxCo Industries',
        vendorVerified: true,
        vendorPhone: '+27 21 555 0202',
        address: '88 Paarden Eiland Road, Paarden Eiland, Cape Town, 7405',
        status: 'CONFIRMED',
        windowStart: '09:00',
        windowEnd: '11:00',
        items: [
            { sku: 'CBA4-SW',  productName: 'Corrugated Box A4 Single-Wall', qtyToCollect: 150, unitWeightKg: 0.28 },
            { sku: 'CBA3-DW',  productName: 'Corrugated Box A3 Double-Wall', qtyToCollect: 80,  unitWeightKg: 0.42 },
        ],
    },
    {
        id: 'po-003',
        poNumber: 'PO-4423',
        vendorName: 'WrapRight',
        vendorVerified: false,
        vendorPhone: '+27 21 555 0303',
        address: '3 Montague Gardens Boulevard, Montague Gardens, Cape Town, 7441',
        status: 'EN_ROUTE',
        windowStart: '10:00',
        windowEnd: '11:30',
        items: [
            { sku: 'SWF-500300', productName: 'Stretch Wrap Film 500mm×300m',     qtyToCollect: 4,  unitWeightKg: 3.50 },
            { sku: 'PWD-HANDLE', productName: 'Pallet Wrap Dispenser Handle',      qtyToCollect: 2,  unitWeightKg: 0.45 },
        ],
    },
    {
        id: 'po-004',
        poNumber: 'PO-4418',
        vendorName: 'LabelTech',
        vendorVerified: true,
        vendorPhone: '+27 21 555 0404',
        address: '21 Airport Industria, Matroosfontein, Cape Town, 7490',
        status: 'COLLECTED',
        windowStart: '07:00',
        windowEnd: '08:30',
        collectedAt: new Date(new Date().setHours(8, 14, 0, 0)).toISOString(),
        collectedCount: 20,
        items: [
            { sku: 'TLR-100150', productName: 'Thermal Label Roll 100×150mm', qtyToCollect: 20, unitWeightKg: 0.44 },
        ],
    },
    {
        id: 'po-005',
        poNumber: 'PO-4419',
        vendorName: 'StrapSafe',
        vendorVerified: false,
        vendorPhone: '+27 21 555 0505',
        address: '7 Voortrekker Road, Bellville, Cape Town, 7530',
        status: 'MISSED',
        windowStart: '06:30',
        windowEnd: '08:00',
        items: [
            { sku: 'PSB-12MM', productName: 'Polypropylene Strapping Band 12mm', qtyToCollect: 12, unitWeightKg: 2.60 },
        ],
    },
];
