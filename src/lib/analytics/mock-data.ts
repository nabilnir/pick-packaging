import { subDays, format, eachDayOfInterval } from 'date-fns';
import type {
  KpiData, RevenuePoint, OrderAnalyticsData, SegmentData,
  CustomerRow, SkuRow, SectorRow, VendorRow, FunnelStage,
} from '@/types/analytics';

const today = new Date();

// ── Helpers ────────────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ── KPI ───────────────────────────────────────────────────────────────────
export const mockKpi: KpiData = {
  totalRevenue:      1_248_400,
  totalOrders:       312,
  avgOrderValue:     4_001,
  activeCustomers:   87,
  revenueDelta:      12.4,
  ordersDelta:       8.1,
  aovDelta:          -2.3,
  customersDelta:    5.7,
};

// ── Revenue (30 days) ─────────────────────────────────────────────────────
export const mockRevenue: RevenuePoint[] = eachDayOfInterval({
  start: subDays(today, 29),
  end:   today,
}).map(d => {
  const gross = rand(18_000, 72_000);
  return {
    date:         d.toISOString(),
    grossRevenue: gross,
    netRevenue:   Math.round(gross * rand(68, 82) / 100),
  };
});

// ── Orders ────────────────────────────────────────────────────────────────
const orderDays = eachDayOfInterval({ start: subDays(today, 29), end: today });

export const mockOrderAnalytics: OrderAnalyticsData = {
  daily: orderDays.map(d => ({
    date:      d.toISOString(),
    fulfilled: rand(4, 18),
    pending:   rand(1, 6),
    cancelled: rand(0, 3),
  })),
  fulfillmentRate:     87.4,
  avgProcessingHours:  6.2,
  cancellationRate:    4.1,
  totalOrders:         312,
  byStatus: [
    { status: 'Fulfilled', count: 272, fill: '#12271D' },
    { status: 'Pending',   count: 27,  fill: '#F59E0B' },
    { status: 'Cancelled', count: 13,  fill: '#EF4444' },
  ],
};

// ── Customer Segments ─────────────────────────────────────────────────────
export const mockSegments: SegmentData = {
  segments: [
    { name: 'Active',    value: 87, fill: '#12271D' },
    { name: 'Inactive',  value: 24, fill: '#A8A59C' },
    { name: 'Suspended', value: 6,  fill: '#EF4444' },
  ],
};

export const mockTopCustomers: CustomerRow[] = [
  { rank: 1, name: 'Priya Naidoo',   orders: 27, totalSpent: 48_600, status: 'Active'    },
  { rank: 2, name: 'Faith Okonkwo',  orders: 18, totalSpent: 22_400, status: 'Active'    },
  { rank: 3, name: 'Amara Dlamini',  orders: 12, totalSpent: 14_820, status: 'Active'    },
  { rank: 4, name: 'Yuki Tanaka',    orders: 9,  totalSpent: 11_200, status: 'Active'    },
  { rank: 5, name: 'Liam van Wyk',   orders: 4,  totalSpent:  3_240, status: 'Inactive'  },
];

// ── Product Performance ───────────────────────────────────────────────────
export const mockTopSkus: SkuRow[] = [
  { name: 'Heavy Duty Corrugated Box 600x400',  revenue: 98_400,  sector: 'industrial'   },
  { name: 'Food-Safe Kraft Liner Roll 500m',     revenue: 87_200,  sector: 'food-service' },
  { name: 'AgriPack Ventilated Crate L',         revenue: 74_100,  sector: 'agriculture'  },
  { name: 'Biodegradable Bubble Wrap 100m',      revenue: 62_500,  sector: 'industrial'   },
  { name: 'Thermal Insulated Box 300x200',        revenue: 55_800,  sector: 'food-service' },
  { name: 'Harvest Bin Pallet Liner XL',          revenue: 44_300,  sector: 'agriculture'  },
  { name: 'Stretch Film 500mm × 300m',            revenue: 38_700,  sector: 'industrial'   },
  { name: 'Freezer-Safe Poly Bag 5kg',            revenue: 29_100,  sector: 'food-service' },
];

export const mockSectorData: SectorRow[] = [
  { sector: 'Food Service', unitsSold: 1_840, revenue: 172_100 },
  { sector: 'Agriculture',  unitsSold: 1_230, revenue: 118_400 },
  { sector: 'Industrial',   unitsSold: 2_410, revenue: 199_600 },
];

// ── Vendors ───────────────────────────────────────────────────────────────
export const mockVendors: VendorRow[] = [
  { name: 'Apex Industrial Cardboard Co.', ordersFulfilled: 24,  slaRate: 98.5, revenueContributed: 312_000, verified: true,  status: 'Active'          },
  { name: 'Global PolyTech',               ordersFulfilled: 12,  slaRate: 91.2, revenueContributed: 98_400,  verified: true,  status: 'Active'          },
  { name: 'Precision Tapes LLC',           ordersFulfilled: 19,  slaRate: 96.8, revenueContributed: 87_000,  verified: true,  status: 'Active'          },
  { name: 'ShieldFoam Works',              ordersFulfilled: 11,  slaRate: 88.4, revenueContributed: 62_100,  verified: true,  status: 'Active'          },
  { name: 'SteelStrap Inc.',               ordersFulfilled: 8,   slaRate: 83.1, revenueContributed: 44_200,  verified: true,  status: 'Active'          },
  { name: 'EcoKraft Paper',                ordersFulfilled: 2,   slaRate: 74.0, revenueContributed: 18_600,  verified: false, status: 'Audit Required'  },
  { name: 'ClearPack Solutions',           ordersFulfilled: 0,   slaRate: 0.0,  revenueContributed: 0,        verified: false, status: 'Suspended'       },
];

// ── Funnel ────────────────────────────────────────────────────────────────
export const mockFunnelStages: FunnelStage[] = [
  { name: 'Sessions',          value: 12_480, fill: '#12271D' },
  { name: 'Product Views',     value:  7_920, fill: '#2D4A3E' },
  { name: 'Cart Adds',         value:  2_840, fill: '#4A7060' },
  { name: 'Checkout Started',  value:    980, fill: '#7A9E90' },
  { name: 'Orders Placed',     value:    312, fill: '#BFC0AC' },
];
