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
import type { PickupStatus, VendorPickup } from '@/types/procurement';

// ─── Props ────────────────────────────────────────────────────────────────────
export type FilterStatus = 'ALL' | PickupStatus;

interface ProcurementToolbarProps {
    pickups: VendorPickup[];
    filter: FilterStatus;
    onFilterChange: (f: FilterStatus) => void;
    selectedDate: Date;
    onDateChange: (d: Date) => void;
}

// ─── Filter pill definitions ──────────────────────────────────────────────────
const FILTERS: FilterStatus[] = ['ALL', 'PENDING', 'CONFIRMED', 'COLLECTED'];

const PILL_ACTIVE: Record<FilterStatus, string> = {
    ALL:       'bg-[#1a1f1a] text-white',
    PENDING:   'bg-amber-500 text-white',
    CONFIRMED: 'bg-blue-600 text-white',
    COLLECTED: 'bg-teal-600 text-white',
};

const PILL_BADGE: Record<FilterStatus, string> = {
    ALL:       'bg-white/20',
    PENDING:   'bg-white/25',
    CONFIRMED: 'bg-white/25',
    COLLECTED: 'bg-white/25',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function countFor(pickups: VendorPickup[], filter: FilterStatus): number {
    if (filter === 'ALL') return pickups.length;
    return pickups.filter(p => p.status === filter).length;
}

/** Returns pickups whose windowEnd is within the next 30 min from now */
function closingSoon(pickups: VendorPickup[]): VendorPickup[] {
    const now = new Date();
    return pickups.filter(p => {
        if (p.status !== 'PENDING') return false;
        const [h, m] = p.windowEnd.split(':').map(Number);
        const end = new Date(now);
        end.setHours(h, m, 0, 0);
        const diffMin = (end.getTime() - now.getTime()) / 60_000;
        return diffMin > 0 && diffMin <= 30;
    });
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ProcurementToolbar({
    pickups,
    filter,
    onFilterChange,
    selectedDate,
    onDateChange,
}: ProcurementToolbarProps) {
    const [calOpen, setCalOpen] = useState(false);
    const soonPickups = closingSoon(pickups);

    const dateLabel = isToday(selectedDate)
        ? `Today, ${format(selectedDate, 'd MMM')}`
        : format(selectedDate, 'EEE d MMM');

    // Earliest closing windowEnd among soon-closing pickups
    const urgentTime = soonPickups.length > 0
        ? soonPickups.reduce((earliest, p) =>
            p.windowEnd < earliest ? p.windowEnd : earliest,
            soonPickups[0].windowEnd
        )
        : null;

    return (
        <div className="space-y-3">
            {/* ── Main toolbar row ────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 flex-wrap">

                {/* Date picker */}
                <Popover open={calOpen} onOpenChange={setCalOpen}>
                    <PopoverTrigger asChild>
                        <button
                            id="procurement-date-trigger"
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 rounded-xl border border-foreground/10',
                                'bg-background text-foreground hover:border-foreground/20 transition-all',
                                'text-[13px] font-semibold tracking-wide active:scale-95',
                            )}
                        >
                            <CalendarIcon size={15} className="text-foreground/50" />
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

                {/* Filter pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {FILTERS.map((f) => {
                        const active = f === filter;
                        const count  = countFor(pickups, f);
                        return (
                            <button
                                key={f}
                                id={`procurement-filter-${f.toLowerCase()}`}
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
                                {f}
                                {/* Count badge */}
                                <span className={cn(
                                    'min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-black px-1',
                                    active
                                        ? PILL_BADGE[f]
                                        : 'bg-foreground/8 text-foreground/60',
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Closing-soon banner ──────────────────────────────────── */}
            {soonPickups.length > 0 && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                    <p className="text-[12px] font-semibold text-amber-800 leading-snug">
                        {soonPickups.length === 1
                            ? `1 pickup window closing soon — confirm before ${urgentTime}`
                            : `${soonPickups.length} pickup windows closing soon — confirm before ${urgentTime}`
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
