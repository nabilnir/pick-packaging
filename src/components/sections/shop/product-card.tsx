"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import WishlistButton from '@/components/ui/wishlist-button';

interface ProductCardProps {
    product: {
        _id?: string;
        id: string;
        name: string;
        slug: string;
        price: number;
        currency: string;
        image: string;
        isNew?: boolean;
        inStock?: boolean;
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const productId = product._id || product.id;

    return (
        <div className="group flex flex-col h-full relative">
            <Link href={`/product/${productId}`} className="flex flex-col h-full">
                {/* Image container */}
                <div className="relative aspect-square rounded-[8px] overflow-hidden mb-4 bg-foreground/3">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* NEW badge */}
                    {product.isNew && (
                        <div className="absolute top-0 right-4 bg-foreground/80 text-background px-3 py-1 text-[10px] font-medium uppercase tracking-widest origin-bottom-right rotate-90 translate-x-[100%]">
                            NEW
                        </div>
                    )}

                    {/* OUT OF STOCK badge */}
                    {product.inStock === false && (
                        <div className="absolute bottom-0 right-4 bg-foreground/80 text-background px-3 py-1 text-[10px] font-medium uppercase tracking-widest origin-top-right rotate-90 translate-x-[100%]">
                            OUT OF STOCK
                        </div>
                    )}

                    {/* Wishlist button — top-left, fades in on hover */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <WishlistButton
                            product={{
                                id: productId,
                                name: product.name,
                                slug: product.slug,
                                image: product.image,
                                price: product.price,
                                currency: product.currency,
                                isNew: product.isNew,
                            }}
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-grow">
                    <h3 className="text-[16px] font-light text-foreground group-hover:text-brand-green transition-colors leading-tight mb-2">
                        {product.name}
                    </h3>
                    <p className="text-[14px] font-medium text-foreground">
                        From {product.currency}{product.price.toFixed(2)}{' '}
                        <span className="text-[12px] opacity-40 font-light ml-1">incl. vat</span>
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
