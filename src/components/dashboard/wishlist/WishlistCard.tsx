"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WishlistItem } from '@/contexts/wishlist-context';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface WishlistCardProps {
    item: WishlistItem & { inStock?: boolean };
    view: 'grid' | 'list';
    onAddToCart: (item: WishlistItem) => void;
    onRemove: (id: string) => void;
}

// ─── Currency formatter ───────────────────────────────────────────────────────
function fmtPrice(price: number, currency: string) {
    return `${currency || 'R'}${price.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ item, onAddToCart, onRemove }: Omit<WishlistCardProps, 'view'>) {
    const outOfStock = item.inStock === false;
    const href = `/product/${item.slug || item.id}`;

    return (
        <div className={cn(
            'group relative bg-white rounded-xl border border-border overflow-hidden',
            'hover:border-[#1c3a2a]/25 hover:shadow-md transition-all duration-300',
            outOfStock && 'opacity-80'
        )}>
            {/* ── Image block ──────────────────────────────────────────────── */}
            <Link href={href} className="relative block aspect-square bg-[#f7f6f2] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className={cn(
                        'object-contain p-6 transition-transform duration-700',
                        !outOfStock && 'group-hover:scale-105'
                    )}
                />

                {/* Status badges */}
                {outOfStock ? (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-sm bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest">
                        Out of Stock
                    </span>
                ) : item.isNew ? (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-sm bg-[#1c3a2a] text-white text-[10px] font-bold uppercase tracking-widest">
                        New
                    </span>
                ) : null}

                {/* Hover: view product overlay */}
                <div className="absolute inset-0 bg-[#1a1f1a]/0 group-hover:bg-[#1a1f1a]/5 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-[#1a1f1a] shadow-sm">
                        <ExternalLink size={11} />
                        View Product
                    </span>
                </div>
            </Link>

            {/* ── Body ─────────────────────────────────────────────────────── */}
            <div className="p-4">
                {/* Name */}
                <Link href={href}>
                    <h3 className="text-[13px] font-semibold text-[#1a1f1a] leading-snug mb-1 line-clamp-2 hover:text-[#1c3a2a] transition-colors">
                        {item.name}
                    </h3>
                </Link>

                {/* Price */}
                <p className="text-[16px] font-bold text-[#1a1f1a] mb-3">
                    {fmtPrice(item.price, item.currency)}
                    <span className="text-[11px] font-normal text-muted-foreground ml-1">incl. VAT</span>
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onAddToCart(item)}
                        disabled={outOfStock}
                        id={`wishlist-add-cart-${item.id}`}
                        className={cn(
                            'flex-1 py-2.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-widest',
                            'flex items-center justify-center gap-1.5 transition-all',
                            outOfStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#1c3a2a] text-white hover:bg-[#243d2e] active:scale-[0.98]'
                        )}
                    >
                        <ShoppingCart size={12} />
                        {outOfStock ? 'Unavailable' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={() => onRemove(item.id)}
                        id={`wishlist-remove-${item.id}`}
                        title={`Remove ${item.name}`}
                        aria-label={`Remove ${item.name} from wishlist`}
                        className="p-2.5 rounded-lg border border-border text-muted-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── List Card ────────────────────────────────────────────────────────────────
function ListCard({ item, onAddToCart, onRemove }: Omit<WishlistCardProps, 'view'>) {
    const outOfStock = item.inStock === false;
    const href = `/product/${item.slug || item.id}`;

    return (
        <div className={cn(
            'group flex items-center gap-5 bg-white rounded-xl border border-border p-4',
            'hover:border-[#1c3a2a]/25 hover:shadow-sm transition-all duration-300',
            outOfStock && 'opacity-75'
        )}>
            {/* Thumbnail */}
            <Link href={href} className="relative w-[80px] h-[80px] rounded-lg bg-[#f7f6f2] shrink-0 overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-0.5">
                    <Link href={href} className="flex-1 min-w-0">
                        <h3 className="text-[14px] font-semibold text-[#1a1f1a] leading-snug truncate hover:text-[#1c3a2a] transition-colors">
                            {item.name}
                        </h3>
                    </Link>
                    {outOfStock ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-sm bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest">
                            Out of Stock
                        </span>
                    ) : item.isNew ? (
                        <span className="shrink-0 px-2 py-0.5 rounded-sm bg-[#1c3a2a] text-white text-[10px] font-bold uppercase tracking-widest">
                            New
                        </span>
                    ) : null}
                </div>
                <p className="text-[15px] font-bold text-[#1a1f1a] mb-0">
                    {fmtPrice(item.price, item.currency)}
                    <span className="text-[11px] font-normal text-muted-foreground ml-1">incl. VAT</span>
                </p>
            </div>

            {/* Actions — right aligned */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => onAddToCart(item)}
                    disabled={outOfStock}
                    id={`wishlist-list-add-cart-${item.id}`}
                    className={cn(
                        'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all',
                        outOfStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#1c3a2a] text-white hover:bg-[#243d2e] active:scale-[0.98]'
                    )}
                >
                    <ShoppingCart size={12} />
                    {outOfStock ? 'Unavailable' : 'Add to Cart'}
                </button>
                <button
                    onClick={() => onRemove(item.id)}
                    id={`wishlist-list-remove-${item.id}`}
                    title={`Remove ${item.name}`}
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

// ─── Exported component ───────────────────────────────────────────────────────
export function WishlistCard({ item, view, onAddToCart, onRemove }: WishlistCardProps) {
    return view === 'list'
        ? <ListCard item={item} onAddToCart={onAddToCart} onRemove={onRemove} />
        : <GridCard item={item} onAddToCart={onAddToCart} onRemove={onRemove} />;
}
