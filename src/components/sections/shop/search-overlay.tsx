"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Loader2, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: string;
    _id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    image: string;
    category: string;
}

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allProducts, setAllProducts] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    // Lock scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Fetch products once to search client-side for speed
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) setAllProducts(data.data);
            })
            .catch(err => console.error("Search fetch error:", err));
    }, []);

    // Search logic
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            const filtered = allProducts.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setResults(filtered);
            setIsLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [query, allProducts]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[301] flex flex-col bg-background/98 backdrop-blur-md animate-in fade-in duration-300">
            {/* Header */}
            <div className="container px-8 py-6 flex items-center justify-between border-b border-foreground/5">
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <Search className="text-foreground/40" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products, materials, collections..."
                        className="w-full bg-transparent text-[1.5rem] font-light focus:outline-none placeholder:text-foreground/20"
                    />
                    {isLoading && <Loader2 className="animate-spin text-brand-green" size={20} />}
                </div>
                <button 
                    onClick={onClose}
                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="container px-8 py-12">
                    {query.length >= 2 ? (
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-[12px] uppercase tracking-widest text-foreground/40 mb-8">
                                {results.length > 0 ? `Results for "${query}"` : "No results found"}
                            </h3>
                            
                            {results.length > 0 ? (
                                <div className="space-y-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/product/${product._id}`}
                                            onClick={onClose}
                                            className="group flex gap-8 items-center p-4 -mx-4 rounded-2xl hover:bg-foreground/3 transition-colors"
                                        >
                                            <div className="relative w-24 h-24 rounded-xl bg-foreground/5 overflow-hidden shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[12px] text-brand-green font-medium uppercase tracking-wider mb-1">
                                                    {product.category}
                                                </p>
                                                <h4 className="text-[1.25rem] font-light leading-tight">
                                                    {product.name}
                                                </h4>
                                                <p className="text-[16px] font-medium mt-1">
                                                    {product.currency}{product.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                                                <ArrowRight size={18} />
                                            </div>
                                        </Link>
                                    ))}
                                    
                                    <Link
                                        href={`/shop?search=${query}`}
                                        onClick={onClose}
                                        className="inline-flex items-center gap-2 text-brand-green font-medium mt-4 group"
                                    >
                                        View all results
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-6">
                                        <PackageSearch size={32} strokeWidth={1} className="opacity-20" />
                                    </div>
                                    <p className="text-foreground/40 italic">Try searching for something else...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-[12px] uppercase tracking-widest text-foreground/40 mb-8">Popular Searches</h3>
                            <div className="flex flex-wrap gap-3">
                                {['Cups', 'Lids', 'Eco-Friendly', 'Bakery Trays', 'Clamshells'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-6 py-3 rounded-full border border-foreground/10 hover:border-brand-green hover:text-brand-green transition-all text-[14px]"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
