"use client";

import React, { useState } from 'react';
import { X, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PriceAlertBannerProps {
    priceDropCount: number;
    priceRiseCount: number;
}

interface BannerRowProps {
    type: 'drop' | 'rise';
    count: number;
    onDismiss: () => void;
}

function BannerRow({ type, count, onDismiss }: BannerRowProps) {
    const isDrop = type === 'drop';

    const noun = count === 1 ? 'item' : 'items';
    const message = isDrop
        ? `${count} ${noun} in your wishlist ${count === 1 ? 'has' : 'have'} dropped in price — great time to order!`
        : `${count} ${noun} in your wishlist ${count === 1 ? 'has' : 'have'} increased in price since you saved ${count === 1 ? 'it' : 'them'}.`;

    return (
        <div
            role="alert"
            className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg',
                isDrop
                    ? 'bg-teal-50 border border-teal-200 text-teal-800'
                    : 'bg-amber-50 border border-amber-200 text-amber-800',
            )}
        >
            {/* Icon */}
            <span className="shrink-0">
                {isDrop
                    ? <TrendingDown size={15} className="text-teal-600" />
                    : <TrendingUp   size={15} className="text-amber-600" />
                }
            </span>

            {/* Message */}
            <p className="flex-1 text-[12px] font-medium leading-snug">
                {message}
            </p>

            {/* Dismiss */}
            <button
                onClick={onDismiss}
                aria-label={`Dismiss ${isDrop ? 'price drop' : 'price increase'} alert`}
                className={cn(
                    'shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                    isDrop
                        ? 'hover:bg-teal-100 text-teal-600'
                        : 'hover:bg-amber-100 text-amber-600',
                )}
            >
                <X size={13} />
            </button>
        </div>
    );
}

export function PriceAlertBanner({ priceDropCount, priceRiseCount }: PriceAlertBannerProps) {
    const [dropDismissed, setDropDismissed] = useState(false);
    const [riseDismissed, setRiseDismissed] = useState(false);

    const showDrop = priceDropCount > 0 && !dropDismissed;
    const showRise = priceRiseCount > 0 && !riseDismissed;

    if (!showDrop && !showRise) return null;

    return (
        <div className="space-y-2 mb-5">
            {showDrop && (
                <BannerRow
                    type="drop"
                    count={priceDropCount}
                    onDismiss={() => setDropDismissed(true)}
                />
            )}
            {showRise && (
                <BannerRow
                    type="rise"
                    count={priceRiseCount}
                    onDismiss={() => setRiseDismissed(true)}
                />
            )}
        </div>
    );
}
