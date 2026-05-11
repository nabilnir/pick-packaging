"use client";

import React, { useMemo, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    Heart, ArrowRight,
    LayoutDashboard, MapPin, User, ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast-provider';
import Link from 'next/link';
import { WishlistToolbar, type WishlistView } from '@/components/dashboard/wishlist/WishlistToolbar';
import { WishlistCard } from '@/components/dashboard/wishlist/WishlistCard';
import { PriceAlertBanner } from '@/components/dashboard/wishlist/PriceAlertBanner';
import { WishlistSummaryBar } from '@/components/dashboard/wishlist/WishlistSummaryBar';
import { type WishlistItem, type WishlistSort, getPriceDirection } from '@/types/wishlist';
import { MOCK_WISHLIST } from '@/lib/wishlist/mock-wishlist';

// ─── Nav ─────────────────────────────────────────────────────────────────────
const USER_NAV = [
    { label: 'Overview',  href: '/dashboard',           icon: LayoutDashboard },
    { label: 'My Orders', href: '/dashboard/orders',    icon: ShoppingBag },
    { label: 'Wishlist',  href: '/dashboard/wishlist',  icon: Heart },
    { label: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
    { label: 'Settings',  href: '/dashboard/settings',  icon: User },
];

// ─── Sort ─────────────────────────────────────────────────────────────────────
function sortItems(items: WishlistItem[], sort: WishlistSort): WishlistItem[] {
    const copy = [...items];
    switch (sort) {
        case 'price-asc':    return copy.sort((a, b) => a.currentPrice - b.currentPrice);
        case 'price-desc':   return copy.sort((a, b) => b.currentPrice - a.currentPrice);
        case 'alphabetical': return copy.sort((a, b) => a.productName.localeCompare(b.productName));
        default:             return copy; // recently-saved = insertion order
    }
}

// ─── Cart payload ─────────────────────────────────────────────────────────────
function toCartPayload(item: WishlistItem, quantity: number) {
    return {
        productId:   item.productId,
        name:        item.productName,
        image:       item.imageUrl,
        price:       item.currentPrice,
        currency:    'R',
        packingType: { name: 'Unit', units: 1, priceMultiplier: 1 },
        quantity,
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WishlistPage() {
    // In production: replace MOCK_WISHLIST with a real API/context call
    const [items, setItems] = useState<WishlistItem[]>(MOCK_WISHLIST);
    const { addToCart } = useCart();
    const { success, error: toastError } = useToast();

    const [sort, setSort] = useState<WishlistSort>('recently-saved');
    const [view, setView] = useState<WishlistView>('grid');

    const sorted = useMemo(() => sortItems(items, sort), [items, sort]);

    // Price-change counts for banners
    const priceDropCount = useMemo(
        () => items.filter(i => getPriceDirection(i) === 'dropped').length,
        [items],
    );
    const priceRiseCount = useMemo(
        () => items.filter(i => getPriceDirection(i) === 'risen').length,
        [items],
    );

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleRemove = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const handleAddToCart = (item: WishlistItem, quantity: number) => {
        addToCart(toCartPayload(item, quantity));
        success(
            `${quantity > 1 ? `${quantity}× ` : ''}"${item.productName}" added to cart`
        );
    };

    const handleAddAll = () => {
        const inStock  = items.filter(i => i.inStock);
        const skipped  = items.length - inStock.length;
        inStock.forEach(i => addToCart(toCartPayload(i, i.quantity)));
        if (skipped > 0) {
            toastError(
                `${inStock.length} item${inStock.length !== 1 ? 's' : ''} added, ` +
                `${skipped} item${skipped !== 1 ? 's' : ''} skipped (out of stock)`
            );
        } else {
            success(`${inStock.length} item${inStock.length !== 1 ? 's' : ''} added to your cart`);
        }
    };

    const handleShare = () => {
        const url = typeof window !== 'undefined'
            ? `${window.location.origin}/wishlist/shared?ids=${items.map(i => i.productId).join(',')}`
            : '';
        if (url && navigator?.clipboard) {
            navigator.clipboard.writeText(url).then(() => success('Wishlist link copied'));
        }
    };

    return (
        <DashboardLayout items={USER_NAV} title="Saved Items">
            <div className="p-6 space-y-5">

                {/* Heading */}
                <div>
                    <h1 className="text-3xl font-light">My Wishlist</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Products you've saved for later.
                    </p>
                </div>

                {items.length === 0 ? (
                    /* ── Empty state ──────────────────────────────────────────── */
                    <div className="py-20 text-center rounded-2xl border-2 border-dashed border-foreground/5">
                        <Heart className="mx-auto opacity-10 mb-4" size={48} />
                        <p className="opacity-40 font-light italic text-[15px]">
                            Your wishlist is currently empty.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-brand-green font-bold uppercase tracking-widest text-[11px] mt-6"
                        >
                            Start Shopping
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                ) : (
                    /* ── Populated state ──────────────────────────────────────── */
                    <>
                        {/* 1. Price-change banners */}
                        <PriceAlertBanner
                            priceDropCount={priceDropCount}
                            priceRiseCount={priceRiseCount}
                        />

                        {/* 2. Toolbar */}
                        <WishlistToolbar
                            count={items.length}
                            onAddAll={handleAddAll}
                            onShare={handleShare}
                            sort={sort}
                            onSortChange={setSort}
                            view={view}
                            onViewChange={setView}
                        />

                        {/* 3. Summary stat tiles */}
                        <WishlistSummaryBar items={items} />

                        {/* 4. Cards — grid rows for equal height */}
                        {view === 'list' ? (
                            <div className="flex flex-col gap-3">
                                {sorted.map(item => (
                                    <WishlistCard
                                        key={item.id}
                                        item={item}
                                        view="list"
                                        onAddToCart={handleAddToCart}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
                                {sorted.map(item => (
                                    <WishlistCard
                                        key={item.id}
                                        item={item}
                                        view="grid"
                                        onAddToCart={handleAddToCart}
                                        onRemove={handleRemove}
                                    />
                                ))}
                            </div>
                        )}

                        {/* 5. Footer */}
                        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{items.length}</span>{' '}
                                {items.length === 1 ? 'item' : 'items'} saved
                            </p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1c3a2a] transition-colors"
                            >
                                Continue Shopping
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
