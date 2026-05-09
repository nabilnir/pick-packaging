"use client";

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import type { OrderStatus } from '@/types/dashboard';

export interface OrderFilters {
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  vendors?: string[];
}

export interface OrdersToolbarProps {
  activeTab: OrderStatus | 'all';
  onTabChange: (tab: OrderStatus | 'all') => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  filters: OrderFilters;
  onFilterChange: (filters: OrderFilters) => void;
  tabCounts: Record<OrderStatus | 'all', number>;
  availableVendors?: string[];
}

const TABS: (OrderStatus | 'all')[] = ['all', 'Processing', 'Packing', 'Delivered', 'Cancelled'];

export function OrdersToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearch,
  filters,
  onFilterChange,
  tabCounts,
  availableVendors = ['Packrite', 'EcoPack', 'Global Supplies', 'ZimBox']
}: OrdersToolbarProps) {
  const [localFilters, setLocalFilters] = useState<OrderFilters>(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const empty = { vendors: [] };
    setLocalFilters(empty);
    onFilterChange(empty);
  };

  const activeFilterCount = 
    (filters.dateFrom ? 1 : 0) + 
    (filters.dateTo ? 1 : 0) + 
    (filters.minAmount ? 1 : 0) + 
    (filters.maxAmount ? 1 : 0) + 
    (filters.vendors?.length ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const label = tab.toUpperCase();
            const count = tabCounts[tab] || 0;
            
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors",
                  isActive 
                    ? "bg-[#1c3a2a] text-white border border-[#1c3a2a]" 
                    : "bg-white text-[#1a1f1a] border border-border hover:bg-teal-50 hover:text-teal-900"
                )}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Right Side: Search and Filter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm w-[220px] focus-within:ring-1 focus-within:ring-[#1c3a2a] transition-all">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full placeholder:text-muted-foreground" 
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button className="relative p-2 bg-white border border-border rounded-lg hover:bg-gray-50 transition-colors text-muted-foreground hover:text-[#1a1f1a]">
                <Filter size={18} />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-teal-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle className="text-xl font-light">Filter Orders</SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto py-6 space-y-8">
                {/* Date Range */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Date Range</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">From</label>
                      <input 
                        type="date" 
                        value={localFilters.dateFrom || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
                        className="w-full text-sm p-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1c3a2a]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">To</label>
                      <input 
                        type="date" 
                        value={localFilters.dateTo || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
                        className="w-full text-sm p-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1c3a2a]"
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Range */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Amount (R)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Min</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={localFilters.minAmount || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full text-sm p-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1c3a2a]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">Max</label>
                      <input 
                        type="number" 
                        placeholder="Any"
                        value={localFilters.maxAmount || ''}
                        onChange={(e) => setLocalFilters({ ...localFilters, maxAmount: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full text-sm p-2 border border-border rounded-md bg-transparent focus:outline-none focus:ring-1 focus:ring-[#1c3a2a]"
                      />
                    </div>
                  </div>
                </div>

                {/* Vendors */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Vendors</h4>
                  <div className="space-y-2">
                    {availableVendors.map(vendor => {
                      const isChecked = localFilters.vendors?.includes(vendor) || false;
                      return (
                        <label key={vendor} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={(e) => {
                              const curr = localFilters.vendors || [];
                              setLocalFilters({
                                ...localFilters,
                                vendors: e.target.checked 
                                  ? [...curr, vendor] 
                                  : curr.filter(v => v !== vendor)
                              });
                            }}
                            className="rounded border-border text-[#1c3a2a] focus:ring-[#1c3a2a]"
                          />
                          <span className="text-sm">{vendor}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-row gap-3 pt-4 border-t border-border">
                <SheetClose asChild>
                  <button 
                    onClick={handleClear}
                    className="flex-1 py-2 text-sm font-bold uppercase tracking-widest text-[#1a1f1a] hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Clear All
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button 
                    onClick={handleApply}
                    className="flex-1 py-2 bg-[#1c3a2a] text-white text-sm font-bold uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity"
                  >
                    Apply Filters
                  </button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground mr-1">Active filters:</span>
          {filters.dateFrom && (
            <span className="inline-flex items-center gap-1 bg-white border border-border px-2 py-1 rounded text-xs">
              From: {filters.dateFrom}
            </span>
          )}
          {filters.dateTo && (
            <span className="inline-flex items-center gap-1 bg-white border border-border px-2 py-1 rounded text-xs">
              To: {filters.dateTo}
            </span>
          )}
          {filters.minAmount && (
            <span className="inline-flex items-center gap-1 bg-white border border-border px-2 py-1 rounded text-xs">
              Min: R{filters.minAmount}
            </span>
          )}
          {filters.maxAmount && (
            <span className="inline-flex items-center gap-1 bg-white border border-border px-2 py-1 rounded text-xs">
              Max: R{filters.maxAmount}
            </span>
          )}
          {filters.vendors?.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-white border border-border px-2 py-1 rounded text-xs">
              Vendor: {v}
            </span>
          ))}
          <button 
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-600 font-medium ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
