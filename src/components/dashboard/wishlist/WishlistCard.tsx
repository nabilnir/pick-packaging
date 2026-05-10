"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Heart, ShoppingCart, Minus, Plus, ArrowRight,
    TrendingUp, TrendingDown,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { WishlistItem } from '@/contexts/wishlist-context';

// ─── Types ────────────────────────────────────────────────────────────────────
export type WishlistCardView = 'grid' | 'list';

export interface WishlistCardProps {
    item: WishlistItem;
    view?: WishlistCardView;
    onRemove: (id: string) => void;
    onAddToCart: (item: WishlistItem, quantity: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtPrice(price: number, currency: string) {
    return `${currency || 'R'}${price.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

type PriceChange = 'increased' | 'decreased' | 'unchanged';

function getPriceChange(current: number, saved?: number): PriceChange {
    if (saved === undefined || saved === current) return 'unchanged';
    return current > saved ? 'increased' : 'decreased';
}

// ─── Quantity stepper (shared) ────────────────────────────────────────────────
function QtyStepper({
    value,
    onChange,
    compact = false,
}: {
    value: number;
    onChange: (n: number) => void;
    compact?: boolean;
}) {
    return (
        <div className={cn(
            'flex items-center border border-border rounded-lg overflow-hidden',
            compact ? 'h-8' : 'h-9',
        )}>
            <button
                onClick={() => onChange(Math.max(1, value - 1))}
                disabled={value <= 1}
                aria-label="Decrease quantity"
                className={cn(
                    'flex items-center justify-center text-muted-foreground hover:bg-gray-50',
                    'disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                    compact ? 'w-7 h-full' : 'w-9 h-full',
                )}
            >
                <Minus size={compact ? 11 : 13} />
            </button>
            <span className={cn(
                'text-center font-semibold text-[#1a1f1a] select-none border-x border-border',
                compact ? 'w-8 text-[12px]' : 'w-10 text-[13px]',
            )}>
                {value}
            </span>
            <button
                onClick={() => onChange(Math.min(999, value + 1))}
                disabled={value >= 999}
                aria-label="Increase quantity"
                className={cn(
                    'flex items-center justify-center text-muted-foreground hover:bg-gray-50',
                    'disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                    compact ? 'w-7 h-full' : 'w-9 h-full',
                )}
            >
                <Plus size={compact ? 11 : 13} />
            </button>
        </div>
    );
}

// ─── AlertDialog remove trigger (shared) ─────────────────────────────────────
function RemoveDialog({
    item,
    onConfirm,
    trigger,
}: {
    item: WishlistItem;
    onConfirm: () => void;
    trigger: React.ReactNode;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Remove{' '}
                        <span className="font-medium text-[#1a1f1a]">"{item.name}"</span>
                        {' '}from your wishlist? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ─── Out-of-stock Add button with tooltip ─────────────────────────────────────
function OosButton({ compact = false }: { compact?: boolean }) {
    return (
        <TooltipProvider delayDuration={80}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* span wraps disabled button so tooltip fires */}
                    <span className={compact ? undefined : 'flex-1'}>
                        <button
                            disabled
                            className={cn(
                                'w-full rounded-lg bg-gray-100 text-gray-400 text-[11px] font-bold uppercase tracking-widest',
                                'flex items-center justify-center gap-1.5 cursor-not-allowed',
                                compact ? 'px-4 py-2 h-8' : 'py-2.5',
                            )}
                        >
                            <ShoppingCart size={12} />
                            {compact ? 'Add' : 'Add to Cart'}
                        </button>
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p className="text-[12px]">Currently out of stock</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

// ─── Price-change badge ───────────────────────────────────────────────────────
function PriceChangeBadge({ change }: { change: PriceChange }) {
    if (change === 'unchanged') return null;
    return (
        <div className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
            change === 'increased'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-teal-100 text-teal-800 border border-teal-200'
        )}>
            {change === 'increased'
                ? <><TrendingUp size={9} /> Price changed</>
                : <><TrendingDown size={9} /> Price dropped</>
            }
        </div>
    );
}

// ─── GRID card ────────────────────────────────────────────────────────────────
function GridCard({
    item, qty, setQty, outOfStock, priceChange, href, onConfirmRemove, onAddToCart,
}: CardInternals) {
    return (
        <div className={cn(
            'group relative bg-white border border-border rounded-xl overflow-hidden flex flex-col',
            !outOfStock && 'hover:shadow-md hover:border-[#1c3a2a]/20',
        )}>
            {/* Image */}
            <div className="relative aspect-square bg-[#f7f6f2] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={cn(
                        'object-cover transition-transform duration-700',
                        !outOfStock && 'group-hover:scale-[1.04]',
                    )}
                />

                {/* OOS overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 bg-[#1a1f1a]/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="text-white text-[11px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border border-white/30 rounded-sm">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Price-change badge — top-right */}
                {!outOfStock && priceChange !== 'unchanged' && (
                    <div className="absolute top-3 right-10 z-20">
                        <PriceChangeBadge change={priceChange} />
                    </div>
                )}

                {/* Heart remove — top-left */}
                <RemoveDialog
                    item={item}
                    onConfirm={onConfirmRemove}
                    trigger={
                        <button
                            id={`wishlist-heart-${item.id}`}
                            aria-label={`Remove ${item.name} from wishlist`}
                            className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-border/50 hover:scale-110 transition-all"
                        >
                            <Heart size={14} className="fill-teal-500 stroke-teal-500" />
                        </button>
                    }
                />
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                {item.vendor && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">
                        {item.vendor}
                    </p>
                )}
                <h3 className="text-[13px] font-medium text-[#1a1f1a] leading-snug line-clamp-2 mb-1">
                    {item.name}
                </h3>
                {item.sku && (
                    <p className="text-[11px] font-mono text-muted-foreground/60 mb-2">{item.sku}</p>
                )}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-[18px] font-bold text-[#1a1f1a]">
                        {fmtPrice(item.price, item.currency)}
                    </span>
                    {item.savedPrice !== undefined && item.savedPrice !== item.price && (
                        <span className="text-[13px] text-muted-foreground line-through">
                            {fmtPrice(item.savedPrice, item.currency)}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2">
                        <QtyStepper value={qty} onChange={setQty} />
                        {outOfStock
                            ? <OosButton />
                            : (
                                <button
                                    onClick={() => onAddToCart(item, qty)}
                                    id={`wishlist-add-${item.id}`}
                                    className="flex-1 py-2.5 rounded-lg bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#243d2e] active:scale-[0.98] transition-all"
                                >
                                    <ShoppingCart size={12} />
                                    Add to Cart
                                </button>
                            )
                        }
                    </div>
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#1c3a2a] transition-colors w-fit"
                    >
                        View product <ArrowRight size={11} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── LIST row ─────────────────────────────────────────────────────────────────
function ListRow({
    item, qty, setQty, outOfStock, priceChange, href, onConfirmRemove, onAddToCart,
}: CardInternals) {
    return (
        <div className={cn(
            'group flex items-center gap-4 bg-white border border-border rounded-xl p-4',
            !outOfStock && 'hover:shadow-sm hover:border-[#1c3a2a]/20',
        )}>
            {/* Thumbnail */}
            <div className="relative w-20 h-20 rounded-lg bg-[#f7f6f2] shrink-0 overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={cn(
                        'object-cover transition-transform duration-500',
                        !outOfStock && 'group-hover:scale-105',
                    )}
                />
                {outOfStock && (
                    <div className="absolute inset-0 bg-[#1a1f1a]/50 flex items-center justify-center">
                        <span className="text-white text-[8px] font-black uppercase tracking-wider text-center leading-tight px-1">
                            Out of<br />Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Info — grows */}
            <div className="flex-1 min-w-0">
                {item.vendor && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
                        {item.vendor}
                    </p>
                )}
                <Link href={href}>
                    <h3 className="text-[13px] font-medium text-[#1a1f1a] leading-snug truncate hover:text-[#1c3a2a] transition-colors mb-0.5">
                        {item.name}
                    </h3>
                </Link>
                {item.sku && (
                    <p className="text-[11px] font-mono text-muted-foreground/60 mb-1">{item.sku}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[15px] font-bold text-[#1a1f1a]">
                        {fmtPrice(item.price, item.currency)}
                    </span>
                    {item.savedPrice !== undefined && item.savedPrice !== item.price && (
                        <span className="text-[12px] text-muted-foreground line-through">
                            {fmtPrice(item.savedPrice, item.currency)}
                        </span>
                    )}
                    {priceChange !== 'unchanged' && !outOfStock && (
                        <PriceChangeBadge change={priceChange} />
                    )}
                </div>
            </div>

            {/* Actions — right side */}
            <div className="flex items-center gap-2 shrink-0">
                <QtyStepper value={qty} onChange={setQty} compact />

                {outOfStock
                    ? <OosButton compact />
                    : (
                        <button
                            onClick={() => onAddToCart(item, qty)}
                            id={`wishlist-list-add-${item.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 h-8 rounded-lg bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#243d2e] active:scale-[0.98] transition-all"
                        >
                            <ShoppingCart size={12} />
                            Add
                        </button>
                    )
                }

                <RemoveDialog
                    item={item}
                    onConfirm={onConfirmRemove}
                    trigger={
                        <button
                            id={`wishlist-list-heart-${item.id}`}
                            aria-label={`Remove ${item.name} from wishlist`}
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                        >
                            <Heart size={13} className="fill-teal-500 stroke-teal-500" />
                        </button>
                    }
                />
            </div>
        </div>
    );
}

// ─── Shared internals type ────────────────────────────────────────────────────
interface CardInternals {
    item: WishlistItem;
    qty: number;
    setQty: (n: number) => void;
    outOfStock: boolean;
    priceChange: PriceChange;
    href: string;
    onConfirmRemove: () => void;
    onAddToCart: (item: WishlistItem, quantity: number) => void;
}

// ─── Exported component ───────────────────────────────────────────────────────
export function WishlistCard({ item, view = 'grid', onRemove, onAddToCart }: WishlistCardProps) {
    const [qty, setQty]           = useState(1);
    const [removing, setRemoving] = useState(false);

    const outOfStock  = item.inStock === false;
    const priceChange = getPriceChange(item.price, item.savedPrice);
    const href        = `/product/${item.slug || item.id}`;

    const handleConfirmRemove = () => {
        setRemoving(true);
        setTimeout(() => onRemove(item.id), 320);
    };

    const internals: CardInternals = {
        item, qty, setQty, outOfStock, priceChange, href,
        onConfirmRemove: handleConfirmRemove,
        onAddToCart,
    };

    return (
        <div
            className={cn(
                'transition-all duration-300 ease-in-out',
                removing && 'opacity-0 -translate-y-2 scale-95 pointer-events-none',
            )}
        >
            {view === 'list'
                ? <ListRow {...internals} />
                : <GridCard {...internals} />
            }
        </div>
    );
}
