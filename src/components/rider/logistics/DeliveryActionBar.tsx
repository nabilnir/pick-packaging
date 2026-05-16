"use client";

import React from 'react';
import { Check, X, MapPin, Navigation } from 'lucide-react';
import { DeliveryStop } from '@/types/rider/logistics';
import { cn } from '@/lib/utils';

interface DeliveryActionBarProps {
    currentStop: DeliveryStop | null;
    onArrived: () => void;
    onDelivered: () => void;
    onFailed: () => void;
}

export function DeliveryActionBar({ 
    currentStop, 
    onArrived, 
    onDelivered, 
    onFailed 
}: DeliveryActionBarProps) {
    if (!currentStop) return null;

    const hasArrived = !!currentStop.arrivedAt;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-t from-background to-transparent pointer-events-none">
            <div className="max-w-xl mx-auto flex gap-3 pointer-events-auto">
                {/* Status Column */}
                <div className="flex-1 flex gap-3 bg-white border border-foreground/10 rounded-2xl p-2 shadow-lg backdrop-blur-xl bg-white/90">
                    {!hasArrived ? (
                        <>
                            <a 
                                href={`https://maps.google.com/?q=${encodeURIComponent(currentStop.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[#1c3a2a] hover:bg-[#1c3a2a]/5 rounded-xl transition-colors"
                            >
                                <Navigation size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Navigate</span>
                            </a>
                            <button 
                                onClick={onArrived}
                                className="flex-[2] bg-[#1c3a2a] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-[#152d20] shadow-md shadow-[#1c3a2a]/20"
                            >
                                <MapPin size={18} />
                                I Have Arrived
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={onFailed}
                                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <X size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Failed</span>
                            </button>
                            <button 
                                onClick={onDelivered}
                                className="flex-[3] bg-[#1c3a2a] text-white rounded-xl text-[13px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-[#152d20] shadow-md shadow-[#1c3a2a]/20"
                            >
                                <Check size={20} strokeWidth={3} />
                                Deliver Items
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
