"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, ShoppingBag, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '@/contexts/wishlist-context';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';

export default function WishlistDrawer() {
    const { items, itemCount, removeFromWishlist, clearWishlist, isOpen, setIsOpen } = useWishlist();
    const { setIsCartOpen } = useCart();
    const { success } = useToast();

    // Lock scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [setIsOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setIsOpen(false)}
                className={cn(
                    'fixed inset-0 z-[200] bg-foreground/20 backdrop-blur-sm transition-opacity duration-500',
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className={cn(
                    'fixed inset-y-0 right-0 z-[201] flex flex-col w-full sm:w-[420px] bg-background',
                    'shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-foreground/5">
                    <div className="flex items-center gap-3">
                        <Heart size={20} strokeWidth={1.5} />
                        <span className="text-[1rem] font-medium">Saved Items</span>
                        {itemCount > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-background text-[11px] font-medium">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                                <Heart size={32} strokeWidth={1} className="opacity-20" />
                            </div>
                            <h3 className="text-[1.25rem] font-light mb-2">Nothing saved yet</h3>
                            <p className="text-[14px] opacity-40 mb-8 font-light leading-relaxed">
                                Tap the heart icon on any product to save it for later.
                            </p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest border-b border-foreground/20 hover:border-foreground transition-all pb-0.5"
                            >
                                Browse Products
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="px-8 py-6 space-y-1">
                            {/* Clear all */}
                            {items.length > 1 && (
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => { clearWishlist(); success('Wishlist cleared'); }}
                                        className="text-[12px] opacity-30 hover:opacity-60 transition-opacity uppercase tracking-widest"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}

                            {items.map((item, i) => (
                                <div key={item.id}>
                                    {i > 0 && <div className="border-t border-foreground/5 my-5" />}
                                    <div className="flex gap-5 group">
                                        {/* Image */}
                                        <Link
                                            href={`/product/${item.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="relative w-20 h-20 rounded-[8px] bg-foreground/5 shrink-0 overflow-hidden"
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {item.isNew && (
                                                <span className="absolute top-1 left-1 bg-brand-green text-white text-[9px] px-1.5 py-0.5 rounded-sm font-medium uppercase tracking-wider">
                                                    New
                                                </span>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <Link
                                                    href={`/product/${item.id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-[14px] font-medium leading-snug line-clamp-2 hover:text-brand-green transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                                <button
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-foreground/30"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            <p className="text-[14px] font-medium mt-1">
                                                From {item.currency}{item.price.toFixed(2)}
                                                <span className="text-[11px] opacity-40 font-light ml-1">incl. vat</span>
                                            </p>

                                            {/* CTA */}
                                            <Link
                                                href={`/product/${item.id}`}
                                                onClick={() => setIsOpen(false)}
                                                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-widest text-brand-green border-b border-brand-green/20 hover:border-brand-green transition-all pb-0.5 w-fit"
                                            >
                                                View Product
                                                <ArrowRight size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-foreground/5 px-8 py-6">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-foreground/3 border border-foreground/5 mb-5">
                            <Sparkles size={16} className="opacity-30 shrink-0" />
                            <p className="text-[12px] opacity-40 font-light leading-snug">
                                Saved items are stored in your browser. Sign in to sync across devices.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-4 rounded-full font-medium uppercase tracking-widest text-[13px] hover:bg-brand-green transition-colors"
                        >
                            Continue Shopping
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}
