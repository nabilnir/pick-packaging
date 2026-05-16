"use client";

import React, { useState } from 'react';
import { 
    MapPin, 
    Phone, 
    MessageSquare, 
    Check, 
    X, 
    ChevronDown, 
    ChevronUp,
    ExternalLink,
    Image as ImageIcon,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeliveryStop, StopItem } from '@/types/rider/logistics';
import Image from 'next/image';

interface StopListProps {
    stops: DeliveryStop[];
    currentStopId?: string;
    onStopExpand?: (stop: DeliveryStop | null) => void;
}

function StopItemsList({ items }: { items: StopItem[] }) {
    return (
        <div className="mt-4 pt-4 border-t border-foreground/5 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/40">
                Delivery Items
            </h4>
            <div className="space-y-2">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-foreground truncate">
                                {item.productName}
                            </p>
                            <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">
                                {item.sku}
                            </p>
                        </div>
                        <div className="text-[13px] font-bold text-foreground tabular-nums ml-4">
                            x{item.qty}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StopList({ stops, currentStopId, onStopExpand }: StopListProps) {
    const [expandedStopId, setExpandedStopId] = useState<string | null>(null);

    const toggleExpand = (stop: DeliveryStop) => {
        const isCurrentlyExpanded = expandedStopId === stop.id;
        const nextId = isCurrentlyExpanded ? null : stop.id;
        setExpandedStopId(nextId);
        if (onStopExpand) onStopExpand(nextId ? stop : null);
    };

    return (
        <div className="space-y-4">
            {stops.map((stop) => {
                const totalUnits = stop.items.reduce((sum, item) => sum + item.qty, 0);
                const isExpanded = expandedStopId === stop.id;
                const isCurrent = stop.id === currentStopId || stop.status === 'current';

                // ─── UPCOMING ────────────────────────────────────────────────
                if (stop.status === 'upcoming') {
                    return (
                        <div 
                            key={stop.id}
                            className="bg-white border border-foreground/5 rounded-2xl p-5 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => toggleExpand(stop)}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-foreground/5 text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-1">
                                        Stop {stop.sequence}
                                    </div>
                                    <h3 className="text-[15px] font-bold text-foreground">{stop.companyName}</h3>
                                    <p className="text-[13px] text-foreground/60 leading-snug line-clamp-2 pr-4">
                                        {stop.address}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[13px] font-bold text-foreground">{stop.estimatedArrival}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-foreground/40 mt-0.5">ETA</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <p className="text-[12px] font-medium text-foreground/50">
                                    {stop.items.length} SKUs · {totalUnits} units
                                </p>
                                <a 
                                    href={`https://maps.google.com/?q=${encodeURIComponent(stop.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#1c3a2a] hover:text-[#1c3a2a]/70"
                                >
                                    Directions <ExternalLink size={12} />
                                </a>
                            </div>

                            {isExpanded && <StopItemsList items={stop.items} />}
                        </div>
                    );
                }

                // ─── CURRENT ─────────────────────────────────────────────────
                if (stop.status === 'current' || isCurrent) {
                    return (
                        <div 
                            key={stop.id}
                            className="bg-white border-2 border-[#1c3a2a] shadow-lg rounded-2xl p-5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
                                <MapPin size={120} />
                            </div>
                            
                            <div className="relative z-10 space-y-5">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#1c3a2a] text-[10px] font-bold uppercase tracking-widest text-white mb-1 shadow-[0_0_0_4px_rgba(28,58,42,0.1)]">
                                            <span className="relative flex h-2 w-2 mr-2">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                            </span>
                                            Stop {stop.sequence}
                                        </div>
                                        <h3 className="text-[18px] font-bold text-foreground">{stop.companyName}</h3>
                                        <p className="text-[14px] text-foreground/70 leading-snug pr-4">
                                            {stop.address}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0 bg-teal-50 px-3 py-2 rounded-xl">
                                        <p className="text-[16px] font-bold text-teal-800">{stop.estimatedArrival}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-teal-600 mt-0.5">ETA</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                                    <div>
                                        <p className="text-[13px] font-bold text-foreground">{stop.contactName}</p>
                                        <p className="text-[12px] text-foreground/50">{stop.contactPhone}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a 
                                            href={`tel:${stop.contactPhone}`}
                                            className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors"
                                        >
                                            <Phone size={16} />
                                        </a>
                                        <a 
                                            href={`https://wa.me/${stop.contactPhone?.replace(/\+/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                                        >
                                            <MessageSquare size={16} />
                                        </a>
                                    </div>
                                </div>

                                <div 
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={() => toggleExpand(stop)}
                                >
                                    <p className="text-[13px] font-medium text-foreground">
                                        {stop.items.length} SKUs · {totalUnits} units to deliver
                                    </p>
                                    <div className="p-1.5 rounded-full bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </div>

                                {isExpanded && <StopItemsList items={stop.items} />}
                            </div>
                        </div>
                    );
                }

                // ─── COMPLETED ───────────────────────────────────────────────
                if (stop.status === 'completed') {
                    return (
                        <div 
                            key={stop.id}
                            className="bg-white/50 border border-foreground/5 rounded-2xl p-5 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-600 mb-1">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-[14px] font-semibold text-foreground line-through decoration-foreground/20">
                                        {stop.companyName}
                                    </h3>
                                    <p className="text-[12px] text-foreground/50">
                                        {stop.items.length} SKUs · {totalUnits} units
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[12px] font-bold text-foreground">{stop.completedAt}</p>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-foreground/40 mt-0.5">Delivered</p>
                                </div>
                            </div>
                        </div>
                    );
                }

                // ─── FAILED ──────────────────────────────────────────────────
                if (stop.status === 'failed') {
                    return (
                        <div 
                            key={stop.id}
                            className="bg-white border border-foreground/5 border-l-4 border-l-red-500 rounded-2xl p-5"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 mb-1">
                                        <X size={14} strokeWidth={3} />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-foreground">{stop.companyName}</h3>
                                    <p className="text-[13px] text-red-600/80 font-medium mt-1">
                                        {stop.failedReason || 'Delivery failed'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
