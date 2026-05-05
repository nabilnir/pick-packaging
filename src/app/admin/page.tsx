"use client";

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    Factory,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
    { label: "Overview",  href: "/admin",          icon: LayoutDashboard },
    { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag     },
    { label: "Products",  href: "/admin/products",  icon: Package         },
    { label: "Customers", href: "/admin/customers", icon: Users           },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3       },
    { label: "Vendors",   href: "/admin/vendors",   icon: Factory         },
    { label: "Settings",  href: "/admin/settings",  icon: Settings        },
];

// ─── KPI data ──────────────────────────────────────────────────────────────
const KPI_CARDS = [
    {
        label: "Total Revenue",
        value: "$2.48M",
        meta: "+12.4% VS LAST MONTH",
        metaType: "up" as const,
    },
    {
        label: "Active Vendors",
        value: "142",
        meta: "STABLE",
        metaType: "neutral" as const,
    },
    {
        label: "Total SKUs",
        value: "18,402",
        meta: "+450 THIS WEEK",
        metaType: "up" as const,
        accent: true,
    },
    {
        label: "Pending Orders",
        value: "34",
        meta: "REQUIRES ACTION",
        metaType: "error" as const,
    },
];

// ─── Vendor bars ───────────────────────────────────────────────────────────
const VENDORS = [
    { id: "VND-01", pct: 80,  label: "92.4%", active: false },
    { id: "VND-02", pct: 65,  label: "74.1%", active: false },
    { id: "VND-03", pct: 95,  label: "98.9%", active: true  },
    { id: "VND-04", pct: 45,  label: "52.0%", active: false },
    { id: "VND-05", pct: 78,  label: "89.5%", active: false },
];

// ─── Activity log ──────────────────────────────────────────────────────────
const ACTIVITY = [
    {
        tag: "ORDER",
        tagStyle: "bg-stone-100 text-stone-600 border-stone-300",
        time: "Just Now",
        msg: "PO-2023-8942 Approved by System Admin.",
    },
    {
        tag: "INVENTORY",
        tagStyle: "bg-stone-900 text-white border-stone-900",
        time: "2m ago",
        msg: "New SKU (PKG-C-092) Uploaded via API batch.",
    },
    {
        tag: "ALERT",
        tagStyle: "bg-red-50 text-red-700 border-red-300",
        time: "15m ago",
        msg: "Vendor VND-04 SLA violation detected. Auto-routing triggered.",
    },
    {
        tag: "SYSTEM",
        tagStyle: "bg-stone-100 text-stone-600 border-stone-300",
        time: "1h ago",
        msg: "Daily backup completed successfully.",
    },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function AdminOverview() {
    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="mb-10 flex justify-between items-end border-b border-stone-200 pb-5">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-stone-900">
                        Overview
                    </h1>
                    <p className="text-sm text-stone-500 mt-1 max-w-xl">
                        Central command center for platform administrators. Real-time metrics and system health indicators.
                    </p>
                </div>
                <button className="bg-stone-900 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-stone-700 transition-colors border border-stone-900">
                    Generate Report
                </button>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {KPI_CARDS.map((card) => (
                    <KpiCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── Main Grid ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Vendor Performance Matrix */}
                <div className="lg:col-span-8 border border-stone-200 bg-white flex flex-col">
                    <div className="px-6 py-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-900">
                            Vendor Performance Matrix
                        </h3>
                        <button className="text-stone-400 hover:text-stone-700 transition-colors text-xl leading-none">
                            ···
                        </button>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-end gap-6 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-x-8 top-8 bottom-20 flex flex-col justify-between pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border-t border-stone-100 w-full" />
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="relative flex justify-around items-end h-56 mt-4">
                            {VENDORS.map((v) => (
                                <div key={v.id} className="flex flex-col items-center gap-3 w-14 group">
                                    <div className="relative w-full" style={{ height: `${v.pct}%` }}>
                                        {/* Tooltip */}
                                        <div className={cn(
                                            "absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 whitespace-nowrap transition-opacity",
                                            v.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}>
                                            {v.label}
                                        </div>
                                        <div className={cn(
                                            "w-full h-full border transition-colors",
                                            v.active
                                                ? "bg-stone-900 border-stone-900"
                                                : "bg-stone-200 border-stone-300 group-hover:bg-stone-900 group-hover:border-stone-900"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest text-center",
                                        v.active ? "text-stone-900" : "text-stone-400 group-hover:text-stone-700"
                                    )}>
                                        {v.id}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Activity Log */}
                <div className="lg:col-span-4 border border-stone-200 bg-white flex flex-col" style={{ maxHeight: 420 }}>
                    <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-stone-900 animate-pulse" />
                        <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-900">
                            Live Activity Log
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <ul className="flex flex-col divide-y divide-stone-100">
                            {ACTIVITY.map((item, i) => (
                                <li key={i} className="px-6 py-4 hover:bg-stone-50 transition-colors flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                                            item.tagStyle
                                        )}>
                                            {item.tag}
                                        </span>
                                        <span className="text-[10px] text-stone-400">{item.time}</span>
                                    </div>
                                    <p className="text-[13px] text-stone-700 leading-snug">{item.msg}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="px-6 py-3 border-t border-stone-200 bg-white text-center">
                        <Link
                            href="/admin/orders"
                            className="text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:opacity-60 transition-opacity"
                        >
                            View All Logs
                        </Link>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}

// ─── KPI Card Component ────────────────────────────────────────────────────
interface KpiCardProps {
    label: string;
    value: string;
    meta: string;
    metaType: "up" | "neutral" | "error";
    accent?: boolean;
}

function KpiCard({ label, value, meta, metaType, accent }: KpiCardProps) {
    const metaColor =
        metaType === "up"      ? "text-stone-900" :
        metaType === "error"   ? "text-red-600"   :
                                 "text-stone-400";

    const arrow =
        metaType === "up"    ? "↑ " :
        metaType === "error" ? ""   :
                               "— ";

    return (
        <div className={cn(
            "border p-6 flex flex-col justify-between h-36 relative overflow-hidden",
            accent
                ? "bg-stone-100 border-stone-300"
                : "bg-white border-stone-200"
        )}>
            {/* subtle dot pattern for accent card */}
            {accent && (
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                    }}
                />
            )}

            <div className="relative z-10">
                <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    metaType === "error" ? "text-red-600" : "text-stone-500"
                )}>
                    {label}
                </p>
            </div>

            <div className="relative z-10">
                <div className="text-3xl font-black tracking-tighter text-stone-900">{value}</div>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-1.5", metaColor)}>
                    {arrow}{meta}
                </div>
            </div>
        </div>
    );
}
