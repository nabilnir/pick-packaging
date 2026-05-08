"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { RecentOrder, OrderStatus } from '@/types/dashboard';

export type { RecentOrder };

export interface RecentOrdersMiniProps {
  orders: RecentOrder[];
  isLoading: boolean;
}

/** R48,600 — no space, comma thousands */
const fmt = (value: number) =>
  'R' +
  new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const fmtDate = (d: string | Date) =>
  new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(typeof d === 'string' ? new Date(d) : d);

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    Placed:     'bg-gray-100 text-gray-500',
    Processing: 'bg-amber-100 text-amber-700',
    Packing:    'bg-blue-100 text-blue-700',
    Dispatched: 'bg-purple-100 text-purple-700',
    Delivered:  'bg-teal-100 text-teal-700',
    Cancelled:  'bg-red-100 text-red-700',
  };
  const icons: Partial<Record<OrderStatus, React.ReactNode>> = {
    Processing: <Package size={11} />,
    Dispatched: <Truck size={11} />,
    Delivered:  <CheckCircle2 size={11} />,
  };
  return (
    <span
      className={cn(
        'flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit',
        styles[status]
      )}
    >
      {icons[status] ?? null}
      {status}
    </span>
  );
}

export function RecentOrdersMini({ orders, isLoading }: RecentOrdersMiniProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleReorder = (e: React.MouseEvent, order: RecentOrder) => {
    e.stopPropagation();
    order.items.forEach(item => addToCart({ ...item, id: undefined as any }));
    toast.success('Items added to cart');
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-14" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[68px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No orders yet.</p>
    );
  }

  return (
    <div>
      {/* Section label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          Recent Orders
        </span>
        <Link
          href="/dashboard/orders"
          className="text-sm font-medium text-[#1c3a2a] hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 3).map(order => (
          <div
            key={order.id}
            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
            className="group bg-white border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:border-[#1c3a2a]/30 transition-colors gap-3 sm:gap-0"
          >
            <div className="flex items-center gap-6 flex-wrap">
              <div className="min-w-[104px]">
                <p className="text-sm font-mono font-semibold text-[#1a1f1a]">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fmtDate(order.date)}
                </p>
              </div>
              <div className="hidden md:block">
                <StatusBadge status={order.status} />
              </div>
              <p className="text-sm font-medium text-[#1a1f1a]">
                {fmt(order.totalAmount)}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-border sm:border-0 pt-3 sm:pt-0">
              <div className="md:hidden">
                <StatusBadge status={order.status} />
              </div>
              <button
                onClick={e => handleReorder(e, order)}
                className="text-[11px] font-bold uppercase tracking-widest text-[#1c3a2a] hover:bg-[#1c3a2a]/5 px-3 py-1.5 rounded-md transition-colors"
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
