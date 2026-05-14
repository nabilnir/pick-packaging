"use client";

import React from 'react';
import { Package, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Props ────────────────────────────────────────────────────────────────────
interface LoadSummaryBarProps {
    loaded:          number;
    delivered:       number;
    remaining:       number;
    currentWeightKg: number;
    maxWeightKg:     number;
}

// ─── Capacity bar colour thresholds ───────────────────────────────────────────
function capacityColor(pct: number): { bar: string; label: string } {
    if (pct >= 95) return { bar: 'bg-red-500',   label: 'text-red-600' };
    if (pct >= 80) return { bar: 'bg-amber-500', label: 'text-amber-600' };
    return           { bar: 'bg-teal-500',        label: 'text-teal-700' };
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({
    label,
    value,
    valueColor,
    icon: Icon,
}: {
    label:      string;
    value:      number;
    valueColor: string;
    icon:       React.ElementType;
}) {
    return (
        <div className="flex-1 flex flex-col items-center gap-1 py-4 px-2">
            <Icon size={15} className={cn('mb-0.5', valueColor, 'opacity-70')} />
            <span className={cn('text-[2rem] font-bold leading-none tabular-nums', valueColor)}>
                {value}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-foreground/35 text-center leading-tight">
                {label}
            </span>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function LoadSummaryBar({
    loaded,
    delivered,
    remaining,
    currentWeightKg,
    maxWeightKg,
}: LoadSummaryBarProps) {
    const pct   = Math.min(100, Math.round((currentWeightKg / maxWeightKg) * 100));
    const color = capacityColor(pct);

    return (
        <div className="bg-background border border-foreground/[0.08] rounded-2xl overflow-hidden sticky top-0 z-10 shadow-sm">

            {/* ── Three stat tiles ─────────────────────────────────────── */}
            <div className="flex divide-x divide-foreground/[0.06]">
                <StatTile
                    label="Loaded"
                    value={loaded}
                    valueColor="text-teal-600"
                    icon={Package}
                />
                <StatTile
                    label="Delivered"
                    value={delivered}
                    valueColor="text-[#1c3a2a]"
                    icon={CheckCircle2}
                />
                <StatTile
                    label="Remaining"
                    value={remaining}
                    valueColor={remaining > 0 ? 'text-amber-600' : 'text-foreground/30'}
                    icon={Clock}
                />
            </div>

            {/* ── Vehicle capacity bar ──────────────────────────────────── */}
            <div className="px-5 pb-4 pt-1 border-t border-foreground/[0.05]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/35">
                        Vehicle Load
                    </span>
                    <span className={cn('text-[11px] font-semibold tabular-nums', color.label)}>
                        {currentWeightKg.toFixed(1)} kg
                        <span className="text-foreground/30 font-normal"> / {maxWeightKg} kg max</span>
                    </span>
                </div>

                {/* Track */}
                <div className="h-2 w-full rounded-full bg-foreground/[0.07] overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all duration-500',
                            color.bar,
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>

                {/* Threshold labels */}
                {pct >= 80 && (
                    <p className={cn(
                        'text-[10px] font-semibold mt-1.5',
                        pct >= 95 ? 'text-red-600' : 'text-amber-600',
                    )}>
                        {pct >= 95
                            ? '⚠ Near max capacity — offload before next pickup'
                            : '↑ Over 80% loaded — plan next stop carefully'
                        }
                    </p>
                )}
            </div>
        </div>
    );
}
