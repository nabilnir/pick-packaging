"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface TopCategoryTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'all', label: 'All Products' },
    { id: 'coffee', label: 'Coffee', count: 12 },
    { id: 'smoothies', label: 'Smoothies', count: 9 },
    { id: 'deli', label: 'Deli', count: 37 },
    { id: 'takeout', label: 'Takeout', count: 56 },
    { id: 'extras', label: 'Extras', count: 8 },
];

const TopCategoryTabs = ({ activeTab, onTabChange }: TopCategoryTabsProps) => {
    return (
        <div className="flex items-center gap-8 border-b border-foreground/5 mb-12 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "pb-4 text-[14px] font-medium transition-all relative whitespace-nowrap",
                        activeTab === tab.id
                            ? "text-foreground"
                            : "text-foreground/40 hover:text-foreground/60"
                    )}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground transition-all" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default TopCategoryTabs;
