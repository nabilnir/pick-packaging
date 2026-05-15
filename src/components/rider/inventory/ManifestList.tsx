"use client";

import React, { useState, useMemo } from 'react';
import { 
    LayoutGrid, 
    List, 
    Search, 
    AlertCircle,
    CheckCircle2,
    Clock,
    RotateCcw,
    Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ManifestItem, ManifestStatus, ItemCondition } from '@/types/rider/inventory';
import Image from 'next/image';

// ─── Filter Types ─────────────────────────────────────────────────────────────
type FilterType = 'ALL' | ManifestStatus;

// ─── Props ────────────────────────────────────────────────────────────────────
interface ManifestListProps {
    items: ManifestItem[];
    onReportDamage: (item: ManifestItem) => void;
    onMarkForReturn: (item: ManifestItem) => void;
}

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ManifestStatus, { label: string; class: string; icon: any }> = {
    pending:  { label: 'Pending',  class: 'bg-gray-100 text-gray-600', icon: Clock },
    partial:  { label: 'Partial',  class: 'bg-amber-100 text-amber-700', icon: AlertCircle },
    complete: { label: 'Complete', class: 'bg-teal-100 text-teal-800', icon: CheckCircle2 },
    return:   { label: 'Return',   class: 'bg-red-100 text-red-700', icon: RotateCcw },
};

// ─── Condition Config ─────────────────────────────────────────────────────────
const CONDITION_CONFIG: Record<ItemCondition, { label: string; dot: string }> = {
    good: { label: 'Good', dot: 'bg-teal-500' },
    damaged: { label: 'Damaged', dot: 'bg-red-500' },
    partially_damaged: { label: 'Partial Damage', dot: 'bg-amber-500' },
};

export function ManifestList({ items, onReportDamage, onMarkForReturn }: ManifestListProps) {
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesFilter = activeFilter === 'ALL' || item.status === activeFilter;
            const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [items, activeFilter, searchQuery]);

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <div className="space-y-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search SKU, product or vendor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-foreground/10 rounded-xl text-sm focus:outline-none focus:border-[#1c3a2a]/30 transition-all"
                        />
                    </div>
                    <div className="flex bg-foreground/5 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'table' ? "bg-white shadow-sm text-foreground" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            <List size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('card')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'card' ? "bg-white shadow-sm text-foreground" : "text-foreground/40 hover:text-foreground"
                            )}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {(['ALL', 'pending', 'partial', 'complete', 'return'] as FilterType[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border transition-all",
                                activeFilter === f 
                                    ? "bg-[#1a1f1a] text-white border-[#1a1f1a]" 
                                    : "bg-white text-foreground/40 border-foreground/10 hover:border-foreground/25"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.01]">
                    <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                        <Package className="text-foreground/20" size={32} />
                    </div>
                    <p className="text-foreground/40 font-light italic text-[15px]">No manifest items found.</p>
                </div>
            ) : (
                <div className={cn(
                    viewMode === 'card' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "block"
                )}>
                    {viewMode === 'card' ? (
                        filteredItems.map(item => {
                            const status = STATUS_CONFIG[item.status];
                            const condition = CONDITION_CONFIG[item.condition];
                            return (
                                <div key={item.id} className="bg-white border border-foreground/5 rounded-2xl p-4 space-y-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-foreground/5 shrink-0">
                                            <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[14px] font-medium text-foreground leading-snug line-clamp-2">{item.productName}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-mono text-foreground/30 uppercase tracking-wider">{item.sku}</span>
                                                <span className="text-[10px] text-foreground/40 font-medium">{item.vendorName}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => onMarkForReturn(item)} className="text-foreground/20 hover:text-foreground transition-colors">
                                            <RotateCcw size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-foreground/5">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 mb-1">Load</p>
                                            <p className="text-[13px] font-semibold text-foreground tabular-nums">
                                                {item.collectedQty} <span className="text-foreground/30 font-medium">units</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 mb-1">Delivered</p>
                                            <p className="text-[13px] font-bold text-teal-600 tabular-nums">
                                                {item.deliveredQty} <span className="text-foreground/30 font-medium ml-1">rem {item.remainingQty}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", condition.dot)} />
                                                <span className="text-[11px] font-medium text-foreground/60">{condition.label}</span>
                                            </div>
                                            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", status.class)}>
                                                <status.icon size={11} />
                                                {status.label}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => onReportDamage(item)}
                                                className="flex-1 py-2 rounded-lg border border-red-500/10 text-red-600/60 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all"
                                            >
                                                Report Damage
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {item.destinations.map((dest, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-foreground/5 text-foreground/40 text-[9px] font-bold uppercase tracking-widest rounded-md truncate max-w-[100px]">
                                                    {dest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white border border-foreground/5 rounded-2xl overflow-hidden hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-foreground/[0.02] border-b border-foreground/5">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Product</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Load</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Condition</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-foreground/5">
                                    {filteredItems.map((item) => {
                                        const status = STATUS_CONFIG[item.status];
                                        const condition = CONDITION_CONFIG[item.condition];
                                        return (
                                            <tr key={item.id} className="hover:bg-foreground/[0.01] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-foreground/5 shrink-0">
                                                            <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[13px] font-semibold text-foreground line-clamp-1">{item.productName}</p>
                                                            <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-wider">{item.sku}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[13px] font-bold text-foreground">{item.collectedQty}</p>
                                                        <p className="text-[11px] font-bold text-teal-600">{item.deliveredQty} del.</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", status.class)}>
                                                        <status.icon size={11} />
                                                        {status.label}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", condition.dot)} />
                                                        <span className="text-[11px] font-medium text-foreground/60">{condition.label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => onMarkForReturn(item)} className="p-2 hover:bg-foreground/5 text-foreground/20 hover:text-foreground/60 rounded-lg transition-all">
                                                            <RotateCcw size={16} />
                                                        </button>
                                                        <button onClick={() => onReportDamage(item)} className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-all">
                                                            <AlertCircle size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
