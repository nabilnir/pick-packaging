"use client";

import React, { useMemo } from 'react';
import RiderLayout from '@/components/rider/rider-layout';
import { LoadSummaryBar } from '@/components/rider/inventory/LoadSummaryBar';
import { ManifestList } from '@/components/rider/inventory/ManifestList';
import { MOCK_INVENTORY, MOCK_VEHICLE } from '@/lib/inventory/mock-inventory';

export default function InventoryPage() {
    // ─── Stats Calculation ───────────────────────────────────────────────────
    const stats = useMemo(() => {
        const loaded    = MOCK_INVENTORY.filter(i => i.status !== 'DELIVERED' && i.status !== 'FAILED').length;
        const delivered = MOCK_INVENTORY.filter(i => i.status === 'DELIVERED').length;
        const remaining = MOCK_INVENTORY.filter(i => i.invStatus === 'PENDING' || i.invStatus === 'PARTIAL').length;
        
        const currentWeightKg = MOCK_INVENTORY.reduce((acc, item) => {
            // Only count items currently on the vehicle (not delivered or failed)
            if (item.status === 'LOADED') {
                return acc + (item.qtyLoaded * item.unitWeightKg);
            }
            return acc;
        }, 0);

        return { loaded, delivered, remaining, currentWeightKg };
    }, []);

    const subtitle = `${stats.loaded} items loaded · ${stats.delivered} delivered · ${stats.remaining} remaining`;

    return (
        <RiderLayout>
            <div className="max-w-6xl mx-auto">
                {/* ── Page Header ───────────────────────────────────────────── */}
                <div className="mb-7 pb-6 border-b border-foreground/[0.07]">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/35 mb-1">
                        Rider Portal · Sector 4
                    </p>
                    <h1 className="font-display text-[2rem] font-light text-foreground tracking-tight">
                        Inventory
                    </h1>
                    <p className="text-[14px] font-light text-foreground/45 mt-1">
                        {subtitle}
                    </p>
                </div>

                {/* ── Load Summary Bar ────────────────────────────────────────── */}
                <div className="mb-8">
                    <LoadSummaryBar 
                        loaded={stats.loaded}
                        delivered={stats.delivered}
                        remaining={stats.remaining}
                        currentWeightKg={stats.currentWeightKg}
                        maxWeightKg={MOCK_VEHICLE.maxWeightKg}
                    />
                </div>

                {/* ── Manifest List ───────────────────────────────────────────── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/30">
                            Current Manifest
                        </h2>
                    </div>
                    <ManifestList items={MOCK_INVENTORY} />
                </div>

                {/* ── Footer Stats ────────────────────────────────────────────── */}
                <div className="mt-12 pt-6 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[12px] text-foreground/40 font-medium italic">
                        Vehicle: {MOCK_VEHICLE.registration} ({MOCK_VEHICLE.type})
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">
                        Last synced: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
}
