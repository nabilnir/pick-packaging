"use client";

import React from 'react';
import RiderLayout from '@/components/rider/rider-layout';
import { Wallet, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Data ──────────────────────────────────────────────────────────────────
const TASKS = [
    { id: "PKG-8821-A", dest: "Industrial Park, Sector 4",    kg: 12.5, status: "IN TRANSIT", active: true  },
    { id: "PKG-8822-B", dest: "Tech Hub Building C",          kg: 4.2,  status: "QUEUED",     active: false },
    { id: "PKG-8823-C", dest: "Downtown Fulfillment Center",  kg: 88.0, status: "QUEUED",     active: false },
];

const EARNINGS = [
    { label: "Base Rate",      amount: "$180.00" },
    { label: "Distance Bonus", amount: "$45.50"  },
    { label: "Time Incentive", amount: "$20.00"  },
];

export default function RiderDashboard() {
    return (
        <RiderLayout>

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">
                        Rider Portal · Sector 4
                    </p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">
                        Logistics Control
                    </h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1">
                        Active route management — 14 stops remaining today.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Clock size={13} className="text-emerald-600" />
                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-700">
                            On Schedule
                        </span>
                    </div>
                    <button className="text-[11px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors">
                        Sync Device
                    </button>
                </div>
            </div>

            {/* ── Main Grid ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Map View (8 cols) */}
                <div className="lg:col-span-8 bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden relative h-[460px]">
                    {/* Info overlay */}
                    <div className="absolute top-6 left-6 z-10 bg-background/95 backdrop-blur-sm rounded-xl border border-foreground/[0.08] p-4 shadow-sm">
                        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-0.5">
                            Today's Deliveries
                        </p>
                        <h2 className="font-display text-[1.2rem] font-light text-foreground tracking-tight">
                            14 Stops Remaining
                        </h2>
                    </div>

                    {/* SVG city map */}
                    <div className="absolute inset-0 bg-foreground/[0.025]">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="smallGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.4" className="text-foreground/10"/>
                                </pattern>
                                <pattern id="bigGrid" width="128" height="128" patternUnits="userSpaceOnUse">
                                    <rect width="128" height="128" fill="url(#smallGrid)"/>
                                    <path d="M 128 0 L 0 0 0 128" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/[0.07]"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#bigGrid)" />

                            {/* Block buildings */}
                            {[
                                [40, 60, 72, 44], [180, 40, 96, 36], [340, 80, 80, 64],
                                [500, 140, 88, 52], [640, 60, 72, 80], [780, 120, 96, 48],
                                [80, 260, 64, 80], [260, 300, 80, 56], [460, 240, 72, 64],
                                [620, 280, 88, 52], [760, 220, 64, 88],
                            ].map(([x, y, w, h], i) => (
                                <rect key={i} x={x} y={y} width={w} height={h}
                                    fill="currentColor" className="text-foreground/[0.06]"
                                    rx="4"
                                />
                            ))}

                            {/* Route path */}
                            <polyline
                                points="60,400 180,290 300,330 420,180 560,210 680,110 800,160 900,80"
                                fill="none"
                                stroke="currentColor"
                                className="text-foreground"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="8 5"
                            />

                            {/* Stop markers */}
                            {[[60,400],[180,290],[300,330],[420,180],[560,210],[680,110],[800,160],[900,80]].map(([cx,cy],i) => (
                                <g key={i}>
                                    <circle cx={cx} cy={cy} r={i === 0 ? 9 : 6}
                                        fill={i === 0 ? "currentColor" : "white"}
                                        className={i === 0 ? "text-foreground" : ""}
                                        stroke="currentColor" strokeWidth="2"
                                    />
                                    {i === 0 && (
                                        <circle cx={cx} cy={cy} r={14} fill="none"
                                            stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"
                                            className="text-foreground/30"
                                        />
                                    )}
                                </g>
                            ))}
                        </svg>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background/80 to-transparent">
                        <div className="flex items-center justify-between text-[11px] font-medium text-foreground/50 mb-2">
                            <span>Route Progress</span>
                            <span>6 / 20 stops</span>
                        </div>
                        <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                            <div className="h-full bg-foreground/60 rounded-full" style={{ width: "30%" }} />
                        </div>
                    </div>
                </div>

                {/* Earnings Summary (4 cols) */}
                <div className="lg:col-span-4 bg-background rounded-2xl border border-foreground/[0.07] p-8 flex flex-col justify-between h-[460px]">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-0.5">
                                    Earnings Summary
                                </p>
                                <h2 className="font-display text-[1.1rem] font-light text-foreground tracking-tight">
                                    Today's Payout
                                </h2>
                            </div>
                            <div className="p-2.5 rounded-xl bg-foreground/5">
                                <Wallet size={18} className="text-foreground/50" />
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mb-8 pb-8 border-b border-foreground/[0.07]">
                            <div className="font-display text-[3rem] font-light text-foreground tracking-tight leading-none">
                                $245.50
                            </div>
                            <p className="text-[12px] font-light text-foreground/40 mt-2">Estimated payout</p>
                        </div>

                        {/* Breakdown */}
                        <ul className="space-y-4">
                            {EARNINGS.map(e => (
                                <li key={e.label} className="flex justify-between items-center">
                                    <span className="text-[13px] font-light text-foreground/60">{e.label}</span>
                                    <span className="text-[13px] font-medium text-foreground">{e.amount}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="w-full py-3 bg-foreground text-background text-[11px] font-medium uppercase tracking-[0.15em] rounded-xl hover:bg-foreground/80 transition-colors">
                        View Detailed Ledger
                    </button>
                </div>

                {/* Active Tasks Table (full width) */}
                <div className="lg:col-span-12 bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
                    <div className="px-8 py-5 border-b border-foreground/[0.06] flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Today</p>
                            <h2 className="font-display text-[1rem] font-light text-foreground mt-0.5">Active Tasks</h2>
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 border border-foreground/10 px-3 py-1.5 rounded-lg">
                            Filter: Pending
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-foreground/[0.06] text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/30">
                                    {["Order ID", "Destination", "Weight (kg)", "Status", ""].map((h, i) => (
                                        <th key={i} className={cn("px-8 py-3 font-medium", i === 4 && "text-right")}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/[0.05]">
                                {TASKS.map((task, i) => (
                                    <tr key={task.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                        <td className="px-8 py-4 text-[13px] font-mono font-medium text-foreground/70">
                                            {task.id}
                                        </td>
                                        <td className="px-8 py-4 text-[13px] font-light text-foreground/70">{task.dest}</td>
                                        <td className="px-8 py-4 text-[13px] font-light text-foreground/70">{task.kg}</td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-medium uppercase tracking-[0.1em] px-2.5 py-1 rounded-full",
                                                task.active
                                                    ? "bg-foreground text-background"
                                                    : "bg-foreground/8 text-foreground/50 border border-foreground/10"
                                            )}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="p-1.5 opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-foreground transition-all">
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </RiderLayout>
    );
}
