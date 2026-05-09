// ─── Dashboard shared types ───────────────────────────────────────────────────

export interface SpendKpiData {
  totalLifetimeSpend: number;
  spentThisMonth: number;
  spendDeltaPct: number;
  totalOrdersPlaced: number;
}

export type OrderStatus =
  | 'Placed'
  | 'Processing'
  | 'Packing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface RecentOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  quantity: number;
  packingType: {
    name: string;
    units: number;
    priceMultiplier: number;
  };
  volume?: string;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string | Date;
  status: OrderStatus;
  totalAmount: number;
  items: RecentOrderItem[];
}

export interface WishlistPreview {
  id: string;
  image: string;
  name: string;
}

export interface Announcement {
  id: string;
  message: string;
  href?: string;
}

// ─── Full Order (for /dashboard/orders) ──────────────────────────────────────

export interface OrderLineItem {
  productId: string;
  name: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  packingType: {
    name: string;
    units: number;
    priceMultiplier: number;
  };
  volume?: string;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  /** MongoDB _id or equivalent */
  id: string;
  /** Human-readable e.g. "#ORD-992120" */
  orderNumber: string;
  date: string | Date;
  status: OrderStatus;
  /** Grand total in ZAR */
  totalAmount: number;
  /** Pre-tax subtotal */
  subtotal: number;
  /** VAT amount (15%) */
  vat: number;
  /** Delivery fee */
  deliveryFee: number;
  /** ISO date string, optional */
  estimatedDelivery?: string;
  shippingAddress: ShippingAddress;
  vendor?: { name: string; verified: boolean };
  /** e.g. "EFT", "Credit Card" */
  paymentMethod?: string;
  /** e.g. "#TXN-4421" */
  paymentRef?: string;
  items: OrderLineItem[];
}
