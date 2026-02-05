"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FadeIn from '../ui/fade-in';

const NewProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const result = await response.json();
                if (result.success) {
                    const newProducts = result.data
                        .filter((p: any) => p.isNew)
                        .slice(0, 4);
                    setProducts(newProducts);
                }
            } catch (error) {
                console.error('Error fetching new products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) return null;

    return (
        <section className="bg-background py-32 md:py-48 px-8 md:px-[60px] transition-colors duration-500">
            <div className="max-w-[1440px] mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] text-foreground font-light tracking-tight font-display">New Products</h2>
                    <Link
                        href="/shop"
                        className="group relative inline-flex items-center px-10 py-4 border border-foreground/10 rounded-[4px] text-[13px] font-semibold uppercase tracking-widest text-foreground transition-all duration-500 hover:bg-foreground hover:text-background"
                    >
                        Shop now
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
                    {products.map((product, index) => (
                        <FadeIn key={product._id || product.id} delay={index * 0.1} direction="up" className="h-full">
                            <Link href={`/shop/${product.slug}`} className="group cursor-pointer block h-full">
                                {/* Image Container */}
                                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-8 transition-all duration-700 ease-out">
                                    {/* New Badge */}
                                    <div className="absolute top-0 right-10 z-10 transition-transform duration-500 group-hover:-translate-y-1">
                                        <div className="bg-brand-green text-white px-2.5 py-6 flex flex-col items-center justify-center rounded-b-sm shadow-xl">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">
                                                New
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product Image */}
                                    <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain opacity-90 transition-all duration-500 group-hover:opacity-100"
                                            priority={false}
                                        />
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-3 px-1">
                                    <h3 className="text-foreground text-[1.25rem] font-light leading-snug transition-all duration-300 group-hover:text-brand-green font-display">
                                        {product.name}
                                    </h3>
                                    <p className="text-foreground/50 text-[15px] font-light flex items-center gap-2">
                                        <span className="text-foreground font-medium">From {product.currency}{product.price.toFixed(2)}</span>
                                        <span className="text-[10px] opacity-40 uppercase tracking-widest leading-none">incl. vat</span>
                                    </p>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewProducts;