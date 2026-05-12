"use client";

import React, { useState, useMemo } from 'react';
import RiderLayout from '@/components/rider/rider-layout';
import { ProcurementToolbar } from '@/components/rider/procurement/ProcurementToolbar';
import { PickupCard } from '@/components/rider/procurement/PickupCard';
import { MOCK_ORDERS } from '@/lib/procurement/mock-pickups';
import type { PickupOrder, PickupStatus, FilterStatus, MissReason } from '@/types/procurement';
import { Package } from 'lucide-react';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProcurementPage() {
    const [orders, setOrders]   = useState<PickupOrder[]>(MOCK_ORDERS);
    const [filter, setFilter]   = useState<FilterStatus>('ALL');
    const [date,   setDate]     = useState<Date>(new Date());

    // ── Filtered list ──────────────────────────────────────────────────────────
    const filtered = useMemo(() =>
        filter === 'ALL' ? orders : orders.filter(o => o.status === filter),
        [orders, filter],
    );

    // ── Status transitions ─────────────────────────────────────────────────────
    const setStatus = (id: string, status: PickupStatus, extra?: Partial<PickupOrder>) =>
        setOrders(prev => prev.map(o =>
            o.id === id ? { ...o, status, ...extra } : o
        ));

    const handleConfirm = (id: string) => setStatus(id, 'CONFIRMED');

    const handleArrive  = (id: string) => setStatus(id, 'EN_ROUTE');

    const handleCollect = (id: string) => setStatus(id, 'COLLECTED', {
        collectedAt:    new Date().toISOString(),
        collectedCount: orders.find(o => o.id === id)
            ?.items.reduce((s, i) => s + i.qtyToCollect, 0),
    });

    const handleMiss = (id: string, _reason: MissReason) => setStatus(id, 'MISSED');

    // ── Summary stats ──────────────────────────────────────────────────────────
    const totalKg = orders
        .reduce((s, o) => s + o.items.reduce((is, i) => is + i.qtyToCollect * i.unitWeightKg, 0), 0);
    const collectedCount = orders.filter(o => o.status === 'COLLECTED').length;

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
            <div className="mb-5">
                <ProcurementToolbar
                    orders={orders}
                    filter={filter}
                    onFilterChange={setFilter}
                    selectedDate={date}
                    onDateChange={setDate}
                />
            </div>

            {/* ── Card list ─────────────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-foreground/10">
                    <Package className="mx-auto opacity-15 mb-4" size={40} />
                    <p className="text-foreground/40 font-light italic text-[14px]">
                        No pickups match this filter.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <PickupCard
                            key={order.id}
                            order={order}
                            onConfirm={handleConfirm}
                            onArrive={handleArrive}
                            onCollect={handleCollect}
                            onMiss={handleMiss}
                        />
                    ))}
                </div>
            )}

            {/* ── Summary footer ────────────────────────────────────────── */}
            <div className="mt-8 pt-5 border-t border-foreground/[0.06] flex items-center justify-between text-[12px] text-foreground/40">
                <span>
                    {collectedCount} of {orders.length} collected
                </span>
                <span>
                    ~{totalKg.toFixed(1)} kg total today
                </span>
            </div>
        </RiderLayout>
    );
}
