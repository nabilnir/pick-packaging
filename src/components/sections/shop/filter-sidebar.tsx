"use client";

import React, { useCallback } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

interface FilterSidebarProps {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    selectedMaterials: string[];
    setSelectedMaterials: (materials: string[]) => void;
    categories: FilterOption[];
    materials: FilterOption[];
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    maxPrice: number;
    inStockOnly: boolean;
    setInStockOnly: (val: boolean) => void;
    onClearAll: () => void;
    activeFilterCount: number;
}

const FilterSidebar = ({
    selectedCategories,
    setSelectedCategories,
    selectedMaterials,
    setSelectedMaterials,
    categories,
    materials,
    priceRange,
    setPriceRange,
    maxPrice,
    inStockOnly,
    setInStockOnly,
    onClearAll,
    activeFilterCount,
}: FilterSidebarProps) => {

    const toggleFilter = (id: string, current: string[], setter: (val: string[]) => void) => {
        if (id === 'all') {
            setter(['all']);
            return;
        }
        let next = [...current.filter(i => i !== 'all')];
        if (next.includes(id)) {
            next = next.filter(i => i !== id);
        } else {
            next.push(id);
        }
        setter(next.length === 0 ? ['all'] : next);
    };

    const handleMinPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), priceRange[1] - 1);
        setPriceRange([val, priceRange[1]]);
    }, [priceRange, setPriceRange]);

    const handleMaxPrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), priceRange[0] + 1);
        setPriceRange([priceRange[0], val]);
    }, [priceRange, setPriceRange]);

    // Percentage for slider fill
    const minPct = maxPrice > 0 ? (priceRange[0] / maxPrice) * 100 : 0;
    const maxPct = maxPrice > 0 ? (priceRange[1] / maxPrice) * 100 : 100;

    return (
        <div className="w-full space-y-10 pr-8 border-r border-foreground/5 h-full overflow-y-auto custom-scrollbar">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-[1rem] font-medium uppercase tracking-widest">Filters</h4>
                {activeFilterCount > 0 && (
                    <button
                        onClick={onClearAll}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-brand-green transition-all"
                    >
                        <X size={12} />
                        Clear ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* In Stock */}
            <div>
                <h4 className="text-[0.875rem] font-medium uppercase tracking-widest mb-5 opacity-50">Availability</h4>
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setInStockOnly(!inStockOnly)}
                >
                    <div className={cn(
                        "relative w-10 h-5 rounded-full transition-colors duration-300 flex-shrink-0",
                        inStockOnly ? "bg-brand-green" : "bg-foreground/10"
                    )}>
                        <div className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                            inStockOnly ? "left-5" : "left-0.5"
                        )} />
                    </div>
                    <span className="text-[14px] font-light group-hover:text-brand-green transition-colors">
                        In Stock Only
                    </span>
                </div>
            </div>

            {/* Price Range */}
            {maxPrice > 0 && (
                <div>
                    <h4 className="text-[0.875rem] font-medium uppercase tracking-widest mb-5 opacity-50">Price Range</h4>
                    <div className="flex justify-between text-[13px] font-medium mb-4">
                        <span>£{priceRange[0].toFixed(0)}</span>
                        <span>£{priceRange[1].toFixed(0)}</span>
                    </div>

                    {/* Dual range slider */}
                    <div className="relative h-1.5 w-full mb-6">
                        {/* Track background */}
                        <div className="absolute inset-0 rounded-full bg-foreground/10" />
                        {/* Active track fill */}
                        <div
                            className="absolute inset-y-0 rounded-full bg-brand-green"
                            style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                        />
                        {/* Min thumb */}
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            step={1}
                            value={priceRange[0]}
                            onChange={handleMinPrice}
                            className="price-range-thumb absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{ zIndex: priceRange[0] > maxPrice - 10 ? 5 : 3 }}
                        />
                        {/* Max thumb */}
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            step={1}
                            value={priceRange[1]}
                            onChange={handleMaxPrice}
                            className="price-range-thumb absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            style={{ zIndex: 4 }}
                        />
                        {/* Visual thumbs */}
                        <div
                            className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-brand-green shadow-md"
                            style={{ left: `calc(${minPct}% - 8px)` }}
                        />
                        <div
                            className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-background border-2 border-brand-green shadow-md"
                            style={{ left: `calc(${maxPct}% - 8px)` }}
                        />
                    </div>
                </div>
            )}

            {/* Categories */}
            {categories.length > 1 && (
                <div>
                    <h4 className="text-[0.875rem] font-medium uppercase tracking-widest mb-5 opacity-50">Category</h4>
                    <div className="space-y-3.5">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between space-x-3 group cursor-pointer"
                                onClick={() => toggleFilter(cat.id, selectedCategories, setSelectedCategories)}
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id={`cat-${cat.id}`}
                                        checked={selectedCategories.includes(cat.id)}
                                        className="border-foreground/20 data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                                    />
                                    <Label
                                        htmlFor={`cat-${cat.id}`}
                                        className="text-[14px] font-light cursor-pointer group-hover:text-brand-green transition-colors"
                                    >
                                        {cat.label}
                                    </Label>
                                </div>
                                {cat.count !== undefined && (
                                    <span className="text-[12px] opacity-30 tabular-nums">{cat.count}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Materials */}
            {materials.length > 1 && (
                <div>
                    <h4 className="text-[0.875rem] font-medium uppercase tracking-widest mb-5 opacity-50">Material</h4>
                    <div className="space-y-3.5">
                        {materials.map((mat) => (
                            <div
                                key={mat.id}
                                className="flex items-center justify-between space-x-3 group cursor-pointer"
                                onClick={() => toggleFilter(mat.id, selectedMaterials, setSelectedMaterials)}
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id={`mat-${mat.id}`}
                                        checked={selectedMaterials.includes(mat.id)}
                                        className="border-foreground/20 data-[state=checked]:bg-brand-green data-[state=checked]:border-brand-green"
                                    />
                                    <Label
                                        htmlFor={`mat-${mat.id}`}
                                        className="text-[14px] font-light cursor-pointer group-hover:text-brand-green transition-colors"
                                    >
                                        {mat.label}
                                    </Label>
                                </div>
                                {mat.count !== undefined && (
                                    <span className="text-[12px] opacity-30 tabular-nums">{mat.count}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterSidebar;
