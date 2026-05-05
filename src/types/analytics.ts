// Analytics type definitions

export interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  activeCustomers: number;
  revenueDelta: number;       // % vs prior period
  ordersDelta: number;
  aovDelta: number;
  customersDelta: number;
}

export interface RevenuePoint {
  date: string;               // ISO date string
  grossRevenue: number;
  netRevenue: number;
}

export interface OrderDay {
  date: string;
  fulfilled: number;
  pending: number;
  cancelled: number;
}

export interface OrderAnalyticsData {
  daily: OrderDay[];
  fulfillmentRate: number;    // 0–100
  avgProcessingHours: number;
  cancellationRate: number;   // 0–100
  totalOrders: number;
  byStatus: { status: string; count: number; fill: string }[];
}

export interface SegmentData {
  segments: { name: string; value: number; fill: string }[];
}

export interface CustomerRow {
  rank: number;
  name: string;
  orders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface SkuRow {
  name: string;
  revenue: number;
  sector: 'food-service' | 'agriculture' | 'industrial';
}

export interface SectorRow {
  sector: string;
  unitsSold: number;
  revenue: number;
}

export interface VendorRow {
  name: string;
  ordersFulfilled: number;
  slaRate: number;            // 0–100
  revenueContributed: number;
  verified: boolean;
  status: 'Active' | 'Audit Required' | 'Suspended';
}

export interface FunnelStage {
  name: string;
  value: number;
  fill: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}
