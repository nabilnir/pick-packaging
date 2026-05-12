"use client";

import React, { useState, useMemo } from 'react';
import RiderLayout from '@/components/rider/rider-layout';
import { ProcurementToolbar, type FilterStatus } from '@/components/rider/procurement/ProcurementToolbar';
import { MOCK_PICKUPS } from '@/lib/procurement/mock-pickups';
import type { VendorPickup, PickupStatus } from '@/types/procurement';
import { cn } from '@/lib/utils';
import {
    MapPin, Phone, Package, ChevronDown, ChevronUp,
    CheckCircle2, Clock, Loader2, Circle,
} from 'lucide-react';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<PickupStatus, string> = {
    PENDING:   'bg-amber-100 text-amber-800 border-amber-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    COLLECTED: 'bg-teal-100 text-teal-800 border-teal-200',
};

const STATUS_ICON: Record<PickupStatus, React.ReactNode> = {
    PENDING:   <Circle size={12} className="text-amber-500" />,
    CONFIRMED: <Clock size={12} className="text-blue-500" />,
    COLLECTED: <CheckCircle2 size={12} className="text-teal-500" />,
};

// ─── Pickup card ──────────────────────────────────────────────────────────────
function PickupCard({
    pickup,
    onConfirm,
    onCollect,
}: {
    pickup: VendorPickup;
    onConfirm: (id: string) => void;
    onCollect: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [acting, setActing]     = useState(false);

    const handleAction = async (action: 'confirm' | 'collect') => {
        setActing(true);
        await new Promise(r => setTimeout(r, 600));
        action === 'confirm' ? onConfirm(pickup.id) : onCollect(pickup.id);
        setActing(false);
    };

    return (
        <div className={cn(
            'bg-background rounded-2xl border transition-all overflow-hidden',
            pickup.status === 'COLLECTED'
                ? 'border-foreground/[0.05] opacity-60'
                : 'border-foreground/[0.08] hover:border-foreground/[0.14]',
        )}>
            {/* ── Card header ──────────────────────────────────────────── */}
            <div className="p-4 md:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Status + ref */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest',
                            STATUS_BADGE[pickup.status],
                        )}>
                            {STATUS_ICON[pickup.status]}
                            {pickup.status}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-foreground/40">
                            {pickup.orderRef}
                        </span>
                    </div>
                    {/* Window time */}
                    <span className="text-[11px] font-semibold text-foreground/50 shrink-0">
                        {pickup.windowStart}–{pickup.windowEnd}
                    </span>
                </div>

                {/* Vendor name */}
                <h3 className="font-semibold text-[15px] text-foreground mb-1 leading-snug">
                    {pickup.vendorName}
                </h3>

                {/* Address */}
                <div className="flex items-start gap-1.5 mb-1">
                    <MapPin size={12} className="text-foreground/30 mt-0.5 shrink-0" />
                    <p className="text-[12px] text-foreground/50 leading-snug">{pickup.vendorAddress}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 mb-4">
                    <Phone size={12} className="text-foreground/30 shrink-0" />
                    <a
                        href={`tel:${pickup.contactPhone}`}
                        className="text-[12px] text-foreground/50 hover:text-[#1c3a2a] transition-colors"
                    >
                        {pickup.contactPhone}
                    </a>
                </div>

                {/* Weight + item count */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/[0.03] rounded-lg border border-foreground/[0.06]">
                        <Package size={12} className="text-foreground/40" />
                        <span className="text-[11px] font-semibold text-foreground/60">
                            {pickup.estimatedWeight} kg
                        </span>
                    </div>
                    <span className="text-[11px] text-foreground/40">
                        {pickup.items.length} line {pickup.items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    {pickup.status === 'PENDING' && (
                        <button
                            onClick={() => handleAction('confirm')}
                            disabled={acting}
                            className="flex-1 py-2.5 rounded-xl bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {acting ? <Loader2 size={13} className="animate-spin" /> : null}
                            Confirm Pickup
                        </button>
                    )}
                    {pickup.status === 'CONFIRMED' && (
                        <button
                            onClick={() => handleAction('collect')}
                            disabled={acting}
                            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {acting ? <Loader2 size={13} className="animate-spin" /> : null}
                            Mark Collected
                        </button>
                    )}
                    {pickup.status === 'COLLECTED' && (
                        <div className="flex-1 py-2.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                            <CheckCircle2 size={13} />
                            Collected
                        </div>
                    )}

                    {/* Expand toggle */}
                    <button
                        onClick={() => setExpanded(v => !v)}
                        aria-label={expanded ? 'Collapse' : 'Expand'}
                        className="px-3 py-2.5 rounded-xl border border-foreground/10 hover:border-foreground/20 text-foreground/40 hover:text-foreground transition-all"
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* ── Expanded: line items + notes ─────────────────────────── */}
            {expanded && (
                <div className="border-t border-foreground/[0.06] bg-foreground/[0.015] px-4 md:px-5 py-4 space-y-4">
                    {/* Line items */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">
                            Line Items
                        </p>
                        <div className="space-y-2">
                            {pickup.items.map(item => (
                                <div
                                    key={item.sku}
                                    className="flex items-center justify-between gap-3 py-2 border-b border-foreground/[0.05] last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-medium text-foreground/80 leading-snug truncate">
                                            {item.description}
                                        </p>
                                        <p className="text-[11px] font-mono text-foreground/30">{item.sku}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[13px] font-semibold text-foreground">
                                            ×{item.qty}
                                        </p>
                                        <p className="text-[11px] text-foreground/40">
                                            {(item.qty * item.unitWeight).toFixed(1)} kg
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {pickup.notes && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1.5">
                                Rider Notes
                            </p>
                            <p className="text-[13px] text-foreground/60 leading-relaxed italic">
                                "{pickup.notes}"
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProcurementPage() {
    const [pickups, setPickups]       = useState<VendorPickup[]>(MOCK_PICKUPS);
    const [filter, setFilter]         = useState<FilterStatus>('ALL');
    const [selectedDate, setDate]     = useState<Date>(new Date());

    const filtered = useMemo(() => {
        if (filter === 'ALL') return pickups;
        return pickups.filter(p => p.status === filter);
    }, [pickups, filter]);

    const handleConfirm = (id: string) => {
        setPickups(prev => prev.map(p =>
            p.id === id ? { ...p, status: 'CONFIRMED' as PickupStatus } : p
        ));
    };

    const handleCollect = (id: string) => {
        setPickups(prev => prev.map(p =>
            p.id === id ? { ...p, status: 'COLLECTED' as PickupStatus } : p
        ));
    };

    return (
        <RiderLayout>
            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="mb-7 pb-6 border-b border-foreground/[0.07]">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/35 mb-1">
                    Rider Portal · Sector 4
                </p>
                <h1 className="font-display text-[2rem] font-light text-foreground tracking-tight">
                    Procurement
                </h1>
                <p className="text-[14px] font-light text-foreground/45 mt-1">
                    Pickups assigned to you today.
                </p>
            </div>

            {/* ── Toolbar ───────────────────────────────────────────────── */}
            <div className="mb-6">
                <ProcurementToolbar
                    pickups={pickups}
                    filter={filter}
                    onFilterChange={setFilter}
                    selectedDate={selectedDate}
                    onDateChange={setDate}
                />
            </div>

            {/* ── Pickup cards ──────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-foreground/10">
                    <Package className="mx-auto opacity-15 mb-4" size={40} />
                    <p className="text-foreground/40 font-light italic text-[14px]">
                        No pickups match this filter.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(pickup => (
                        <PickupCard
                            key={pickup.id}
                            pickup={pickup}
                            onConfirm={handleConfirm}
                            onCollect={handleCollect}
                        />
                    ))}
                </div>
            )}

            {/* ── Summary footer ────────────────────────────────────────── */}
            <div className="mt-8 pt-5 border-t border-foreground/[0.06] flex items-center justify-between text-[12px] text-foreground/40">
                <span>
                    {pickups.filter(p => p.status === 'COLLECTED').length} of {pickups.length} collected
                </span>
                <span>
                    {pickups.reduce((s, p) => s + p.estimatedWeight, 0).toFixed(1)} kg total
                </span>
            </div>
        </RiderLayout>
    );
}
