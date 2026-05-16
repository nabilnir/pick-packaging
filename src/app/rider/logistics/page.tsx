"use client";

import React, { useState, useMemo } from 'react';
import RiderLayout from '@/components/rider/rider-layout';
import { RiderPageHeader } from '@/components/rider/RiderPageHeader';
import { RouteStatusHeader } from '@/components/rider/logistics/RouteStatusHeader';
import { RouteMapEmbed } from '@/components/rider/logistics/RouteMapEmbed';
import { StopList } from '@/components/rider/logistics/StopList';
import { DeliveryActionBar } from '@/components/rider/logistics/DeliveryActionBar';
import { PODSheet } from '@/components/rider/logistics/PODSheet';
import { FailedDeliverySheet } from '@/components/rider/logistics/FailedDeliverySheet';
import { MOCK_LOGISTICS_STOPS } from '@/lib/rider/mock-logistics';
import { DeliveryStop, PODRecord, FailedDeliveryRecord, RouteProgress } from '@/types/rider/logistics';
import { useToast } from '@/components/ui/toast-provider';

export default function LogisticsPage() {
    const { success } = useToast();
    const [stops, setStops] = useState<DeliveryStop[]>(MOCK_LOGISTICS_STOPS);
    const [isPODOpen, setIsPODOpen] = useState(false);
    const [isFailedOpen, setIsFailedOpen] = useState(false);
    const [expandedStop, setExpandedStop] = useState<DeliveryStop | null>(null);

    // Get current stop
    const currentStop = useMemo(() => 
        stops.find(s => s.status === 'current') || null
    , [stops]);

    const currentStopId = currentStop?.id;

    // Route Progress
    const progress: RouteProgress = useMemo(() => {
        const completed = stops.filter(s => s.status === 'completed' || s.status === 'failed').length;
        const current = stops.find(s => s.status === 'current');
        return {
            completedStops: completed,
            totalStops: stops.length,
            distanceRemainingKm: 34, // Mock
            currentEta: current?.estimatedArrival || '16:45'
        };
    }, [stops]);

    const subtitle = `${progress.completedStops} of ${progress.totalStops} stops completed · Sector 4`;

    // Handlers
    const handleArrived = () => {
        setStops(prev => prev.map(s => 
            s.id === currentStopId ? { ...s, arrivedAt: new Date().toLocaleTimeString() } : s
        ));
    };

    const handleComplete = (stopId: string, record: any) => {
        setStops(prev => {
            const nextStops = [...prev];
            const currentIndex = nextStops.findIndex(s => s.id === stopId);
            if (currentIndex !== -1) {
                // Mark current as completed
                nextStops[currentIndex] = {
                    ...nextStops[currentIndex],
                    status: 'completed',
                    completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    podRecord: {
                        receivedBy: record.receivedByName,
                        receiverRole: record.recipientRole,
                        signatureBase64: record.signatureDataUrl,
                        photoUrl: record.photoDataUrl,
                        deliveredItems: record.deliveredItems,
                        timestamp: record.submittedAt
                    }
                };
                // Advance next upcoming to current
                const nextUpcomingIndex = nextStops.findIndex((s, idx) => idx > currentIndex && s.status === 'upcoming');
                if (nextUpcomingIndex !== -1) {
                    nextStops[nextUpcomingIndex] = {
                        ...nextStops[nextUpcomingIndex],
                        status: 'current'
                    };
                }
            }
            return nextStops;
        });
        setIsPODOpen(false);
    };

    const handleFailedSubmit = (stopId: string, record: FailedDeliveryRecord) => {
        setStops(prev => {
            const nextStops = [...prev];
            const currentIndex = nextStops.findIndex(s => s.id === stopId);
            if (currentIndex !== -1) {
                // Mark current as failed
                nextStops[currentIndex] = {
                    ...nextStops[currentIndex],
                    status: 'failed',
                    failedReason: record.reason
                };
                // Advance next upcoming to current
                const nextUpcomingIndex = nextStops.findIndex((s, idx) => idx > currentIndex && s.status === 'upcoming');
                if (nextUpcomingIndex !== -1) {
                    nextStops[nextUpcomingIndex] = {
                        ...nextStops[nextUpcomingIndex],
                        status: 'current'
                    };
                }
            }
            return nextStops;
        });
        setIsFailedOpen(false);
    };

    return (
        <RiderLayout>
            <div className="max-w-xl mx-auto pb-32">
                <div className="p-4 space-y-6">
                    {/* ── Header ── */}
                    <RiderPageHeader title="Logistics" subtitle={subtitle} />

                    {/* ── Component 1: Route Status Header ── */}
                    <RouteStatusHeader 
                        completedStops={progress.completedStops}
                        totalStops={progress.totalStops}
                        isOnSchedule={true}
                        eta={`ETA: ${progress.currentEta}`}
                        distanceRemainingKm={progress.distanceRemainingKm}
                    />

                    {/* ── Component 6: Route Map ── */}
                    <RouteMapEmbed stops={stops} />

                    {/* ── Component 2: Stop List ── */}
                    <div className="pt-2">
                        <StopList 
                            stops={stops} 
                            currentStopId={currentStopId}
                            onStopExpand={setExpandedStop}
                        />
                    </div>
                </div>

                {/* ── Component 3: Delivery Action Bar ── */}
                <DeliveryActionBar 
                    currentStop={currentStop} 
                    onArrived={handleArrived}
                    onDelivered={() => setIsPODOpen(true)}
                    onFailed={() => setIsFailedOpen(true)}
                />

                {/* ── Sheets ── */}
                <PODSheet 
                    stop={currentStop} 
                    open={isPODOpen} 
                    onClose={() => setIsPODOpen(false)} 
                    onComplete={handleComplete} 
                />
                
                <FailedDeliverySheet 
                    stop={currentStop} 
                    open={isFailedOpen} 
                    onClose={() => setIsFailedOpen(false)} 
                    onSubmit={handleFailedSubmit}
                />
            </div>
        </RiderLayout>
    );
}
