"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Heart, ShoppingCart, Minus, Plus,
    ArrowRight, PackageOpen,
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
import { type WishlistItem, getPriceDirection } from '@/types/wishlist';

// ─── View type (used by parent grid / list toggle) ────────────────────────────
export type WishlistCardView = 'grid' | 'list';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface WishlistCardProps {
    item: WishlistItem;
    view?: WishlistCardView;
    onRemove: (id: string) => void;
    onAddToCart: (item: WishlistItem, quantity: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtZAR = (n: number) =>
    `R\u00a0${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Product image (with PackageOpen placeholder) ─────────────────────────────
function ProductImage({ src, alt, fill = false }: { src: string; alt: string; fill?: boolean }) {
    if (!src) {
        return (
            <div className={cn(
                'bg-gray-100 flex flex-col items-center justify-center text-gray-300 gap-1',
                fill ? 'absolute inset-0' : 'w-full h-full',
            )}>
                <PackageOpen size={28} strokeWidth={1.5} />
            </div>
        );
    }
    return fill ? (
        <Image src={src} alt={alt} fill className="object-cover" />
    ) : (
        <Image src={src} alt={alt} width={80} height={80} className="object-contain" />
    );
}

// ─── Price-change badge ───────────────────────────────────────────────────────
function PriceChangeBadge({ item }: { item: WishlistItem }) {
    const dir = getPriceDirection(item);
    if (dir === 'unchanged') return null;

    const delta = Math.abs(item.currentPrice - item.savedPrice);

    return (
        <span className={cn(
            'text-[10px] font-bold text-white px-2 py-0.5 rounded-full leading-none',
            dir === 'dropped' ? 'bg-teal-600' : 'bg-amber-500',
        )}>
            {dir === 'dropped' ? `↓ ${fmtZAR(delta)} off` : `↑ ${fmtZAR(delta)} rise`}
        </span>
    );
}

// ─── Remove (AlertDialog) ─────────────────────────────────────────────────────
function HeartRemoveButton({ item, onConfirm, compact }: {
    item: WishlistItem;
    onConfirm: () => void;
    compact?: boolean;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    id={`wishlist-heart-${item.id}`}
                    aria-label={`Remove ${item.productName} from wishlist`}
                    className={cn(
                        'group/heart transition-colors',
                        compact
                            ? 'p-1.5 rounded-lg border border-border hover:border-red-200 hover:bg-red-50'
                            : 'absolute top-2.5 left-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/50 hover:bg-white',
                    )}
                >
                    <Heart
                        size={compact ? 14 : 15}
                        className="fill-teal-600 stroke-teal-600 group-hover/heart:fill-red-400 group-hover/heart:stroke-red-400 transition-colors duration-200"
                    />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Remove{' '}
                        <span className="font-medium text-foreground">"{item.productName}"</span>
                        {' '}from your wishlist? This cannot be undone.
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

// ─── Quantity stepper ─────────────────────────────────────────────────────────
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
            'inline-flex items-center rounded-lg border border-border overflow-hidden',
            compact ? 'h-8' : 'h-9',
        )}>
            {/* − ghost button */}
            <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
                disabled={value <= 1}
                aria-label="Decrease quantity"
                className={cn(
                    'flex items-center justify-center text-muted-foreground',
                    'hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                    compact ? 'w-7' : 'w-9',
                )}
            >
                <Minus size={compact ? 11 : 13} />
            </button>

            {/* Bordered numeric display */}
            <span className={cn(
                'border-x border-border text-center font-semibold text-foreground select-none tabular-nums',
                compact ? 'w-8 text-[12px]' : 'w-10 text-[13px]',
            )}>
                {value}
            </span>

            {/* + ghost button */}
            <button
                type="button"
                onClick={() => onChange(Math.min(999, value + 1))}
                disabled={value >= 999}
                aria-label="Increase quantity"
                className={cn(
                    'flex items-center justify-center text-muted-foreground',
                    'hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                    compact ? 'w-7' : 'w-9',
                )}
            >
                <Plus size={compact ? 11 : 13} />
            </button>
        </div>
    );
}

// ─── OOS "add" button with tooltip ───────────────────────────────────────────
function OosAddButton({ compact = false }: { compact?: boolean }) {
    return (
        <TooltipProvider delayDuration={80}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className={compact ? undefined : 'flex-1'}>
                        <button
                            disabled
                            className={cn(
                                'w-full rounded-lg bg-gray-100 text-gray-400 text-[11px] font-bold',
                                'uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-not-allowed',
                                compact ? 'px-3 py-1.5 h-8' : 'py-2.5',
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

// ─── GRID card ────────────────────────────────────────────────────────────────
function GridCard({ item, qty, setQty, onConfirmRemove, onAddToCart }: InternalProps) {
    const href = `/product/${item.productId}`;
    const dir  = getPriceDirection(item);

    return (
        <div className={cn(
            'group bg-white border border-border rounded-xl overflow-hidden flex flex-col h-full',
            !item.inStock ? 'opacity-80' : 'hover:shadow-md hover:border-[#1c3a2a]/20 transition-all',
        )}>
            {/* ── Image ──────────────────────────────────────────────────────── */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <ProductImage src={item.imageUrl} alt={item.productName} fill />

                {/* OOS overlay: bg-black/50 */}
                {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <span className="text-white text-[11px] font-black uppercase tracking-[0.18em] px-3 py-1 border border-white/40 rounded-sm">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Price-change badge — top-right */}
                {dir !== 'unchanged' && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                        <PriceChangeBadge item={item} />
                    </div>
                )}

                {/* Heart remove — top-left */}
                <HeartRemoveButton item={item} onConfirm={onConfirmRemove} />
            </div>

            {/* ── Body ───────────────────────────────────────────────────────── */}
            <div className="p-4 flex flex-col flex-1 gap-1">
                {/* Vendor */}
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {item.vendorName}
                </p>

                {/* Name */}
                <Link href={href}>
                    <h3 className="text-[13px] font-medium text-foreground leading-snug line-clamp-2 hover:text-[#1c3a2a] transition-colors">
                        {item.productName}
                    </h3>
                </Link>

                {/* SKU */}
                <p className="text-[11px] font-mono text-muted-foreground/60">{item.sku}</p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-[17px] font-bold text-foreground">
                        {fmtZAR(item.currentPrice)}
                    </span>
                    {item.currentPrice !== item.savedPrice && (
                        <span className="text-[12px] text-muted-foreground line-through">
                            {fmtZAR(item.savedPrice)}
                        </span>
                    )}
                </div>

                {/* ── Footer ─────────────────────────────────────────────────── */}
                <div className="mt-auto pt-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                        <QtyStepper value={qty} onChange={setQty} />
                        {item.inStock ? (
                            <button
                                onClick={() => onAddToCart(item, qty)}
                                id={`wishlist-add-${item.id}`}
                                className="flex-1 py-2.5 rounded-lg bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#243d2e] active:scale-[0.98] transition-all"
                            >
                                <ShoppingCart size={12} />
                                Add to Cart
                            </button>
                        ) : (
                            <OosAddButton />
                        )}
                    </div>
                    <Link
                        href={href}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#1c3a2a] transition-colors"
                    >
                        View product <ArrowRight size={11} />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── LIST row ─────────────────────────────────────────────────────────────────
function ListRow({ item, qty, setQty, onConfirmRemove, onAddToCart }: InternalProps) {
    const href = `/product/${item.productId}`;
    const dir  = getPriceDirection(item);

    return (
        <div className={cn(
            'group flex items-center gap-4 bg-white border border-border rounded-xl p-4',
            !item.inStock ? 'opacity-75' : 'hover:shadow-sm hover:border-[#1c3a2a]/20 transition-all',
        )}>
            {/* Thumbnail */}
            <div className="relative w-[72px] h-[72px] rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-contain p-1" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <PackageOpen size={22} strokeWidth={1.5} />
                    </div>
                )}
                {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-[7px] font-black uppercase tracking-wider text-center leading-tight px-1">
                            Out of<br />Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-0.5">
                    {item.vendorName}
                </p>
                <Link href={href}>
                    <h3 className="text-[13px] font-medium text-foreground leading-snug truncate hover:text-[#1c3a2a] transition-colors">
                        {item.productName}
                    </h3>
                </Link>
                <p className="text-[11px] font-mono text-muted-foreground/60 mb-1">{item.sku}</p>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-bold text-foreground">
                        {fmtZAR(item.currentPrice)}
                    </span>
                    {item.currentPrice !== item.savedPrice && (
                        <span className="text-[12px] text-muted-foreground line-through">
                            {fmtZAR(item.savedPrice)}
                        </span>
                    )}
                    {dir !== 'unchanged' && <PriceChangeBadge item={item} />}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <QtyStepper value={qty} onChange={setQty} compact />
                {item.inStock ? (
                    <button
                        onClick={() => onAddToCart(item, qty)}
                        id={`wishlist-list-add-${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 h-8 rounded-lg bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#243d2e] active:scale-[0.98] transition-all"
                    >
                        <ShoppingCart size={11} />
                        Add
                    </button>
                ) : (
                    <OosAddButton compact />
                )}
                <HeartRemoveButton item={item} onConfirm={onConfirmRemove} compact />
            </div>
        </div>
    );
}

// ─── Internal shared interface ────────────────────────────────────────────────
interface InternalProps {
    item: WishlistItem;
    qty: number;
    setQty: (n: number) => void;
    onConfirmRemove: () => void;
    onAddToCart: (item: WishlistItem, quantity: number) => void;
}

// ─── Exported card (wraps with optimistic removal transition) ─────────────────
export function WishlistCard({ item, view = 'grid', onRemove, onAddToCart }: WishlistCardProps) {
    const [qty, setQty]           = useState(item.quantity ?? 1);
    const [removing, setRemoving] = useState(false);

    // CSS-transition optimistic removal — no framer-motion dependency needed
    const handleConfirmRemove = () => {
        setRemoving(true);
        setTimeout(() => onRemove(item.id), 300);
    };

    const internals: InternalProps = {
        item,
        qty,
        setQty,
        onConfirmRemove: handleConfirmRemove,
        onAddToCart,
    };

    return (
        // opacity-0 + translate-y-2 exit, duration-300 matches the timeout above
        <div
            className={cn(
                'transition-all duration-300 ease-in-out',
                removing && 'opacity-0 translate-y-2 scale-95 pointer-events-none',
            )}
        >
            {view === 'list'
                ? <ListRow {...internals} />
                : <GridCard {...internals} />
            }
        </div>
    );
}
