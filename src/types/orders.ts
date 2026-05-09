export type OrderStatus = 'Placed' | 'Processing' | 'Packing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderVendor {
  id: string;
  name: string;
  image?: string;
  verified?: boolean;
}

export interface PackingType {
  name: string;
  units: number;
  priceMultiplier: number;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  packingType: PackingType;
  volume?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string | Date;
  status: OrderStatus;
  totalAmount: number;
  subtotal: number;
  vat: number;
  deliveryFee: number;
  items: OrderLineItem[];
  shippingAddress: ShippingAddress;
  vendor?: OrderVendor;
  paymentMethod?: string;
  paymentRef?: string;
  estimatedDelivery?: string | Date;
}

export interface OrderFilters {
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  vendors?: string[];
}

export type CancellationReason = 
  | 'Ordered by mistake' 
  | 'Duplicate order' 
  | 'Changed vendor' 
  | 'Price too high' 
  | 'Other';
