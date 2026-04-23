"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

export default function MiniCart() {
    const {
        items,
        itemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
    } = useCart();

    // Lock body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isCartOpen]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsCartOpen(false); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [setIsCartOpen]);

    return (
        <>
            {/* ── Backdrop ─────────────────────────────────────────── */}
            <div
                onClick={() => setIsCartOpen(false)}
                className={cn(
                    "fixed inset-0 z-[200] bg-foreground/20 backdrop-blur-sm transition-opacity duration-500",
                    isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                aria-hidden="true"
            />

            {/* ── Drawer ───────────────────────────────────────────── */}
            <aside
                aria-label="Shopping cart"
                className={cn(
                    "fixed inset-y-0 right-0 z-[201] flex flex-col w-full sm:w-[420px] bg-background",
                    "shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* ── Header ───────────────────────────────────────── */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-foreground/5">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        <span className="text-[1rem] font-medium">
                            Your Cart
                        </span>
                        {itemCount > 0 && (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-white text-[11px] font-medium">
                                {itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
                        aria-label="Close cart"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* ── Body ─────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {items.length === 0 ? (
                        /* ── Empty state ──────────────────────────── */
                        <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                                <Package size={32} strokeWidth={1} className="opacity-30" />
                            </div>
                            <h3 className="text-[1.25rem] font-light mb-2">Your cart is empty</h3>
                            <p className="text-[14px] opacity-40 mb-8 font-light leading-relaxed">
                                Browse our range of premium packaging products and add items to your cart.
                            </p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest text-brand-green border-b border-brand-green/30 hover:border-brand-green transition-all pb-0.5"
                            >
                                Continue Shopping
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    ) : (
                        /* ── Item list ────────────────────────────── */
                        <div className="px-8 py-6 space-y-6">
                            {items.map((item, index) => (
                                <div key={item.id}>
                                    {index > 0 && <div className="border-t border-foreground/5 mb-6" />}
                                    <div className="flex gap-5">
                                        {/* Image */}
                                        <div className="relative w-20 h-20 rounded-[8px] bg-foreground/5 flex-shrink-0 overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="text-[14px] font-medium leading-snug line-clamp-2">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[12px] opacity-40 mt-0.5">
                                                        {item.packingType.name} · {item.packingType.units} units
                                                        {item.volume && ` · ${item.volume}`}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-foreground/30"
                                                    aria-label={`Remove ${item.name}`}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            {/* Qty + Price row */}
                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity stepper */}
                                                <div className="flex items-center border border-foreground/10 rounded-full overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-[13px] font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-foreground/5 transition-colors text-foreground/50 hover:text-foreground"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>

                                                {/* Line total */}
                                                <span className="text-[14px] font-medium">
                                                    {item.currency}
                                                    {(item.price * item.packingType.units * item.packingType.priceMultiplier * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer ───────────────────────────────────────── */}
                {items.length > 0 && (
                    <div className="border-t border-foreground/5 bg-background px-8 py-8 space-y-6">
                        {/* Free shipping progress */}
                        {(() => {
                            const FREE_SHIPPING = 100;
                            const remaining = Math.max(0, FREE_SHIPPING - subtotal);
                            const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
                            return (
                                <div className="space-y-2">
                                    {remaining > 0 ? (
                                        <p className="text-[12px] opacity-50 font-light text-center">
                                            Add <span className="font-medium text-brand-green">R{remaining.toFixed(2)}</span> more for free shipping
                                        </p>
                                    ) : (
                                        <p className="text-[12px] text-brand-green font-medium text-center">
                                            🎉 You qualify for free shipping!
                                        </p>
                                    )}
                                    <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-brand-green rounded-full transition-all duration-700"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Subtotal */}
                        <div className="flex justify-between items-baseline">
                            <span className="text-[14px] opacity-60 font-light">Subtotal</span>
                            <div className="text-right">
                                <span className="text-[1.5rem] font-light">
                                    R{subtotal.toFixed(2)}
                                </span>
                                <span className="text-[12px] opacity-40 ml-1">incl. vat</span>
                            </div>
                        </div>
                        <p className="text-[11px] opacity-30 text-center -mt-2 font-light">
                            Shipping calculated at checkout
                        </p>

                        {/* CTA buttons */}
                        <div className="space-y-3">
                            <Link
                                href="/checkout"
                                onClick={() => setIsCartOpen(false)}
                                className="flex items-center justify-center gap-2 w-full bg-brand-green text-white py-4 rounded-full font-medium uppercase tracking-widest text-[13px] hover:opacity-90 transition-opacity"
                            >
                                Proceed to Checkout
                                <ArrowRight size={16} />
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-full text-[13px] font-light opacity-40 hover:opacity-70 transition-opacity uppercase tracking-widest py-2"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
