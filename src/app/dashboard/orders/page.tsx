"use client";

import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    ShoppingBag,
    ChevronRight,
    LayoutDashboard,
    Heart,
    MapPin,
    User,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

import { OrdersToolbar, type OrderFilters } from '@/components/dashboard/orders/OrdersToolbar';
import { OrderCard } from '@/components/dashboard/orders/OrderCard';
import type { Order, OrderStatus } from '@/types/dashboard';

// ─── Nav ─────────────────────────────────────────────────────────────────────
const USER_NAV = [
    { label: 'Overview',   href: '/dashboard',            icon: LayoutDashboard },
    { label: 'My Orders',  href: '/dashboard/orders',     icon: ShoppingBag },
    { label: 'Wishlist',   href: '/dashboard/wishlist',   icon: Heart },
    { label: 'Addresses',  href: '/dashboard/addresses',  icon: MapPin },
    { label: 'Settings',   href: '/dashboard/settings',   icon: User },
];

// ─── Transform raw API order → typed Order ────────────────────────────────────
function normalise(raw: any): Order {
    return {
        id:          raw._id,
        orderNumber: `#ORD-${raw._id.substring(0, 6).toUpperCase()}`,
        date:        raw.createdAt,
        status:      raw.status as OrderStatus,
        totalAmount: raw.totalAmount ?? 0,
        subtotal:    raw.subtotal   ?? raw.totalAmount * (1 / 1.15) ?? 0,
        vat:         raw.vat        ?? raw.totalAmount * 0.15 * (1 / 1.15) ?? 0,
        deliveryFee: raw.deliveryFee ?? 0,
        estimatedDelivery: raw.estimatedDelivery,
        shippingAddress: raw.shippingAddress ?? {
            fullName: '',
            line1: raw.address ?? '',
            city: '',
            postalCode: '',
            country: 'South Africa',
        },
        vendor:        raw.vendor,
        paymentMethod: raw.paymentMethod,
        paymentRef:    raw.paymentRef,
        items: (raw.items ?? []).map((item: any) => ({
            productId:   item.productId ?? item._id,
            name:        item.name,
            sku:         item.sku,
            image:       item.image,
            price:       item.price,
            quantity:    item.quantity,
            packingType: item.packingType ?? { name: 'Unit', units: 1, priceMultiplier: 1 },
            volume:      item.volume,
        })),
    };
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function OrdersSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-border rounded-lg p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                    <Skeleton className="h-16 w-full" />
                </div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MyOrders() {
    const { user } = useAuth();

    const [rawOrders, setRawOrders] = useState<any[]>([]);
    const [loading, setLoading]     = useState(true);

    const [activeTab, setActiveTab]     = useState<OrderStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters]         = useState<OrderFilters>({});

    // ── Fetch ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!user?.email) return;
        fetch(`/api/orders?email=${user.email}`)
            .then(r => r.json())
            .then(data => { if (data.success) setRawOrders(data.data); })
            .finally(() => setLoading(false));
    }, [user]);

    const orders: Order[] = useMemo(() => rawOrders.map(normalise), [rawOrders]);

    // ── Tab counts ─────────────────────────────────────────────────────────────
    const tabCounts = useMemo(() => {
        const counts: Record<OrderStatus | 'all', number> = {
            all: orders.length,
            Placed: 0, Processing: 0, Packing: 0,
            Dispatched: 0, Delivered: 0, Cancelled: 0,
        };
        orders.forEach(o => { counts[o.status] = (counts[o.status] ?? 0) + 1; });
        return counts;
    }, [orders]);

    // ── Filter + search ────────────────────────────────────────────────────────
    const visible = useMemo(() => {
        return orders.filter(o => {
            // Tab
            if (activeTab !== 'all' && o.status !== activeTab) return false;

            // Search (order number or any item name)
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesNum  = o.orderNumber.toLowerCase().includes(q);
                const matchesItem = o.items.some(i => i.name.toLowerCase().includes(q));
                if (!matchesNum && !matchesItem) return false;
            }

            // Date range
            const d = new Date(o.date);
            if (filters.dateFrom && d < new Date(filters.dateFrom)) return false;
            if (filters.dateTo   && d > new Date(filters.dateTo))   return false;

            // Amount range
            if (filters.minAmount && o.totalAmount < filters.minAmount) return false;
            if (filters.maxAmount && o.totalAmount > filters.maxAmount) return false;

            // Vendors
            if (filters.vendors?.length && o.vendor && !filters.vendors.includes(o.vendor.name)) return false;

            return true;
        });
    }, [orders, activeTab, searchQuery, filters]);

    return (
        <DashboardLayout items={USER_NAV} title="Order History">
            <div className="space-y-6 p-6 max-w-[1100px]">

                {/* Page heading */}
                <div>
                    <h1 className="text-3xl font-light text-[#1a1f1a]">My Orders</h1>
                    <p className="text-muted-foreground mt-1 text-[15px] font-light">
                        Manage and track your purchases.
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <OrdersSkeleton />
                ) : orders.length === 0 ? (
                    /* ── Empty state (preserved exactly) ── */
                    <div className="py-32 text-center rounded-2xl border-2 border-dashed border-foreground/5 bg-foreground/[0.01]">
                        <ShoppingBag className="mx-auto opacity-10 mb-6" size={64} strokeWidth={1} />
                        <p className="opacity-40 font-light italic text-[18px] mb-8 font-display">
                            You haven't placed any orders yet.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 py-4 px-8 bg-foreground text-background rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all shadow-md group"
                        >
                            Browse Products
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Toolbar: tabs + search + filter drawer */}
                        <OrdersToolbar
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            searchQuery={searchQuery}
                            onSearch={setSearchQuery}
                            filters={filters}
                            onFilterChange={setFilters}
                            tabCounts={tabCounts}
                        />

                        {/* Orders list */}
                        {visible.length === 0 ? (
                            <div className="py-16 text-center text-muted-foreground text-sm">
                                No orders match your current filters.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {visible.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}

                        {/* Footer CTA */}
                        <div className="pt-6 border-t border-border flex justify-center">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-3 py-3 px-8 bg-[#1a1f1a] text-white rounded-md text-[12px] font-bold uppercase tracking-widest hover:bg-[#1c3a2a] transition-colors group"
                            >
                                <ShoppingBag size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                                Continue Shopping
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
