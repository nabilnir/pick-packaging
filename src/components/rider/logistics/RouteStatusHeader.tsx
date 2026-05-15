"use client";

import React from 'react';
import { Clock, Navigation, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RouteStatusHeaderProps {
    completedStops: number;
    totalStops: number;
    isOnSchedule: boolean;
    eta: string;
    distanceRemainingKm: number;
}

export function RouteStatusHeader({
    completedStops,
    totalStops,
    isOnSchedule,
    eta,
    distanceRemainingKm
}: RouteStatusHeaderProps) {
    const progressPct = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* ── Buttons Row ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3">
                {isOnSchedule ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Clock size={13} className="text-emerald-600" />
                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-700">
                            On Schedule
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                        <Clock size={13} className="text-amber-600" />
                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-amber-700">
                            Behind Schedule
                        </span>
                    </div>
                )}
                
                <button className="text-[11px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 bg-[#1c3a2a] text-white rounded-xl hover:bg-[#152d20] transition-colors">
                    Sync Device
                </button>
            </div>

            {/* ── Progress Bar ────────────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium text-foreground/50">
                    <span>Route Progress</span>
                    <span>{completedStops} / {totalStops} stops</span>
                </div>
                <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-foreground/60 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progressPct}%` }} 
                    />
                </div>
            </div>

            {/* ── Route Summary Strip ─────────────────────────────────── */}
            <div className="flex divide-x divide-foreground/[0.06] border border-foreground/[0.06] rounded-2xl bg-white overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <CheckSquare size={16} className="text-foreground/30 mb-1" />
                    <span className="text-[14px] font-bold text-foreground tabular-nums leading-none mb-0.5">
                        {completedStops}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40 text-center">
                        Completed
                    </span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <Clock size={16} className="text-foreground/30 mb-1" />
                    <span className="text-[14px] font-bold text-foreground tabular-nums leading-none mb-0.5">
                        {eta}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40 text-center">
                        ETA
                    </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <Navigation size={16} className="text-foreground/30 mb-1" />
                    <span className="text-[14px] font-bold text-foreground tabular-nums leading-none mb-0.5">
                        ~{distanceRemainingKm}km
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/40 text-center">
                        Remaining
                    </span>
                </div>
            </div>
        </div>
    );
}
