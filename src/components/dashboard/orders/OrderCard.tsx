"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  MoreHorizontal,
  Check,
  BadgeCheck,
  FileText,
  ShoppingCart,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Order, OrderStatus } from '@/types/dashboard';

export interface OrderCardProps {
  order: Order;
  defaultExpanded?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtR = (n: number) =>
  'R' + new Intl.NumberFormat('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string | Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-ZA', opts).format(typeof d === 'string' ? new Date(d) : d);

const CANCELLABLE: OrderStatus[] = ['Placed', 'Processing'];
const STEPS: OrderStatus[] = ['Placed', 'Processing', 'Packing', 'Dispatched', 'Delivered'];

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<OrderStatus, string> = {
  Placed:     'bg-gray-100 text-gray-600',
  Processing: 'bg-amber-100 text-amber-700',
  Packing:    'bg-blue-100 text-blue-700',
  Dispatched: 'bg-purple-100 text-purple-700',
  Delivered:  'bg-teal-100 text-teal-700',
  Cancelled:  'bg-red-100 text-red-600',
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', STATUS_STYLES[status])}>
      {status}
    </span>
  );
}

// ─── Order stepper ────────────────────────────────────────────────────────────
function OrderStepper({ status }: { status: OrderStatus }) {
  const currentIdx = STEPS.indexOf(status as any);
  const isCancelled = status === 'Cancelled';

  return (
    <div className="relative py-6">
      {/* Track background */}
      <div className="absolute top-[34px] left-[16px] right-[16px] h-[2px] bg-gray-100" />
      {/* Track fill */}
      {!isCancelled && currentIdx > 0 && (
        <div
          className="absolute top-[34px] left-[16px] h-[2px] bg-[#1c3a2a] transition-all duration-500"
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />
      )}
      <div className="relative flex justify-between">
        {STEPS.map((step, idx) => {
          const done   = !isCancelled && idx < currentIdx;
          const active = !isCancelled && idx === currentIdx;
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all',
                  done   ? 'bg-[#1c3a2a] border-[#1c3a2a] text-white'           : '',
                  active ? 'border-[#1c3a2a] bg-white text-[#1c3a2a] shadow-[0_0_0_3px_rgba(28,58,42,0.12)]' : '',
                  !done && !active ? 'bg-white border-gray-200 text-gray-300'   : '',
                )}
              >
                {done
                  ? <Check size={13} strokeWidth={3} />
                  : <div className={cn('w-2 h-2 rounded-full', active ? 'bg-[#1c3a2a] animate-pulse' : 'bg-gray-200')} />
                }
              </div>
              <p className={cn('text-[10px] font-bold uppercase tracking-widest', active ? 'text-[#1c3a2a]' : 'text-gray-400')}>
                {step === 'Dispatched' ? 'Dispatch' : step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function OrderCard({ order, defaultExpanded = false }: OrderCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { addToCart } = useCart();
  const router = useRouter();

  const cancellable = CANCELLABLE.includes(order.status);
  const showArrival = !['Delivered', 'Cancelled'].includes(order.status);

  const handleReorder = () => {
    order.items.forEach(item =>
      addToCart({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        currency: 'ZAR',
        packingType: item.packingType,
        volume: item.volume,
        quantity: item.quantity,
      })
    );
    toast.success('Items added to cart');
  };

  const handleDownloadInvoice = () => {
    // Triggers download via API route — adjust path as needed
    window.open(`/api/orders/${order.id}/invoice`, '_blank');
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap md:flex-nowrap items-center gap-4 p-5 cursor-pointer select-none"
        onClick={() => setExpanded(prev => !prev)}
      >
        {/* Order number + date */}
        <div className="min-w-[140px]">
          <p className="font-mono font-bold text-sm text-[#1a1f1a]">{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(order.date)}</p>
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">
          <StatusBadge status={order.status} />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Total */}
        <p className="font-semibold text-sm text-[#1a1f1a]">{fmtR(order.totalAmount)}</p>

        {/* Actions: prevent expand/collapse from firing */}
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-muted-foreground">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-2 cursor-pointer">
                  <FileText size={14} />
                  View full details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadInvoice} className="flex items-center gap-2 cursor-pointer">
                <FileText size={14} />
                Download invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReorder} className="flex items-center gap-2 cursor-pointer">
                <ShoppingCart size={14} />
                Reorder
              </DropdownMenuItem>
              {cancellable && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
                    <XCircle size={14} />
                    Request cancellation
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chevron */}
          <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-muted-foreground" aria-label="Expand order">
            <ChevronDown
              size={18}
              className={cn('transition-transform duration-300', expanded ? 'rotate-180' : '')}
            />
          </button>
        </div>
      </div>

      {/* ── Stepper + arrival ──────────────────────────────────────────────── */}
      <div className="px-5 border-t border-border/60">
        <OrderStepper status={order.status} />
        {showArrival && order.estimatedDelivery && (
          <p className="text-xs text-muted-foreground pb-4 -mt-2">
            Expected Arrival:{' '}
            <span className="font-medium text-[#1a1f1a]">
              {fmtDate(order.estimatedDelivery, { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </p>
        )}
      </div>

      {/* ── Expanded panel ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0">

            {/* Left: Items list */}
            <div className="p-5 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-3">
                Items Ordered
              </p>

              <div className="space-y-3">
                {order.items.map((item, idx) => {
                  const lineTotal = item.price * item.packingType.units * item.packingType.priceMultiplier * item.quantity;
                  return (
                    <div key={`${item.productId}-${idx}`} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-md border border-border overflow-hidden shrink-0 bg-gray-50">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1f1a] leading-tight truncate">{item.name}</p>
                        {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {fmtR(item.price * item.packingType.units * item.packingType.priceMultiplier)}
                        </p>
                        <p className="text-sm font-medium text-[#1a1f1a]">{fmtR(lineTotal)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="pt-4 border-t border-border space-y-2">
                {[
                  { label: 'Subtotal',   value: order.subtotal },
                  { label: 'VAT (15%)',  value: order.vat },
                  { label: 'Delivery',   value: order.deliveryFee },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm text-muted-foreground">
                    <span>{label}</span>
                    <span>{fmtR(value)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold text-[#1a1f1a] pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{fmtR(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Right: Meta */}
            <div className="p-5 border-t lg:border-t-0 lg:border-l border-border space-y-5">

              {/* Shipping address */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-2">
                  Shipping Address
                </p>
                <p className="text-sm text-[#1a1f1a] font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Vendor */}
              {order.vendor && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
                    Vendor
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-[#1a1f1a]">
                    {order.vendor.name}
                    {order.vendor.verified && (
                      <BadgeCheck size={14} className="text-teal-500" aria-label="Verified" />
                    )}
                  </div>
                </div>
              )}

              {/* Payment */}
              {order.paymentMethod && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
                    Payment
                  </p>
                  <p className="text-sm text-[#1a1f1a]">
                    {order.paymentMethod}
                    {order.paymentRef && <span className="text-muted-foreground"> · Ref {order.paymentRef}</span>}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full py-2.5 border border-border rounded-md text-[11px] font-bold uppercase tracking-widest text-[#1a1f1a] hover:bg-gray-50 transition-colors"
                >
                  Download Invoice
                </button>
                <button
                  onClick={handleReorder}
                  className="w-full py-2.5 bg-[#1c3a2a] text-white rounded-md text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Reorder
                </button>
                {cancellable && (
                  <button className="w-full pt-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                    Request cancellation
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
