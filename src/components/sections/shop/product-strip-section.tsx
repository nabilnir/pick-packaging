"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import WishlistButton from '@/components/ui/wishlist-button';
import { cn } from '@/lib/utils';

interface ProductStrip {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    image: string;
    isNew?: boolean;
    inStock?: boolean;
    category?: string;
}

interface ProductStripSectionProps {
    title: string;
    subtitle?: string;
    products: ProductStrip[];
    viewAllHref?: string;
    accentColor?: string;
}

export default function ProductStripSection({
    title,
    subtitle,
    products,
    viewAllHref = '/shop',
}: ProductStripSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (products.length === 0) return null;

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    };

    return (
        <section className="py-20 border-t border-foreground/5">
            <div className="container">
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-light font-display leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-[14px] opacity-40 mt-1 font-light">{subtitle}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Scroll arrows */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:border-foreground/40 hover:bg-foreground/5 transition-all"
                                aria-label="Scroll left"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center hover:border-foreground/40 hover:bg-foreground/5 transition-all"
                                aria-label="Scroll right"
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        <Link
                            href={viewAllHref}
                            className="flex items-center gap-1.5 text-[13px] font-medium uppercase tracking-widest text-brand-green border-b border-brand-green/20 hover:border-brand-green transition-all pb-0.5"
                        >
                            View all
                            <ArrowRight size={13} />
                        </Link>
                    </div>
                </div>

                {/* Horizontal scroll strip */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group flex-shrink-0 w-[220px] md:w-[260px]"
                        >
                            {/* Image card */}
                            <div className="relative aspect-square rounded-[8px] overflow-hidden bg-foreground/3 mb-4">
                                <Link href={`/product/${product.id}`}>
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                                    />
                                </Link>

                                {/* NEW badge */}
                                {product.isNew && (
                                    <span className="absolute top-2 left-2 bg-brand-green text-white text-[9px] px-2 py-0.5 rounded-sm font-medium uppercase tracking-wider">
                                        New
                                    </span>
                                )}

                                {/* Out of stock overlay */}
                                {product.inStock === false && (
                                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                                        <span className="text-[11px] font-medium uppercase tracking-widest opacity-60">Out of Stock</span>
                                    </div>
                                )}

                                {/* Wishlist — appears on hover */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <WishlistButton
                                        product={{
                                            id: product.id,
                                            name: product.name,
                                            slug: product.slug,
                                            price: product.price,
                                            currency: product.currency,
                                            image: product.image,
                                            isNew: product.isNew,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Info */}
                            <Link href={`/product/${product.id}`}>
                                <h3 className={cn(
                                    "text-[14px] font-light leading-snug mb-1.5 line-clamp-2 transition-colors",
                                    "group-hover:text-brand-green"
                                )}>
                                    {product.name}
                                </h3>
                                <p className="text-[13px] font-medium">
                                    From {product.currency}{product.price.toFixed(2)}
                                    <span className="text-[11px] opacity-40 font-light ml-1">incl. vat</span>
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
