"use client";

import React, { useState } from 'react';
import { Map, ChevronDown, ChevronUp, Navigation2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeliveryStop } from '@/types/rider/logistics';

interface RouteMapEmbedProps {
    stops: DeliveryStop[];
}

export function RouteMapEmbed({ stops }: RouteMapEmbedProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter to get only upcoming and current stops for the map visualization
    const activeStops = stops.filter(s => s.status === 'current' || s.status === 'upcoming');

    return (
        <div className="bg-white border border-foreground/5 rounded-2xl overflow-hidden transition-all duration-300">
            {/* Toggle Header */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-foreground/[0.02] transition-colors"
            >
                <div className="flex items-center gap-2 text-[#1c3a2a]">
                    <Map size={18} />
                    <span className="text-[13px] font-bold uppercase tracking-widest">
                        {isExpanded ? 'Hide Route Map' : 'Show Route Map'}
                    </span>
                </div>
                <div className="p-1 rounded-full bg-foreground/5 text-foreground/50">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            {/* Map Container */}
            <div 
                className={cn(
                    "relative w-full bg-foreground/[0.02] transition-all duration-500 ease-in-out border-t border-foreground/5 overflow-hidden",
                    isExpanded ? "h-[240px] opacity-100" : "h-0 opacity-0 border-transparent"
                )}
            >
                {/* ── Simulated Map Overlay ── 
                    In a production environment, this would be an iframe or 
                    <GoogleMap> component. Here we render a high-fidelity 
                    SVG representation of a logistics route.
                */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground/[0.05]"/>
                        </pattern>
                        <pattern id="streetGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                            <rect width="120" height="120" fill="url(#mapGrid)"/>
                            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/10"/>
                        </pattern>
                    </defs>

                    {/* Base Grid */}
                    <rect width="100%" height="100%" fill="url(#streetGrid)" />

                    {/* Simulated Blocks */}
                    <g className="text-foreground/[0.03]">
                        <rect x="20" y="20" width="80" height="60" rx="4" fill="currentColor" />
                        <rect x="140" y="40" width="100" height="40" rx="4" fill="currentColor" />
                        <rect x="40" y="120" width="60" height="80" rx="4" fill="currentColor" />
                        <rect x="260" y="20" width="80" height="100" rx="4" fill="currentColor" />
                        <rect x="180" y="140" width="120" height="60" rx="4" fill="currentColor" />
                        <rect x="340" y="160" width="80" height="40" rx="4" fill="currentColor" />
                        <rect x="400" y="40" width="60" height="80" rx="4" fill="currentColor" />
                    </g>

                    {/* Route Polyline */}
                    <path 
                        d="M 60,60 L 160,100 L 220,60 L 300,160 L 420,100" 
                        fill="none" 
                        stroke="#1c3a2a" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeDasharray="8 6"
                        className="opacity-60"
                    />

                    {/* Current Rider Position Indicator */}
                    <g transform="translate(60,60)">
                        <circle cx="0" cy="0" r="16" fill="#1c3a2a" className="opacity-20 animate-ping" />
                        <circle cx="0" cy="0" r="12" fill="#1c3a2a" className="opacity-40" />
                        <circle cx="0" cy="0" r="6" fill="#1c3a2a" />
                        <circle cx="0" cy="0" r="2" fill="white" />
                    </g>

                    {/* Active Stops Markers */}
                    {[
                        { x: 160, y: 100, num: 4, current: true },
                        { x: 220, y: 60, num: 5, current: false },
                        { x: 300, y: 160, num: 6, current: false },
                        { x: 420, y: 100, num: 7, current: false },
                    ].map((marker, i) => (
                        <g key={i} transform={`translate(${marker.x},${marker.y})`}>
                            {/* Pin Shadow */}
                            <ellipse cx="0" cy="12" rx="6" ry="3" fill="black" opacity="0.1" />
                            {/* Pin Body */}
                            <path 
                                d="M 0,-16 C -6,-16 -10,-11 -10,-5 C -10,2 0,12 0,12 C 0,12 10,2 10,-5 C 10,-11 6,-16 0,-16 Z" 
                                fill={marker.current ? "#0d9488" : "white"} 
                                stroke={marker.current ? "#0f766e" : "#1c3a2a"}
                                strokeWidth="2"
                            />
                            {/* Number */}
                            <text 
                                x="0" y="-3" 
                                textAnchor="middle" 
                                fontSize="9" 
                                fontWeight="bold" 
                                fill={marker.current ? "white" : "#1c3a2a"}
                            >
                                {marker.num}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Floating Map Actions */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-white rounded-xl shadow-md border border-foreground/5 flex items-center justify-center text-[#1c3a2a] hover:bg-foreground/5 transition-colors">
                        <Navigation2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
