// ─── Dashboard shared types ───────────────────────────────────────────────────
// Used across overview components and mock data.

export interface SpendKpiData {
  /** Sum of all non-cancelled orders (ZAR) */
  totalLifetimeSpend: number;
  /** Sum of non-cancelled orders placed in the current calendar month (ZAR) */
  spentThisMonth: number;
  /** Percentage change vs. last month — positive = up, negative = down */
  spendDeltaPct: number;
  /** Total number of orders ever placed (all statuses) */
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
  /** MongoDB _id or equivalent */
  id: string;
  /** Human-readable, e.g. "#ORD-992120" */
  orderNumber: string;
  date: string | Date;
  status: OrderStatus;
  /** Total order value in ZAR */
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
  /** Full message string including any emoji prefix */
  message: string;
  /** Optional — makes the message a clickable link */
  href?: string;
}
