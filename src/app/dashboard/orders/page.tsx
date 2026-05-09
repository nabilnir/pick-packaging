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
    SearchX,
    ChevronLeft,
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

const PAGE_SIZE = 8;

// ─── Normalise raw API order → typed Order ────────────────────────────────────
function normalise(raw: any): Order {
    return {
        id:          raw._id,
        orderNumber: `#ORD-${raw._id.substring(0, 6).toUpperCase()}`,
        date:        raw.createdAt,
        status:      raw.status as OrderStatus,
        totalAmount: raw.totalAmount ?? 0,
        subtotal:    raw.subtotal    ?? (raw.totalAmount ?? 0) / 1.15,
        vat:         raw.vat         ?? (raw.totalAmount ?? 0) - (raw.totalAmount ?? 0) / 1.15,
        deliveryFee: raw.deliveryFee ?? 0,
        estimatedDelivery: raw.estimatedDelivery,
        shippingAddress: raw.shippingAddress ?? {
            fullName:   '',
            line1:      raw.address ?? '',
            city:       '',
            postalCode: '',
            country:    'South Africa',
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
                    <Skeleton className="h-14 w-full" />
                </div>
            ))}
        </div>
    );
}

// ─── Empty state (no orders at all) — preserved exactly ──────────────────────
function EmptyOrdersState() {
    return (
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
    );
}

// ─── No results state (search/filter yields nothing) ─────────────────────────
function NoResultsState({ query, onClear }: { query: string; onClear: () => void }) {
    return (
        <div className="py-24 flex flex-col items-center text-center">
            <SearchX size={40} className="text-muted-foreground opacity-40 mb-4" />
            <h3 className="text-base font-medium text-[#1a1f1a] mb-1">No orders found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {query
                    ? <>No results for <span className="font-mono font-medium">"{query}"</span>. Try a different search term.</>
                    : 'No orders match your current filters.'}
            </p>
            <button
                onClick={onClear}
                className="text-sm font-bold text-[#1c3a2a] underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
                Clear {query ? 'search' : 'filters'}
            </button>
        </div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function OrdersPagination({
    total, page, pageSize, onChange
}: { total: number; page: number; pageSize: number; onChange: (p: number) => void }) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 pt-4">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-md border border-border bg-white hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                        p === page
                            ? 'bg-[#1c3a2a] text-white'
                            : 'border border-border bg-white text-[#1a1f1a] hover:bg-gray-50'
                    }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-md border border-border bg-white hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                <ChevronRight size={16} />
            </button>
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
    const [page, setPage]               = useState(1);

    // Reset page to 1 whenever filters change
    const handleTabChange = (t: OrderStatus | 'all') => { setActiveTab(t); setPage(1); };
    const handleSearch    = (q: string)               => { setSearchQuery(q); setPage(1); };
    const handleFilter    = (f: OrderFilters)         => { setFilters(f); setPage(1); };
    const clearSearch     = ()                        => { setSearchQuery(''); setFilters({}); setActiveTab('all'); setPage(1); };

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
    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            if (activeTab !== 'all' && o.status !== activeTab) return false;

            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesNum  = o.orderNumber.toLowerCase().includes(q);
                const matchesItem = o.items.some(i => i.name.toLowerCase().includes(q));
                if (!matchesNum && !matchesItem) return false;
            }

            const d = new Date(o.date);
            if (filters.dateFrom && d < new Date(filters.dateFrom)) return false;
            if (filters.dateTo   && d > new Date(filters.dateTo))   return false;
            if (filters.minAmount && o.totalAmount < filters.minAmount) return false;
            if (filters.maxAmount && o.totalAmount > filters.maxAmount) return false;
            if (filters.vendors?.length && o.vendor && !filters.vendors.includes(o.vendor.name)) return false;

            return true;
        });
    }, [orders, activeTab, searchQuery, filters]);

    // ── Paginate ───────────────────────────────────────────────────────────────
    const pagedOrders = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredOrders.slice(start, start + PAGE_SIZE);
    }, [filteredOrders, page]);

    const hasActiveSearch = searchQuery !== '' || Object.values(filters).some(v =>
        Array.isArray(v) ? v.length > 0 : v !== undefined
    );

    return (
        <DashboardLayout items={USER_NAV} title="Order History">
            <div className="p-6 space-y-6 max-w-[1100px]">

                {/* Page heading */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-light text-[#1a1f1a]">My Orders</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage and track your recent purchases.
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <OrdersSkeleton />
                ) : orders.length === 0 ? (
                    <EmptyOrdersState />
                ) : (
                    <>
                        <OrdersToolbar
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            searchQuery={searchQuery}
                            onSearch={handleSearch}
                            filters={filters}
                            onFilterChange={handleFilter}
                            tabCounts={tabCounts}
                        />

                        {filteredOrders.length === 0 && !hasActiveSearch ? (
                            <EmptyOrdersState />
                        ) : filteredOrders.length === 0 ? (
                            <NoResultsState query={searchQuery} onClear={clearSearch} />
                        ) : (
                            <div className="space-y-4">
                                {pagedOrders.map(order => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                                <OrdersPagination
                                    total={filteredOrders.length}
                                    page={page}
                                    pageSize={PAGE_SIZE}
                                    onChange={setPage}
                                />
                            </div>
                        )}

                        {/* Footer CTA */}
                        <div className="pt-4 border-t border-border flex justify-center">
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
