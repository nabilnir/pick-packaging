"use client";

import React, { useState, useMemo } from 'react';
import RiderLayout from '@/components/rider/rider-layout';
import { RiderPageHeader } from '@/components/rider/RiderPageHeader';
import { LoadSummaryBar } from '@/components/rider/inventory/LoadSummaryBar';
import { ManifestList } from '@/components/rider/inventory/ManifestList';
import { DamageReportSheet } from '@/components/rider/inventory/DamageReportSheet';
import { ReturnFlow } from '@/components/rider/inventory/ReturnFlow';
import { ScanVerify } from '@/components/rider/inventory/ScanVerify';
import { MOCK_MANIFEST, MOCK_VEHICLE } from '@/lib/rider/mock-inventory';
import { ManifestItem, DamageReport, ReturnRecord } from '@/types/rider/inventory';

export default function InventoryPage() {
    const [manifestItems, setManifestItems] = useState<ManifestItem[]>(MOCK_MANIFEST);
    const [damageItem, setDamageItem] = useState<ManifestItem | null>(null);
    const [returnItem, setReturnItem] = useState<ManifestItem | null>(null);

    // ─── Stats Calculation ───────────────────────────────────────────────────
    const stats = useMemo(() => {
        const loaded    = manifestItems.filter(i => i.status !== 'return').length;
        const delivered = manifestItems.filter(i => i.status === 'complete').length;
        const remaining = manifestItems.filter(i => i.status === 'pending' || i.status === 'partial').length;
        
        const currentWeightKg = manifestItems.reduce((acc, item) => {
            if (item.status !== 'return') {
                return acc + (item.collectedQty * item.unitWeightKg);
            }
            return acc;
        }, 0);

        return { loaded, delivered, remaining, currentWeightKg };
    }, [manifestItems]);

    const summaryLine = `${stats.loaded} items loaded · ${stats.delivered} delivered · ${stats.remaining} remaining`;

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleDamageSubmit = (itemId: string, report: DamageReport) => {
        setManifestItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newCondition = report.qtyAffected === item.collectedQty ? 'damaged' : 'partially_damaged';
                return {
                    ...item,
                    condition: newCondition,
                    damageReport: report
                };
            }
            return item;
        }));
    };

    const handleReturnConfirm = (itemId: string, record: ReturnRecord) => {
        setManifestItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    status: 'return',
                    returnRecord: record
                };
            }
            return item;
        }));
    };

    return (
        <RiderLayout>
            <div className="max-w-6xl mx-auto pb-24">
                <div className="p-4 space-y-4">
                    {/* ── Page Header ───────────────────────────────────────────── */}
                    <RiderPageHeader title="Inventory" subtitle={summaryLine} />

                    {/* ── Load Summary Bar ────────────────────────────────────────── */}
                    <LoadSummaryBar 
                        loaded={stats.loaded}
                        delivered={stats.delivered}
                        remaining={stats.remaining}
                        currentWeightKg={stats.currentWeightKg}
                        maxWeightKg={MOCK_VEHICLE.maxWeightKg}
                    />

                    {/* ── Manifest List ───────────────────────────────────────────── */}
                    <ManifestList 
                        items={manifestItems} 
                        onReportDamage={(item) => setDamageItem(item)}
                        onMarkForReturn={(item) => setReturnItem(item)}
                    />
                </div>
                
                {/* ── Scan Verification ───────────────────────────────────────── */}
                <ScanVerify manifest={manifestItems} />

                {/* ── Damage Report Sheet ─────────────────────────────────────── */}
                <DamageReportSheet 
                    item={damageItem}
                    open={!!damageItem}
                    onClose={() => setDamageItem(null)}
                    onSubmit={handleDamageSubmit}
                />

                {/* ── Return Flow Sheet ───────────────────────────────────────── */}
                <ReturnFlow 
                    item={returnItem}
                    open={!!returnItem}
                    onClose={() => setReturnItem(null)}
                    onConfirm={handleReturnConfirm}
                />
            </div>
        </RiderLayout>
    );
}
