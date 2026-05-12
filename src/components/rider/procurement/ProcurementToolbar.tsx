"use client";

import React, { useState } from 'react';
import { format, isToday } from 'date-fns';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { FilterStatus, PickupOrder } from '@/types/procurement';

// ─── All filter options ───────────────────────────────────────────────────────
const FILTERS: FilterStatus[] = ['ALL', 'ASSIGNED', 'CONFIRMED', 'EN_ROUTE', 'COLLECTED', 'MISSED'];

const FILTER_LABEL: Record<FilterStatus, string> = {
    ALL:       'All',
    ASSIGNED:  'Assigned',
    CONFIRMED: 'Confirmed',
    EN_ROUTE:  'En Route',
    COLLECTED: 'Collected',
    MISSED:    'Missed',
};

const PILL_ACTIVE: Record<FilterStatus, string> = {
    ALL:       'bg-[#1a1f1a] text-white',
    ASSIGNED:  'bg-gray-600 text-white',
    CONFIRMED: 'bg-teal-600 text-white',
    EN_ROUTE:  'bg-amber-500 text-white',
    COLLECTED: 'bg-[#1c3a2a] text-white',
    MISSED:    'bg-red-600 text-white',
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface ProcurementToolbarProps {
    orders:         PickupOrder[];
    filter:         FilterStatus;
    onFilterChange: (f: FilterStatus) => void;
    selectedDate:   Date;
    onDateChange:   (d: Date) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function countFor(orders: PickupOrder[], filter: FilterStatus): number {
    if (filter === 'ALL') return orders.length;
    return orders.filter(o => o.status === filter).length;
}

/** ASSIGNED or CONFIRMED orders whose windowEnd is within 30 min from now */
function closingSoon(orders: PickupOrder[]): PickupOrder[] {
    const now = new Date();
    return orders.filter(o => {
        if (o.status !== 'ASSIGNED' && o.status !== 'CONFIRMED') return false;
        const [h, m] = o.windowEnd.split(':').map(Number);
        const end = new Date(now);
        end.setHours(h, m, 0, 0);
        const diffMin = (end.getTime() - now.getTime()) / 60_000;
        return diffMin > 0 && diffMin <= 30;
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProcurementToolbar({
    orders,
    filter,
    onFilterChange,
    selectedDate,
    onDateChange,
}: ProcurementToolbarProps) {
    const [calOpen, setCalOpen] = useState(false);
    const soonOrders = closingSoon(orders);

    const dateLabel = isToday(selectedDate)
        ? `Today, ${format(selectedDate, 'd MMM')}`
        : format(selectedDate, 'EEE d MMM');

    const urgentTime = soonOrders.length > 0
        ? soonOrders.reduce((earliest, o) =>
            o.windowEnd < earliest ? o.windowEnd : earliest,
            soonOrders[0].windowEnd,
          )
        : null;

    return (
        <div className="space-y-3">
            {/* ── Toolbar row ─────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3 flex-wrap">

                {/* Date picker */}
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                    <PopoverTrigger asChild>
                        <button
                            id="procurement-date-trigger"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-foreground/10 bg-background text-foreground hover:border-foreground/20 transition-all text-[13px] font-semibold tracking-wide active:scale-95 shrink-0"
                        >
                            <CalendarIcon size={15} className="text-foreground/45" />
                            {dateLabel}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(d) => {
                                if (d) { onDateChange(d); setCalOpen(false); }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Filter pills — scrollable on mobile */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {FILTERS.map((f) => {
                        const active = f === filter;
                        const count  = countFor(orders, f);
                        // Skip empty non-ALL filters to reduce clutter
                        if (!active && count === 0 && f !== 'ALL') return null;
                        return (
                            <button
                                key={f}
                                id={`procurement-filter-${f.toLowerCase().replace('_', '-')}`}
                                onClick={() => onFilterChange(f)}
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                                    'text-[10px] font-bold uppercase tracking-widest',
                                    'transition-all active:scale-95',
                                    active
                                        ? PILL_ACTIVE[f]
                                        : 'border border-foreground/10 bg-background text-foreground/50 hover:border-foreground/25 hover:text-foreground',
                                )}
                            >
                                {FILTER_LABEL[f]}
                                <span className={cn(
                                    'min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black px-1',
                                    active ? 'bg-white/20' : 'bg-foreground/8 text-foreground/55',
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Closing-soon amber banner ────────────────────────────── */}
            {soonOrders.length > 0 && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <p className="text-[12px] font-semibold text-amber-800 leading-snug">
                        {soonOrders.length === 1
                            ? `⚠ 1 pickup window closing soon — confirm before ${urgentTime}`
                            : `⚠ ${soonOrders.length} pickup windows closing soon — confirm before ${urgentTime}`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
