"use client";

import React from 'react';
import { TrendingDown, PackageCheck, PackageX, BadgePercent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WishlistItem, getPriceDirection } from '@/types/wishlist';

interface WishlistSummaryBarProps {
    items: WishlistItem[];
}

function fmtR(n: number) {
    return `R\u00a0${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function WishlistSummaryBar({ items }: WishlistSummaryBarProps) {
    if (items.length === 0) return null;

    // Totals
    const totalValue   = items.reduce((s, i) => s + i.currentPrice, 0);
    const inStockCount = items.filter(i => i.inStock).length;
    const oosCount     = items.length - inStockCount;

    // Savings: sum of (savedPrice - currentPrice) where price has dropped
    const savings = items.reduce((s, i) => {
        if (getPriceDirection(i) === 'dropped') {
            return s + (i.savedPrice - i.currentPrice);
        }
        return s;
    }, 0);

    const priceDropCount = items.filter(i => getPriceDirection(i) === 'dropped').length;

    const stats = [
        {
            id: 'total-value',
            icon: BadgePercent,
            label: 'Total value',
            value: fmtR(totalValue),
            sub: `across ${items.length} item${items.length !== 1 ? 's' : ''}`,
            color: 'text-[#1c3a2a]',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
        },
        {
            id: 'in-stock',
            icon: PackageCheck,
            label: 'In stock',
            value: `${inStockCount}`,
            sub: `${inStockCount === 1 ? 'item' : 'items'} ready to order`,
            color: 'text-teal-700',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
        },
        ...(oosCount > 0 ? [{
            id: 'out-of-stock',
            icon: PackageX,
            label: 'Out of stock',
            value: `${oosCount}`,
            sub: `${oosCount === 1 ? 'item' : 'items'} unavailable`,
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-100',
        }] : []),
        ...(savings > 0 ? [{
            id: 'savings',
            icon: TrendingDown,
            label: 'Price drops',
            value: fmtR(savings),
            sub: `saved on ${priceDropCount} item${priceDropCount !== 1 ? 's' : ''}`,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
        }] : []),
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map(({ id, icon: Icon, label, value, sub, color, bg, border }) => (
                <div
                    key={id}
                    className={cn(
                        'flex items-start gap-3 p-3.5 rounded-xl border',
                        bg, border,
                    )}
                >
                    <div className={cn('mt-0.5 shrink-0', color)}>
                        <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
                            {label}
                        </p>
                        <p className={cn('text-[15px] font-bold leading-none mb-0.5', color)}>
                            {value}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-snug truncate">
                            {sub}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
