"use client";

import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
}

const FilterSidebar = ({
    selectedCategories,
    setSelectedCategories,
    selectedMaterials,
    setSelectedMaterials,
    categories,
    materials
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

        if (next.length === 0) {
            setter(['all']);
        } else {
            setter(next);
        }
    };

    return (
        <div className="w-full space-y-12 pr-8 border-r border-foreground/5 h-full overflow-y-auto custom-scrollbar">
            <div>
                <h4 className="text-[1.25rem] font-light mb-8">Categories</h4>
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleFilter(cat.id, selectedCategories, setSelectedCategories)}>
                            <Checkbox
                                id={`cat-${cat.id}`}
                                checked={selectedCategories.includes(cat.id)}
                                className="border-foreground/20 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <Label
                                htmlFor={`cat-${cat.id}`}
                                className="text-[14px] font-light cursor-pointer group-hover:text-brand-green transition-colors"
                            >
                                {cat.label} {cat.count !== undefined && <span className="text-foreground/40 ml-1">({cat.count})</span>}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[1.25rem] font-light mb-8">Material</h4>
                <div className="space-y-4">
                    {materials.map((mat) => (
                        <div key={mat.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleFilter(mat.id, selectedMaterials, setSelectedMaterials)}>
                            <Checkbox
                                id={`mat-${mat.id}`}
                                checked={selectedMaterials.includes(mat.id)}
                                className="border-foreground/20 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <Label
                                htmlFor={`mat-${mat.id}`}
                                className="text-[14px] font-light cursor-pointer group-hover:text-brand-green transition-colors"
                            >
                                {mat.label} {mat.count !== undefined && <span className="text-foreground/40 ml-1">({mat.count})</span>}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={() => { setSelectedCategories(['all']); setSelectedMaterials(['all']); }}
                className="text-[12px] uppercase tracking-widest font-medium border-b border-foreground/20 hover:border-foreground transition-all"
            >
                Clear All
            </button>
        </div>
    );
};

export default FilterSidebar;
