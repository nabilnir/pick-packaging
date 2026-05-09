import { Order } from '@/types/orders';

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#ORD-992120',
    date: '2024-04-10T10:30:00Z',
    status: 'Processing',
    totalAmount: 48600.00,
    subtotal: 42260.87,
    vat: 6339.13,
    deliveryFee: 0,
    estimatedDelivery: '2024-04-12',
    vendor: { id: 'v1', name: 'Industrial Pack Co', verified: true },
    paymentMethod: 'Credit Card (Visa)',
    paymentRef: 'PI-992120',
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      line2: 'Unit 4B',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa',
      phone: '+27 21 555 0123'
    },
    items: [
      {
        productId: 'p1',
        name: 'Heavy Duty Shipping Crates',
        sku: 'HDS-001',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg',
        price: 1200,
        quantity: 20,
        packingType: { name: 'Pallet', units: 1, priceMultiplier: 1 }
      },
      {
        productId: 'p2',
        name: 'Industrial Stretch Wrap',
        sku: 'ISW-045',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/processing-23.jpg',
        price: 450,
        quantity: 10,
        packingType: { name: 'Box', units: 6, priceMultiplier: 5.5 }
      }
    ]
  },
  {
    id: '2',
    orderNumber: '#ORD-992119',
    date: '2024-04-08T14:20:00Z',
    status: 'Delivered',
    totalAmount: 12450.00,
    subtotal: 10826.09,
    vat: 1623.91,
    deliveryFee: 0,
    vendor: { id: 'v2', name: 'SecureWrap Ltd', verified: true },
    paymentMethod: 'EFT',
    paymentRef: 'EFT-88912',
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p3',
        name: 'Biodegradable Packing Peanuts',
        sku: 'BPP-990',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/Agriculture-24.jpg',
        price: 85,
        quantity: 50,
        packingType: { name: 'Bag', units: 1, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '3',
    orderNumber: '#ORD-992118',
    date: '2024-04-05T09:15:00Z',
    status: 'Packing',
    totalAmount: 25900.50,
    subtotal: 22522.17,
    vat: 3378.33,
    deliveryFee: 0,
    vendor: { id: 'v3', name: 'Global Logistics Supply', verified: false },
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p4',
        name: 'Reinforced Adhesive Tape',
        sku: 'RAT-112',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg',
        price: 45,
        quantity: 100,
        packingType: { name: 'Box', units: 12, priceMultiplier: 10 }
      }
    ]
  },
  {
    id: '4',
    orderNumber: '#ORD-992117',
    date: '2024-04-02T16:45:00Z',
    status: 'Cancelled',
    totalAmount: 8900.00,
    subtotal: 7739.13,
    vat: 1160.87,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p5',
        name: 'Bubble Wrap Rolls (Small)',
        sku: 'BWR-002',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/processing-23.jpg',
        price: 220,
        quantity: 10,
        packingType: { name: 'Roll', units: 1, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '5',
    orderNumber: '#ORD-992116',
    date: '2024-04-01T11:00:00Z',
    status: 'Placed',
    totalAmount: 15750.00,
    subtotal: 13695.65,
    vat: 2054.35,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p6',
        name: 'Corrugated Cardboard Sheets',
        sku: 'CCS-556',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/Agriculture-24.jpg',
        price: 15,
        quantity: 500,
        packingType: { name: 'Pack', units: 50, priceMultiplier: 45 }
      }
    ]
  },
  {
    id: '6',
    orderNumber: '#ORD-992115',
    date: '2024-03-28T13:40:00Z',
    status: 'Delivered',
    totalAmount: 34200.00,
    subtotal: 29739.13,
    vat: 4460.87,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p7',
        name: 'Plastic Strapping Kit',
        sku: 'PSK-009',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg',
        price: 3420,
        quantity: 10,
        packingType: { name: 'Kit', units: 1, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '7',
    orderNumber: '#ORD-992114',
    date: '2024-03-25T15:20:00Z',
    status: 'Delivered',
    totalAmount: 6780.00,
    subtotal: 5895.65,
    vat: 884.35,
    deliveryFee: 150,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p8',
        name: 'Shipping Labels (Thermal)',
        sku: 'SLT-101',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/processing-23.jpg',
        price: 180,
        quantity: 20,
        packingType: { name: 'Roll', units: 500, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '8',
    orderNumber: '#ORD-992113',
    date: '2024-03-20T08:50:00Z',
    status: 'Processing',
    totalAmount: 18900.00,
    subtotal: 16434.78,
    vat: 2465.22,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p9',
        name: 'Edge Protectors (Cardboard)',
        sku: 'EPC-441',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/Agriculture-24.jpg',
        price: 12,
        quantity: 1000,
        packingType: { name: 'Bundle', units: 50, priceMultiplier: 48 }
      }
    ]
  },
  {
    id: '9',
    orderNumber: '#ORD-992112',
    date: '2024-03-15T12:10:00Z',
    status: 'Dispatched',
    totalAmount: 52000.00,
    subtotal: 45217.39,
    vat: 6782.61,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p10',
        name: 'Industrial Pallet Rack System',
        sku: 'IPR-998',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg',
        price: 52000,
        quantity: 1,
        packingType: { name: 'Unit', units: 1, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '10',
    orderNumber: '#ORD-992111',
    date: '2024-03-10T14:30:00Z',
    status: 'Delivered',
    totalAmount: 2450.00,
    subtotal: 2130.43,
    vat: 319.57,
    deliveryFee: 150,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p11',
        name: 'Fragile Stickers (Roll)',
        sku: 'FSR-001',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/processing-23.jpg',
        price: 45,
        quantity: 50,
        packingType: { name: 'Roll', units: 1, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '11',
    orderNumber: '#ORD-992110',
    date: '2024-03-05T09:45:00Z',
    status: 'Delivered',
    totalAmount: 11200.00,
    subtotal: 9739.13,
    vat: 1460.87,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p12',
        name: 'Heavy Duty Box Cutter',
        sku: 'HBC-772',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/Agriculture-24.jpg',
        price: 112,
        quantity: 100,
        packingType: { name: 'Unit', units: 1, priceMultiplier: 1 }
      }
    ]
  },
  {
    id: '12',
    orderNumber: '#ORD-992109',
    date: '2024-03-01T16:15:00Z',
    status: 'Delivered',
    totalAmount: 7850.00,
    subtotal: 6826.09,
    vat: 1023.91,
    deliveryFee: 0,
    shippingAddress: {
      fullName: 'John Smith',
      line1: '123 Business Way',
      city: 'Cape Town',
      postalCode: '8001',
      country: 'South Africa'
    },
    items: [
      {
        productId: 'p13',
        name: 'Stretch Wrap Dispenser',
        sku: 'SWD-005',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg',
        price: 1570,
        quantity: 5,
        packingType: { name: 'Unit', units: 1, priceMultiplier: 1 }
      }
    ]
  }
];
