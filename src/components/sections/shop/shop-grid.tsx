"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import TopCategoryTabs from './top-category-tabs';
import FilterSidebar from './filter-sidebar';
import ProductCard from './product-card';
import Pagination from '../../ui/pagination';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

/* ─── Skeleton card ─────────────────────────────────────────────── */
const SkeletonCard = () => (
    <div className="flex flex-col gap-4 animate-pulse">
        <div className="aspect-square rounded-[8px] bg-foreground/5" />
        <div className="h-4 w-3/4 rounded bg-foreground/5" />
        <div className="h-3 w-1/3 rounded bg-foreground/5" />
    </div>
);

/* ─── Sort option definition ─────────────────────────────────────── */
const SORT_OPTIONS = [
    { value: 'latest',     label: 'Newest First' },
    { value: 'price-low',  label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'name-az',    label: 'Name: A → Z' },
    { value: 'name-za',    label: 'Name: Z → A' },
];

/* ─── Active filter chip ─────────────────────────────────────────── */
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <button
        onClick={onRemove}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-[12px] font-medium hover:border-brand-green hover:text-brand-green transition-all group"
    >
        {label}
        <X size={11} className="opacity-40 group-hover:opacity-100" />
    </button>
);

/* ─── Main component ─────────────────────────────────────────────── */
const ShopGrid = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery]         = useState('');
    const [activeTab, setActiveTab]             = useState('all');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
    const [selectedMaterials, setSelectedMaterials]   = useState<string[]>(['all']);
    const [priceRange, setPriceRange]           = useState<[number, number]>([0, 0]);
    const [inStockOnly, setInStockOnly]         = useState(false);

    // UI
    const [sortBy, setSortBy]               = useState('latest');
    const [showSortMenu, setShowSortMenu]   = useState(false);
    const [showFilters, setShowFilters]     = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [currentPage, setCurrentPage]     = useState(1);

    // ── Fetch ──────────────────────────────────────────────────────
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

    // ── Reset page on filter change ────────────────────────────────
    useEffect(() => { setCurrentPage(1); }, [
        searchQuery, activeTab, selectedCategories, selectedMaterials, sortBy, priceRange, inStockOnly
    ]);

    // ── Derive max price and init price range ──────────────────────
    const maxPrice = useMemo(() => {
        if (products.length === 0) return 0;
        return Math.ceil(Math.max(...products.map(p => p.price ?? 0)));
    }, [products]);

    useEffect(() => {
        if (maxPrice > 0 && priceRange[1] === 0) {
            setPriceRange([0, maxPrice]);
        }
    }, [maxPrice]);

    // ── Derive unique subCategory tabs from data ───────────────────
    const tabs = useMemo(() => {
        const subCatMap = new Map<string, number>();
        products.forEach(p => {
            if (p.subCategory) {
                const sc = p.subCategory.toLowerCase();
                subCatMap.set(sc, (subCatMap.get(sc) || 0) + 1);
            }
        });
        return [
            { id: 'all', label: 'All Products', count: products.length },
            ...Array.from(subCatMap.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([id, count]) => ({
                    id,
                    label: id.charAt(0).toUpperCase() + id.slice(1),
                    count,
                })),
        ];
    }, [products]);

    // ── Derive filter options from data ────────────────────────────
    const { categories, materials } = useMemo(() => {
        const catMap = new Map<string, number>();
        const matMap = new Map<string, number>();
        products.forEach(p => {
            if (p.category) catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
            if (p.material)  matMap.set(p.material,  (matMap.get(p.material)  || 0) + 1);
        });
        return {
            categories: [
                { id: 'all', label: 'All' },
                ...Array.from(catMap.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([label, count]) => ({ id: label.toLowerCase(), label, count })),
            ],
            materials: [
                { id: 'all', label: 'All' },
                ...Array.from(matMap.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([label, count]) => ({ id: label.toLowerCase(), label, count })),
            ],
        };
    }, [products]);

    // ── Main filter + sort pipeline ────────────────────────────────
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch   = product.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesTab      = activeTab === 'all' || product.subCategory?.toLowerCase() === activeTab;
                const matchesCategory = selectedCategories.includes('all') || (product.category && selectedCategories.includes(product.category.toLowerCase()));
                const matchesMaterial = selectedMaterials.includes('all') || (product.material && selectedMaterials.includes(product.material.toLowerCase()));
                const matchesPrice    = maxPrice === 0 || (product.price >= priceRange[0] && product.price <= priceRange[1]);
                const matchesStock    = !inStockOnly || product.inStock === true;
                return matchesSearch && matchesTab && matchesCategory && matchesMaterial && matchesPrice && matchesStock;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'price-low':  return a.price - b.price;
                    case 'price-high': return b.price - a.price;
                    case 'name-az':    return a.name.localeCompare(b.name);
                    case 'name-za':    return b.name.localeCompare(a.name);
                    default:           return 0; // latest = server order
                }
            });
    }, [products, searchQuery, activeTab, selectedCategories, selectedMaterials, priceRange, inStockOnly, sortBy, maxPrice]);

    // ── Pagination ─────────────────────────────────────────────────
    const { totalPages, displayedProducts } = useMemo(() => {
        const pages    = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
        const displayed = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return { totalPages: pages, displayedProducts: displayed };
    }, [filteredProducts, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Active filter count (for chips / mobile badge) ─────────────
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (!selectedCategories.includes('all')) count += selectedCategories.length;
        if (!selectedMaterials.includes('all'))  count += selectedMaterials.length;
        if (inStockOnly)                         count += 1;
        if (maxPrice > 0 && (priceRange[0] > 0 || priceRange[1] < maxPrice)) count += 1;
        return count;
    }, [selectedCategories, selectedMaterials, inStockOnly, priceRange, maxPrice]);

    const clearAll = useCallback(() => {
        setSelectedCategories(['all']);
        setSelectedMaterials(['all']);
        setInStockOnly(false);
        if (maxPrice > 0) setPriceRange([0, maxPrice]);
    }, [maxPrice]);

    const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? 'Newest First';

    // ── Chip list ──────────────────────────────────────────────────
    const chips = useMemo(() => {
        const result: { label: string; onRemove: () => void }[] = [];
        if (!selectedCategories.includes('all')) {
            selectedCategories.forEach(id => {
                const cat = categories.find(c => c.id === id);
                if (cat) result.push({ label: cat.label, onRemove: () => {
                    const next = selectedCategories.filter(c => c !== id);
                    setSelectedCategories(next.length ? next : ['all']);
                }});
            });
        }
        if (!selectedMaterials.includes('all')) {
            selectedMaterials.forEach(id => {
                const mat = materials.find(m => m.id === id);
                if (mat) result.push({ label: mat.label, onRemove: () => {
                    const next = selectedMaterials.filter(m => m !== id);
                    setSelectedMaterials(next.length ? next : ['all']);
                }});
            });
        }
        if (inStockOnly) result.push({ label: 'In Stock', onRemove: () => setInStockOnly(false) });
        if (maxPrice > 0 && (priceRange[0] > 0 || priceRange[1] < maxPrice)) {
            result.push({
                label: `£${priceRange[0]}–£${priceRange[1]}`,
                onRemove: () => setPriceRange([0, maxPrice]),
            });
        }
        return result;
    }, [selectedCategories, selectedMaterials, inStockOnly, priceRange, maxPrice, categories, materials]);

    // ── Loading skeleton ───────────────────────────────────────────
    if (isLoading) {
        return (
            <section className="bg-background pt-[160px] pb-[160px]">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                        <div className="h-20 w-64 rounded bg-foreground/5 animate-pulse" />
                        <div className="h-12 w-[320px] rounded bg-foreground/5 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </section>
        );
    }

    // ── Full render ────────────────────────────────────────────────
    return (
        <section className="bg-background pt-[160px] pb-[160px]">
            <div className="container">

                {/* ── Page header ──────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <h1 className="text-[clamp(3rem,8vw,6rem)] font-light leading-[1.0] font-display">
                        Shop all products
                    </h1>
                    <div className="relative w-full md:w-[320px]">
                        <input
                            type="text"
                            placeholder="Search products…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-foreground/10 py-4 pr-10 focus:outline-none focus:border-foreground transition-all font-light text-[1.25rem]"
                        />
                        {searchQuery
                            ? <button onClick={() => setSearchQuery('')} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"><X size={20} /></button>
                            : <Search className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40" size={24} />
                        }
                    </div>
                </div>

                {/* ── Main layout ───────────────────────────────────────── */}
                <div className="flex gap-12 relative">

                    {/* ── Desktop filter sidebar ─────────────────────────── */}
                    <div className={cn(
                        "hidden lg:block transition-all duration-500 overflow-hidden flex-shrink-0",
                        showFilters ? "w-[260px] opacity-100" : "w-0 opacity-0 pointer-events-none"
                    )}>
                        <FilterSidebar
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedMaterials={selectedMaterials}
                            setSelectedMaterials={setSelectedMaterials}
                            categories={categories}
                            materials={materials}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            maxPrice={maxPrice}
                            inStockOnly={inStockOnly}
                            setInStockOnly={setInStockOnly}
                            onClearAll={clearAll}
                            activeFilterCount={activeFilterCount}
                        />
                    </div>

                    {/* ── Product listing area ────────────────────────────── */}
                    <div className="flex-1 min-w-0">

                        {/* ── Toolbar row ─────────────────────────────────── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div className="flex items-center gap-4 flex-wrap">

                                {/* Hide/show filters (desktop) */}
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="hidden lg:flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest hover:text-brand-green transition-colors whitespace-nowrap"
                                >
                                    <SlidersHorizontal size={16} />
                                    {showFilters ? 'Hide' : 'Filters'}
                                    {activeFilterCount > 0 && !showFilters && (
                                        <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 bg-brand-green text-white text-[10px] rounded-full">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                {/* Mobile filter trigger */}
                                <button
                                    onClick={() => setShowMobileFilters(true)}
                                    className="lg:hidden flex items-center gap-2 text-[13px] font-medium uppercase tracking-widest"
                                >
                                    <SlidersHorizontal size={16} />
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 bg-brand-green text-white text-[10px] rounded-full">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>

                                <div className="h-4 w-[1px] bg-foreground/10 hidden md:block" />

                                {/* Results count */}
                                <span className="text-[13px] opacity-40 font-light">
                                    {filteredProducts.length === products.length
                                        ? `${products.length} products`
                                        : `${filteredProducts.length} of ${products.length} products`}
                                </span>
                            </div>

                            {/* Sorting */}
                            <div className="relative ml-auto">
                                <button
                                    onClick={() => setShowSortMenu(!showSortMenu)}
                                    className="flex items-center gap-2 text-[13px] font-medium"
                                >
                                    <span className="opacity-40">Sort:</span>
                                    <span>{activeSortLabel}</span>
                                    <ChevronDown size={14} className={cn("transition-transform", showSortMenu && "rotate-180")} />
                                </button>
                                {showSortMenu && (
                                    <>
                                        <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)} />
                                        <div className="absolute right-0 top-full mt-2 z-40 bg-background border border-foreground/10 rounded-xl shadow-xl min-w-[200px] overflow-hidden">
                                            {SORT_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                                                    className={cn(
                                                        "w-full text-left px-5 py-3 text-[13px] hover:bg-foreground/5 transition-colors",
                                                        sortBy === opt.value ? "text-brand-green font-medium" : "font-light"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── Tabs ────────────────────────────────────────── */}
                        <div className="mb-8">
                            <TopCategoryTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
                        </div>

                        {/* ── Active filter chips ──────────────────────────── */}
                        {chips.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-8">
                                {chips.map((chip, i) => (
                                    <FilterChip key={i} label={chip.label} onRemove={chip.onRemove} />
                                ))}
                                <button
                                    onClick={clearAll}
                                    className="text-[12px] text-foreground/40 hover:text-brand-green underline underline-offset-2 transition-colors ml-1"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* ── Product grid ─────────────────────────────────── */}
                        {filteredProducts.length === 0 ? (
                            <div className="py-24 text-center">
                                <p className="text-[4rem] mb-4 opacity-20">⊘</p>
                                <h3 className="text-[1.5rem] font-light opacity-40 mb-2">No products found</h3>
                                <p className="text-[14px] opacity-30 mb-6">Try adjusting your filters or search term.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveTab('all'); clearAll(); }}
                                    className="text-[13px] font-medium uppercase tracking-widest text-brand-green border-b border-brand-green/30 hover:border-brand-green transition-all"
                                >
                                    Reset all filters
                                </button>
                            </div>
                        ) : (
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
                                                <Image src="/images/food-processing.png" alt="Delivery" fill className="object-contain opacity-20 grayscale" />
                                            </div>
                                        </div>
                                        <span className="text-[12px] opacity-60">Free delivery on orders over R2000 incl. vat</span>
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
                                        <span className="text-[11px] opacity-60">*Ts&Cs apply</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Pagination ───────────────────────────────────── */}
                        {totalPages > 1 && (
                            <div className="mt-20">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile filter drawer ─────────────────────────────────── */}
            {showMobileFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    {/* Drawer */}
                    <div className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[380px] bg-background shadow-2xl flex flex-col lg:hidden">
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-foreground/5">
                            <h3 className="text-[1rem] font-medium uppercase tracking-widest">Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="opacity-40 hover:opacity-100 transition-opacity">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer filter content */}
                        <div className="flex-1 overflow-y-auto px-6 py-8">
                            <FilterSidebar
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedMaterials={selectedMaterials}
                                setSelectedMaterials={setSelectedMaterials}
                                categories={categories}
                                materials={materials}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                maxPrice={maxPrice}
                                inStockOnly={inStockOnly}
                                setInStockOnly={setInStockOnly}
                                onClearAll={clearAll}
                                activeFilterCount={activeFilterCount}
                            />
                        </div>

                        {/* Drawer footer CTA */}
                        <div className="px-6 py-5 border-t border-foreground/5">
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full bg-brand-green text-white rounded-full py-3.5 text-[14px] font-medium uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Show {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default ShopGrid;
