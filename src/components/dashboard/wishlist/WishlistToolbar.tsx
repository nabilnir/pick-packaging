"use client";

import React from 'react';
import { ShoppingCart, Share2, ChevronDown, LayoutGrid, List } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// ─── Sort type ────────────────────────────────────────────────────────────────
export type WishlistSort =
    | 'recently-saved'
    | 'price-asc'
    | 'price-desc'
    | 'alphabetical';

export type WishlistView = 'grid' | 'list';

const SORT_LABELS: Record<WishlistSort, string> = {
    'recently-saved': 'Recently saved',
    'price-asc':      'Price: low to high',
    'price-desc':     'Price: high to low',
    'alphabetical':   'Alphabetical',
};

// ─── Props ────────────────────────────────────────────────────────────────────
export interface WishlistToolbarProps {
    count: number;
    onAddAll: () => void;
    onShare: () => void;
    sort: WishlistSort;
    onSortChange: (sort: WishlistSort) => void;
    view: WishlistView;
    onViewChange: (view: WishlistView) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function WishlistToolbar({
    count,
    onAddAll,
    onShare,
    sort,
    onSortChange,
    view,
    onViewChange,
}: WishlistToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-border mb-6">
            {/* Left: item count */}
            <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-[#1a1f1a]">{count}</span>{' '}
                {count === 1 ? 'saved item' : 'saved items'}
            </p>

            {/* Right: actions */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Add all to cart */}
                <button
                    onClick={onAddAll}
                    className={cn(
                        'relative inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                        'bg-[#1c3a2a] text-white text-[12px] font-bold uppercase tracking-widest',
                        'hover:bg-[#16302200] hover:bg-[#243d2e] transition-colors',
                        'disabled:opacity-40 disabled:cursor-not-allowed'
                    )}
                    disabled={count === 0}
                    id="wishlist-add-all-btn"
                >
                    <ShoppingCart size={14} />
                    Add all to cart
                    {/* count badge */}
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 text-[#1a1f1a] text-[10px] font-black flex items-center justify-center leading-none">
                            {count > 99 ? '99+' : count}
                        </span>
                    )}
                </button>

                {/* Share wishlist */}
                <button
                    onClick={onShare}
                    id="wishlist-share-btn"
                    className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                        'border border-border bg-white text-[12px] font-bold uppercase tracking-widest text-muted-foreground',
                        'hover:border-[#1c3a2a]/30 hover:text-[#1c3a2a] transition-all'
                    )}
                >
                    <Share2 size={13} />
                    Share
                </button>

                {/* Sort dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            id="wishlist-sort-trigger"
                            className={cn(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
                                'border border-border bg-white text-[12px] font-bold uppercase tracking-widest text-muted-foreground',
                                'hover:border-[#1c3a2a]/30 hover:text-[#1c3a2a] transition-all'
                            )}
                        >
                            {SORT_LABELS[sort]}
                            <ChevronDown size={13} className="opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        {(Object.keys(SORT_LABELS) as WishlistSort[]).map(key => (
                            <DropdownMenuItem
                                key={key}
                                onSelect={() => onSortChange(key)}
                                className={cn(
                                    'text-[13px] cursor-pointer',
                                    key === sort && 'font-semibold text-[#1c3a2a]'
                                )}
                            >
                                {SORT_LABELS[key]}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* View toggle */}
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
                    <button
                        id="wishlist-view-grid"
                        onClick={() => onViewChange('grid')}
                        aria-label="Grid view"
                        className={cn(
                            'p-2 transition-colors',
                            view === 'grid'
                                ? 'bg-[#1c3a2a] text-white'
                                : 'text-muted-foreground hover:text-[#1c3a2a]'
                        )}
                    >
                        <LayoutGrid size={15} />
                    </button>
                    <button
                        id="wishlist-view-list"
                        onClick={() => onViewChange('list')}
                        aria-label="List view"
                        className={cn(
                            'p-2 transition-colors',
                            view === 'list'
                                ? 'bg-[#1c3a2a] text-white'
                                : 'text-muted-foreground hover:text-[#1c3a2a]'
                        )}
                    >
                        <List size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
