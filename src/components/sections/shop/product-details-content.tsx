"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ZoomIn } from 'lucide-react';
import ProductOptions from './product-options';
import ProductInfoAccordion from './product-info-accordion';
import WishlistButton from '@/components/ui/wishlist-button';

interface ProductDetailsContentProps {
    product: any;
}

const ProductDetailsContent = ({ product }: ProductDetailsContentProps) => {
    if (!product) return <div>Product not found</div>;

    return (
        <section className="bg-background pt-[140px] pb-[160px]">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[12px] uppercase tracking-widest mb-12 opacity-60">
                    <Link href="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
                    <span className="opacity-20">/</span>
                    <span className="text-foreground">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left: Product Image */}
                    <div className="relative group">
                        <div className="aspect-square bg-[#F5F5F0] rounded-[12px] overflow-hidden flex items-center justify-center p-12">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-12 hover:scale-110 transition-transform duration-1000"
                                priority
                            />
                        </div>
                        <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ZoomIn size={20} className="text-foreground/40" />
                        </button>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col">
                        {/* Title + wishlist row */}
                        <div className="flex items-start justify-between gap-4 mb-8">
                            <h1 className="text-[3.5rem] md:text-[4.5rem] font-light leading-tight font-display">
                                {product.name}
                            </h1>
                            <div className="mt-4 shrink-0">
                                <WishlistButton
                                    product={{
                                        id: product._id || product.id,
                                        name: product.name,
                                        slug: product.slug,
                                        image: product.image,
                                        price: product.price,
                                        currency: product.currency,
                                        isNew: product.isNew,
                                    }}
                                    size={18}
                                    className="w-11 h-11"
                                />
                            </div>
                        </div>
                        <ProductOptions
                            productId={product._id || product.id}
                            name={product.name}
                            image={product.image}
                            basePrice={product.price}
                            currency={product.currency}
                            volumes={product.volumes || []}
                            packingTypes={product.packingTypes || []}
                        />

                        <ProductInfoAccordion
                            description={product.description}
                            additionalInfo={product.additionalInfo}
                            dimensions={product.dimensions}
                            storage={product.storage}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductDetailsContent;
