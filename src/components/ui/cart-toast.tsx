"use client";

import React from 'react';
import { useCart } from '@/contexts/cart-context';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CartToast() {
    const { showToast, toastItem, hideToast } = useCart();

    if (!showToast || !toastItem) return null;

    return (
        <div
            className={cn(
                "fixed top-24 right-4 z-50 bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg shadow-lg p-4 w-[320px]",
                "animate-in slide-in-from-right-5 duration-300"
            )}
        >
            <button
                onClick={hideToast}
                className="absolute top-2 right-2 text-foreground/40 hover:text-foreground transition-colors"
            >
                <X size={16} />
            </button>

            <div className="flex gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                        src={toastItem.image}
                        alt={toastItem.name}
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-foreground leading-snug">
                        <span className="font-medium">{toastItem.name}</span>
                        {toastItem.volume && ` - ${toastItem.volume}`} was added to your cart.
                    </p>
                </div>
            </div>

            <Link
                href="/cart"
                onClick={hideToast}
                className="mt-3 block w-fit border border-foreground/20 bg-white px-4 py-2 text-[13px] font-medium hover:bg-foreground/5 transition-colors rounded-md"
            >
                View cart
            </Link>
        </div>
    );
}
