"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
    id: string;
    label: string;
    count?: number;
}

interface TopCategoryTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabs: Tab[];
}

const TopCategoryTabs = ({ activeTab, onTabChange, tabs }: TopCategoryTabsProps) => {
    return (
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "pb-4 text-[13px] font-medium transition-all relative whitespace-nowrap flex items-center gap-1.5",
                        activeTab === tab.id
                            ? "text-foreground"
                            : "text-foreground/40 hover:text-foreground/70"
                    )}
                >
                    {tab.label}
                    {tab.count !== undefined && tab.id !== 'all' && (
                        <span className={cn(
                            "text-[11px] px-1.5 py-0.5 rounded-full transition-colors",
                            activeTab === tab.id
                                ? "bg-brand-green text-white"
                                : "bg-foreground/10 text-foreground/50"
                        )}>
                            {tab.count}
                        </span>
                    )}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-foreground rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default TopCategoryTabs;
