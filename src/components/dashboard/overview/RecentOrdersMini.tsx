"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/contexts/cart-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Package, Truck, CheckCircle2 } from 'lucide-react';

export interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string | Date;
  status: 'Placed' | 'Processing' | 'Packing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  items: Omit<CartItem, 'id'>[];
}

export interface RecentOrdersMiniProps {
  orders: RecentOrder[];
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('ZAR', 'R');
};

const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

function StatusBadge({ status }: { status: RecentOrder['status'] }) {
  const styles: Record<string, string> = {
    'Placed': 'bg-gray-100 text-gray-500',
    'Processing': 'bg-amber-100 text-amber-700',
    'Packing': 'bg-blue-100 text-blue-700',
    'Dispatched': 'bg-purple-100 text-purple-700',
    'Delivered': 'bg-teal-100 text-teal-700',
    'Cancelled': 'bg-red-100 text-red-700'
  };

  const icons: Record<string, React.ReactNode> = {
    'Processing': <Package size={12} />,
    'Dispatched': <Truck size={12} />,
    'Delivered': <CheckCircle2 size={12} />
  };

  return (
    <span className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit",
      styles[status] || 'bg-gray-100 text-gray-500'
    )}>
      {icons[status] || null}
      {status}
    </span>
  );
}

export function RecentOrdersMini({ orders, isLoading }: RecentOrdersMiniProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleReorder = (e: React.MouseEvent, items: Omit<CartItem, 'id'>[]) => {
    e.stopPropagation();
    items.forEach(item => addToCart(item));
    toast.success("Items added to cart");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] bg-white border border-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-sm text-gray-500">No orders yet.</div>
    );
  }

  // Last 3 orders
  const displayOrders = orders.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Recent Orders</h3>
        <Link 
          href="/dashboard/orders"
          className="text-sm font-medium text-[#1c3a2a] hover:underline"
        >
          View all &rarr;
        </Link>
      </div>

      <div className="space-y-3">
        {displayOrders.map((order) => (
          <div 
            key={order.id}
            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
            className="group bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:border-[#1c3a2a]/30 transition-all gap-4 sm:gap-0"
          >
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="min-w-[100px]">
                <div className="text-sm font-mono font-medium text-[#1a1f1a]">
                  {order.orderNumber}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(order.date)}
                </div>
              </div>

              <div className="hidden md:block min-w-[120px]">
                <StatusBadge status={order.status} />
              </div>

              <div className="text-sm font-medium text-[#1a1f1a]">
                {formatCurrency(order.totalAmount)}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0 border-t border-gray-100 sm:border-0 pt-3 sm:pt-0">
              <div className="md:hidden">
                <StatusBadge status={order.status} />
              </div>
              <button
                onClick={(e) => handleReorder(e, order.items)}
                className="text-[11px] font-bold text-[#1c3a2a] hover:bg-[#1c3a2a]/5 px-4 py-2 rounded-md transition-colors uppercase tracking-widest"
              >
                Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
