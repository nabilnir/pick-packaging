"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import TopCategoryTabs from './top-category-tabs';
import FilterSidebar from './filter-sidebar';
import ProductCard from './product-card';
import Pagination from '../../ui/pagination';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

const ShopGrid = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedCategories, setSelectedCategories] = useState(['all']);
    const [selectedMaterials, setSelectedMaterials] = useState(['all']);
    const [sortBy, setSortBy] = useState('latest');
    const [showFilters, setShowFilters] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, activeTab, selectedCategories, selectedMaterials, sortBy]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const result = await response.json();
                if (result.success) {
                    setProducts(result.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTab = activeTab === 'all' || product.subCategory?.toLowerCase() === activeTab;
            const matchesCategory = selectedCategories.includes('all') || (product.category && selectedCategories.includes(product.category.toLowerCase()));
            const matchesMaterial = selectedMaterials.includes('all') || (product.material && selectedMaterials.includes(product.material.toLowerCase()));

            return matchesSearch && matchesTab && matchesCategory && matchesMaterial;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0; // default latest
        });
    }, [products, searchQuery, activeTab, selectedCategories, selectedMaterials, sortBy]);

    const { totalPages, displayedProducts } = useMemo(() => {
        const pages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        const displayed = filteredProducts.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
        return { totalPages: pages, displayedProducts: displayed };
    }, [filteredProducts, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const { categories, materials } = useMemo(() => {
        const catMap = new Map<string, number>();
        const matMap = new Map<string, number>();

        products.forEach(product => {
            if (product.category) {
                const cat = product.category;
                catMap.set(cat, (catMap.get(cat) || 0) + 1);
            }
            if (product.material) {
                const mat = product.material;
                matMap.set(mat, (matMap.get(mat) || 0) + 1);
            }
        });

        const cats = [
            { id: 'all', label: 'All' },
            ...Array.from(catMap.entries()).map(([label, count]) => ({
                id: label.toLowerCase(),
                label,
                count
            })).sort((a, b) => a.label.localeCompare(b.label))
        ];

        const mats = [
            { id: 'all', label: 'All' },
            ...Array.from(matMap.entries()).map(([label, count]) => ({
                id: label.toLowerCase(),
                label,
                count
            })).sort((a, b) => a.label.localeCompare(b.label))
        ];

        return { categories: cats, materials: mats };
    }, [products]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-brand-green opacity-20" />
                <p className="font-display text-xl font-light opacity-40">Loading products...</p>
            </div>
        );
    }

    return (
        <section className="bg-background pt-[160px] pb-[160px]">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <h1 className="text-[clamp(3rem,8vw,6rem)] font-light leading-[1.0] font-display">
                        Shop all products
                    </h1>
                    <div className="relative w-full md:w-[320px]">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-foreground/10 py-4 pr-10 focus:outline-none focus:border-foreground transition-all font-light text-[1.25rem]"
                        />
                        <Search className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40" size={24} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex gap-12 relative">
                    {/* Filter Sidebar */}
                    <div className={cn(
                        "transition-all duration-500 overflow-hidden",
                        showFilters ? "w-[300px] opacity-100" : "w-0 opacity-0 pointer-events-none"
                    )}>
                        <FilterSidebar
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedMaterials={selectedMaterials}
                            setSelectedMaterials={setSelectedMaterials}
                            categories={categories}
                            materials={materials}
                        />
                    </div>

                    {/* Product Listing Area */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                            <div className="flex items-center gap-8 w-full md:w-auto overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-widest hover:text-brand-green transition-colors whitespace-nowrap"
                                >
                                    <SlidersHorizontal size={18} />
                                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                                </button>
                                <div className="h-4 w-[1px] bg-foreground/10 hidden md:block" />
                                <TopCategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />
                            </div>

                            <div className="flex items-center gap-2 text-[14px] ml-auto">
                                <span className="opacity-40">Sort by:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent font-medium focus:outline-none cursor-pointer"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="price-low">Price Low to High</option>
                                    <option value="price-high">Price High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                            {/* Promotional Delivery Card */}
                            {(activeTab === 'all' || activeTab === 'takeout') && (
                                <div className="bg-[#E4E5D4] rounded-[8px] p-8 flex flex-col justify-between aspect-square group overflow-hidden relative">
                                    <div>
                                        <span className="text-[12px] uppercase tracking-widest opacity-60 mb-4 block">Delivery</span>
                                        <h3 className="text-[2rem] font-light leading-tight mb-4">
                                            We offer nationwide delivery.
                                        </h3>
                                    </div>
                                    <div className="relative h-32 w-full mb-8">
                                        <div className="absolute inset-0 bg-[url('/images/delivery-line.png')] bg-contain bg-no-repeat opacity-40 group-hover:translate-x-4 transition-transform duration-700" />
                                        <div className="w-full h-full border-b border-foreground/10 flex items-center justify-center">
                                            <Image
                                                src="/images/food-processing.png"
                                                alt="Delivery"
                                                fill
                                                className="object-contain opacity-20 grayscale"
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[12px] opacity-60">
                                        Free delivery applies for orders over R2000 incl. vat
                                    </span>
                                </div>
                            )}

                            {displayedProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}

                            {/* Promotional Rewards Card */}
                            {(activeTab === 'all' || activeTab === 'extras') && (
                                <div className="bg-[#B5B3A7] rounded-[8px] p-8 flex flex-col justify-between aspect-square text-white">
                                    <div>
                                        <span className="text-[12px] uppercase tracking-widest opacity-60 mb-4 block">Yucca Rewards</span>
                                        <h3 className="text-[2rem] font-light leading-tight mb-4">
                                            Get 5% back on every purchase*
                                        </h3>
                                    </div>
                                    <span className="text-[11px] opacity-60">
                                        *Ts&Cs apply
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="mt-20">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-24 text-center">
                                <h3 className="text-[1.5rem] font-light opacity-40">No products found matching your criteria.</h3>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveTab('all'); setSelectedCategories(['all']); setSelectedMaterials(['all']); }}
                                    className="mt-4 text-brand-green border-b border-brand-green/20 hover:border-brand-green transition-all"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShopGrid;

