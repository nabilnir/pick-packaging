import type {
  SpendKpiData,
  RecentOrder,
  WishlistPreview,
  Announcement,
} from '@/types/dashboard';

// ─── Announcements ────────────────────────────────────────────────────────────
export const mockAnnouncements: Announcement[] = [
  {
    id: 'packrite-verified',
    message: '🎉 New vendor Packrite now verified — explore industrial packaging →',
    href: '/shop?vendor=packrite',
  },
  {
    id: 'free-delivery',
    message: '🚚 Free delivery on all orders over R2,500 this month — shop now →',
    href: '/shop',
  },
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────
export const mockSpendKpis: SpendKpiData = {
  totalLifetimeSpend: 48_600,
  spentThisMonth: 7_200,
  spendDeltaPct: 12,          // +12% vs last month
  totalOrdersPlaced: 14,
};

// ─── Recent orders ────────────────────────────────────────────────────────────
export const mockRecentOrders: RecentOrder[] = [
  {
    id: '664a1f2b8e3c7d0012ab1001',
    orderNumber: '#ORD-992120',
    date: '2026-05-02T09:14:00Z',
    status: 'Processing',
    totalAmount: 3_840,
    items: [
      {
        productId: 'prod-001',
        name: 'Heavy-Duty Corrugated Box 600×400',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-1.jpg',
        price: 38,
        currency: 'ZAR',
        quantity: 2,
        packingType: { name: 'Pallet', units: 50, priceMultiplier: 1 },
      },
      {
        productId: 'prod-002',
        name: 'Vacuum Seal Pouches 1L',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-2.jpg',
        price: 12,
        currency: 'ZAR',
        quantity: 5,
        packingType: { name: 'Carton', units: 100, priceMultiplier: 0.9 },
        volume: '1L',
      },
    ],
  },
  {
    id: '664a1f2b8e3c7d0012ab1002',
    orderNumber: '#ORD-881034',
    date: '2026-04-24T14:05:00Z',
    status: 'Delivered',
    totalAmount: 1_560,
    items: [
      {
        productId: 'prod-003',
        name: 'Kraft Paper Bags 5kg',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-3.jpg',
        price: 8.5,
        currency: 'ZAR',
        quantity: 3,
        packingType: { name: 'Bundle', units: 60, priceMultiplier: 1 },
      },
    ],
  },
  {
    id: '664a1f2b8e3c7d0012ab1003',
    orderNumber: '#ORD-774561',
    date: '2026-04-11T10:30:00Z',
    status: 'Delivered',
    totalAmount: 5_280,
    items: [
      {
        productId: 'prod-004',
        name: 'HDPE Drum Liners 220L',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-4.jpg',
        price: 55,
        currency: 'ZAR',
        quantity: 4,
        packingType: { name: 'Pallet', units: 24, priceMultiplier: 1 },
      },
    ],
  },
];

// ─── Wishlist previews ────────────────────────────────────────────────────────
export const mockWishlistPreviews: WishlistPreview[] = [
  {
    id: 'wl-001',
    name: 'Stretch Wrap Film 500mm',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-1.jpg',
  },
  {
    id: 'wl-002',
    name: 'Foam Corner Protectors',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-2.jpg',
  },
  {
    id: 'wl-003',
    name: 'Tamper-Evident Tape 50m',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-3.jpg',
  },
  {
    id: 'wl-004',
    name: 'Biodegradable Bubble Wrap',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/product-4.jpg',
  },
];
