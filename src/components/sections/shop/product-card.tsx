"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: {
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
    return (
        <Link
            href={`/product/${product.id}`}
            className="group flex flex-col h-full"
        >
            <div className="relative aspect-square rounded-[8px] overflow-hidden mb-4">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-700"
                />

                {product.isNew && (
                    <div className="absolute top-0 right-4 bg-foreground/80 text-background px-3 py-1 text-[10px] font-medium uppercase tracking-widest origin-bottom-right rotate-90 translate-x-[100%]">
                        NEW
                    </div>
                )}

                {!product.inStock && (
                    <div className="absolute bottom-0 right-4 bg-foreground/80 text-background px-3 py-1 text-[10px] font-medium uppercase tracking-widest origin-top-right rotate-90 translate-x-[100%]">
                        OUT OF STOCK
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow">
                <h3 className="text-[16px] font-light text-foreground group-hover:text-brand-green transition-colors leading-tight mb-2">
                    {product.name}
                </h3>
                <p className="text-[14px] font-medium text-foreground">
                    From £{product.price.toFixed(2)} <span className="text-[12px] opacity-40 font-light ml-1">incl. vat</span>
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;
