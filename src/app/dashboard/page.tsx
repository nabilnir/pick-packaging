"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    MapPin,
    User,
    Check,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

// ─── New overview components ──────────────────────────────────────────────────
import { AnnouncementBanner, type Announcement } from '@/components/dashboard/overview/AnnouncementBanner';
import { SpendKpis, type SpendKpiData } from '@/components/dashboard/overview/SpendKpis';
import { RecentOrdersMini, type RecentOrder } from '@/components/dashboard/overview/RecentOrdersMini';
import { WishlistTeaser, type WishlistPreview } from '@/components/dashboard/overview/WishlistTeaser';
import { NoActiveOrder } from '@/components/dashboard/overview/NoActiveOrder';

// ─── Constants ─────────────────────────────────────────────────────────────
const USER_NAV = [
    { label: "Overview",   href: "/dashboard",            icon: LayoutDashboard },
    { label: "My Orders",  href: "/dashboard/orders",     icon: ShoppingBag },
    { label: "Wishlist",   href: "/dashboard/wishlist",   icon: Heart },
    { label: "Addresses",  href: "/dashboard/addresses",  icon: MapPin },
    { label: "Settings",   href: "/dashboard/settings",   icon: User },
];

// Static announcements — swap for an API fetch if needed later
const ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'vendor-packrite',
        message: '🎉 New vendor Packrite now verified — explore industrial packaging →',
        href: '/shop?vendor=packrite',
    },
];

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function UserDashboard() {
    const { user } = useAuth();
    const { items: cartItems } = useCart();
    const { items: wishlistItems, itemCount: wishlistCount } = useWishlist();

    const [orders, setOrders]   = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const firstName =
        user?.displayName?.split(' ')[0] ||
        user?.email?.split('@')[0] ||
        'there';

    // ── Fetch orders ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!user?.email) return;
        fetch(`/api/orders?email=${user.email}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setOrders(data.data);
            })
            .finally(() => setLoading(false));
    }, [user]);

    // ── Derived data ──────────────────────────────────────────────────────────
    const activeOrder = orders.find(
        o => !['Delivered', 'Cancelled'].includes(o.status)
    ) ?? null;

    const recentOrders: RecentOrder[] = orders.slice(0, 3).map(o => ({
        id:          o._id,
        orderNumber: `#ORD-${o._id.substring(0, 6).toUpperCase()}`,
        date:        o.createdAt,
        status:      o.status,
        totalAmount: o.totalAmount,
        items:       o.items ?? [],
    }));

    const kpis: SpendKpiData | null = loading ? null : {
        totalLifetimeSpend: orders
            .filter(o => o.status !== 'Cancelled')
            .reduce((s: number, o: any) => s + (o.totalAmount ?? 0), 0),
        spentThisMonth: orders
            .filter((o: any) => {
                const d = new Date(o.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() &&
                       d.getFullYear() === now.getFullYear() &&
                       o.status !== 'Cancelled';
            })
            .reduce((s: number, o: any) => s + (o.totalAmount ?? 0), 0),
        spendDeltaPct: 0, // extend with real prev-month comparison when available
        totalOrdersPlaced: orders.length,
    };

    const wishlistPreviews: WishlistPreview[] = wishlistItems.slice(0, 4).map(i => ({
        id:    i.id,
        image: i.image,
        name:  i.name,
    }));

    // ── Primary address (static until addresses API is wired here) ────────────
    const primaryAddress = { name: '', line1: '', line2: '', country: '' };

    return (
        <DashboardLayout items={USER_NAV} title="Account Dashboard">
            <div className="space-y-6 p-6 max-w-[1200px]">

                {/* 1 ── Announcement banner */}
                <AnnouncementBanner announcements={ANNOUNCEMENTS} />

                {/* 2 ── Greeting */}
                <div>
                    <h1 className="text-3xl font-light text-[#1a1f1a]">
                        Hello, {firstName}
                    </h1>
                    <p className="text-foreground/50 mt-1 text-[15px] font-light">
                        Welcome back to your PickPacking account. Here's what's happening today.
                    </p>
                </div>

                {/* 3 ── KPI strip */}
                <SpendKpis data={kpis} isLoading={loading} />

                {/* 4 ── Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

                    {/* ── Left column ── */}
                    <div className="space-y-6">

                        {/* Active order monitoring */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Active Order Monitoring
                                </h2>
                                <Link
                                    href="/dashboard/orders"
                                    className="text-sm font-medium text-[#1c3a2a] hover:underline"
                                >
                                    View order details
                                </Link>
                            </div>

                            {activeOrder ? (
                                <div className="bg-white rounded-lg border border-gray-200 p-8">
                                    {/* Order meta */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
                                        <div>
                                            <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                                                Order #{activeOrder._id.substring(0, 6).toUpperCase()}
                                            </p>
                                            <h3 className="text-lg font-light text-[#1a1f1a]">
                                                Expected Arrival:{' '}
                                                {activeOrder.estimatedDelivery
                                                    ? new Date(activeOrder.estimatedDelivery).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short' })
                                                    : 'To be confirmed'}
                                            </h3>
                                        </div>
                                        <StatusPill status={activeOrder.status} />
                                    </div>

                                    {/* Stepper */}
                                    <OrderStepper status={activeOrder.status} createdAt={activeOrder.createdAt} />
                                </div>
                            ) : (
                                <NoActiveOrder />
                            )}
                        </section>

                        {/* Recent orders mini-list */}
                        <RecentOrdersMini orders={recentOrders} isLoading={loading} />
                    </div>

                    {/* ── Right column ── */}
                    <div className="space-y-6">

                        {/* Fast checkout */}
                        <div className="bg-[#1a1f1a] text-white rounded-lg p-8">
                            <h3 className="text-xl font-light mb-3 font-display">Fast Checkout</h3>
                            <p className="text-white/60 text-[13px] font-light mb-6 leading-relaxed">
                                {cartItems.length > 0
                                    ? `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart ready for checkout.`
                                    : 'Your cart is empty. Start adding products to checkout faster.'}
                            </p>
                            <Link
                                href={cartItems.length > 0 ? '/checkout' : '/shop'}
                                className="inline-flex items-center gap-2 py-3 px-6 bg-[#1c3a2a] text-white rounded-md text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                            >
                                {cartItems.length > 0 ? 'Finish Order' : 'Browse Products'}
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Wishlist teaser */}
                        <WishlistTeaser
                            count={wishlistCount}
                            previews={wishlistPreviews}
                            isLoading={loading}
                        />

                        {/* Primary address panel */}
                        <PrimaryAddressPanel />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
    const map: Record<string, string> = {
        Placed:      'bg-gray-100 text-gray-600',
        Processing:  'bg-amber-50 text-amber-700',
        Packing:     'bg-blue-50 text-blue-700',
        Dispatched:  'bg-purple-50 text-purple-700',
        Delivered:   'bg-teal-50 text-teal-700',
        Cancelled:   'bg-red-50 text-red-600',
    };
    return (
        <span className={cn(
            'px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest',
            map[status] ?? 'bg-gray-100 text-gray-500'
        )}>
            {status}
        </span>
    );
}

// ─── Order stepper ────────────────────────────────────────────────────────────
const STEPS = ['Placed', 'Processing', 'Packing', 'Dispatched', 'Delivered'] as const;
type Step = typeof STEPS[number];

function OrderStepper({ status, createdAt }: { status: string; createdAt: string }) {
    const currentIdx = STEPS.indexOf(status as Step);

    return (
        <div className="relative pt-4 pb-10">
            {/* Track */}
            <div className="absolute top-[28px] left-[15px] right-[15px] h-[2px] bg-gray-100 z-0" />
            {/* Progress fill */}
            <div
                className="absolute top-[28px] left-[15px] h-[2px] bg-[#1c3a2a] z-0 transition-all duration-500"
                style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
            />
            <div className="relative z-10 flex justify-between">
                {STEPS.map((step, idx) => {
                    const done   = idx < currentIdx;
                    const active = idx === currentIdx;
                    return (
                        <div key={step} className="flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                                done   ? "bg-[#1c3a2a] border-[#1c3a2a] text-white"            : "",
                                active ? "border-[#1c3a2a] bg-white text-[#1c3a2a] shadow-md"  : "",
                                !done && !active ? "bg-white border-gray-200 text-gray-300"    : "",
                            )}>
                                {done
                                    ? <Check size={14} strokeWidth={3} />
                                    : <div className={cn("w-2 h-2 rounded-full", active ? "bg-[#1c3a2a] animate-pulse" : "bg-gray-200")} />
                                }
                            </div>
                            <div className="text-center">
                                <p className={cn(
                                    "text-[11px] font-bold uppercase tracking-widest mb-0.5",
                                    active ? "text-[#1c3a2a]" : "text-gray-400"
                                )}>
                                    {step}
                                </p>
                                <p className="text-[10px] text-gray-300">
                                    {idx === 0 ? new Date(createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : ''}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Primary address panel ────────────────────────────────────────────────────
function PrimaryAddressPanel() {
    const [address, setAddress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/addresses')
            .then(r => r.json())
            .then(data => {
                const primary = (data.addresses ?? []).find((a: any) => a.isDefault) ?? data.addresses?.[0] ?? null;
                setAddress(primary);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
                <MapPin size={13} />
                Primary Address
            </h3>

            {loading ? (
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
            ) : address ? (
                <>
                    <p className="text-[14px] font-medium text-[#1a1f1a] mb-1">
                        {address.fullName ?? address.name ?? ''}
                    </p>
                    <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                        {address.line1 ?? address.addressLine1}<br />
                        {address.city} {address.postalCode}<br />
                        {address.country}
                    </p>
                    <Link
                        href="/dashboard/addresses"
                        className="inline-block mt-4 text-[11px] uppercase tracking-widest font-bold text-[#1c3a2a] hover:underline"
                    >
                        Edit Address
                    </Link>
                </>
            ) : (
                <div className="text-sm text-gray-400">No address saved yet.</div>
            )}
        </div>
    );
}
