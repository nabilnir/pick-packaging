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
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
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

// ── KPI data ───────────────────────────────────────────────────────────────
const KPI_CARDS = [
    { label: "Total Revenue",    value: "$2.48M",  change: "+12.4%", trend: "up"      as const, info: "vs last month"  },
    { label: "Active Vendors",   value: "142",     change: "Stable", trend: "neutral" as const, info: ""               },
    { label: "Total SKUs",       value: "18,402",  change: "+450",   trend: "up"      as const, info: "this week"      },
    { label: "Pending Orders",   value: "34",      change: "Action", trend: "error"   as const, info: "requires review" },
];

// ── Vendor bars ────────────────────────────────────────────────────────────
const VENDORS = [
    { id: "VND-01", pct: 80, label: "92.4%", active: false },
    { id: "VND-02", pct: 65, label: "74.1%", active: false },
    { id: "VND-03", pct: 95, label: "98.9%", active: true  },
    { id: "VND-04", pct: 45, label: "52.0%", active: false },
    { id: "VND-05", pct: 78, label: "89.5%", active: false },
];

// ── Activity log ───────────────────────────────────────────────────────────
const ACTIVITY = [
    { tag: "ORDER",     tagStyle: "bg-foreground/5 text-foreground/60",         time: "Just now", msg: "PO-2023-8942 approved by System Admin."               },
    { tag: "INVENTORY", tagStyle: "bg-foreground text-background",              time: "2m ago",   msg: "New SKU (PKG-C-092) uploaded via API batch."           },
    { tag: "ALERT",     tagStyle: "bg-red-50 text-red-600",                     time: "15m ago",  msg: "Vendor VND-04 SLA violation — auto-routing triggered." },
    { tag: "SYSTEM",    tagStyle: "bg-foreground/5 text-foreground/60",         time: "1h ago",   msg: "Daily backup completed successfully."                  },
];

// ══════════════════════════════════════════════════════════════════════════
export default function AdminOverview() {
    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">
                        Admin Panel
                    </p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">
                        Overview
                    </h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1 max-w-xl">
                        Central command for platform administrators. Real-time metrics and system health.
                    </p>
                </div>
                <button className="shrink-0 text-[11px] font-medium uppercase tracking-[0.15em] px-6 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors">
                    Generate Report
                </button>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {KPI_CARDS.map(card => (
                    <KpiCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── Main grid ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Vendor Performance (8 cols) */}
                <div className="lg:col-span-8 bg-background rounded-2xl border border-foreground/[0.07] flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-foreground/[0.06] flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">
                                Performance Matrix
                            </p>
                            <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">
                                Vendor On-Time Delivery
                            </h3>
                        </div>
                        <button className="text-foreground/30 hover:text-foreground transition-colors text-xl leading-none">···</button>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-end relative">
                        {/* Horizontal grid lines */}
                        <div className="absolute inset-x-8 top-8 bottom-16 flex flex-col justify-between pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border-t border-foreground/[0.05] w-full" />
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="relative flex justify-around items-end h-48 mt-4">
                            {VENDORS.map(v => (
                                <div key={v.id} className="flex flex-col items-center gap-2 w-14 group">
                                    <div className="relative w-full" style={{ height: `${v.pct}%` }}>
                                        {/* Tooltip */}
                                        <div className={cn(
                                            "absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap transition-opacity",
                                            v.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}>
                                            {v.label}
                                        </div>
                                        <div className={cn(
                                            "w-full h-full rounded-t-lg transition-colors",
                                            v.active
                                                ? "bg-foreground"
                                                : "bg-foreground/10 group-hover:bg-foreground/25"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-medium uppercase tracking-wider text-center",
                                        v.active ? "text-foreground font-semibold" : "text-foreground/35 group-hover:text-foreground/60"
                                    )}>
                                        {v.id}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Activity Log (4 cols) */}
                <div className="lg:col-span-4 bg-background rounded-2xl border border-foreground/[0.07] flex flex-col overflow-hidden" style={{ maxHeight: 420 }}>
                    <div className="px-6 py-4 border-b border-foreground/[0.06] flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Live</p>
                            <h3 className="font-display text-[1rem] font-light text-foreground leading-tight">Activity Log</h3>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-foreground/[0.05]">
                        {ACTIVITY.map((item, i) => (
                            <div key={i} className="px-6 py-4 hover:bg-foreground/[0.02] transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className={cn(
                                        "text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-md",
                                        item.tagStyle
                                    )}>
                                        {item.tag}
                                    </span>
                                    <span className="text-[11px] text-foreground/30 font-light">{item.time}</span>
                                </div>
                                <p className="text-[13px] font-light text-foreground/70 leading-snug">{item.msg}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-3 border-t border-foreground/[0.06] text-center">
                        <Link href="/admin/orders" className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 hover:text-foreground transition-colors">
                            View all logs
                        </Link>
                    </div>
                </div>

                {/* Recent Orders table (full width) */}
                <div className="lg:col-span-12 bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">
                    <div className="px-8 py-5 border-b border-foreground/[0.06] flex justify-between items-center">
                        <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40">Recent</p>
                            <h3 className="font-display text-[1rem] font-light text-foreground mt-0.5">Orders</h3>
                        </div>
                        <Link href="/admin/orders" className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 hover:text-foreground transition-colors">
                            View all →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-foreground/[0.06] text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/30">
                                    {["Order ID", "Customer", "Amount", "Status", ""].map((h, i) => (
                                        <th key={i} className={cn("px-8 py-3 font-medium", i === 4 && "text-right")}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/[0.05]">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="group hover:bg-foreground/[0.02] transition-colors">
                                        <td className="px-8 py-4 text-[13px] font-mono font-medium text-foreground/70">
                                            #ORD-00{i}
                                        </td>
                                        <td className="px-8 py-4 text-[13px] font-light text-foreground/70">Demo Customer</td>
                                        <td className="px-8 py-4 text-[13px] font-medium text-foreground">R2,450.00</td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-medium uppercase tracking-[0.1em] px-2.5 py-1 rounded-full",
                                                i % 2 === 0
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-emerald-100 text-emerald-700"
                                            )}>
                                                {i % 2 === 0 ? "Packing" : "Delivered"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="p-1.5 opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-foreground transition-all">
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({ label, value, change, trend, info }: {
    label: string; value: string; change: string;
    trend: "up" | "neutral" | "error"; info: string;
}) {
    const chipStyle =
        trend === "up"      ? "bg-emerald-50 text-emerald-700" :
        trend === "error"   ? "bg-red-50 text-red-600"         :
                              "bg-foreground/5 text-foreground/50";

    const Icon = trend === "up" ? TrendingUp : trend === "error" ? TrendingDown : null;

    return (
        <div className="bg-background rounded-2xl border border-foreground/[0.07] p-6 hover:border-foreground/15 transition-colors group">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-4">{label}</p>
            <h4 className="font-display text-[2rem] font-light text-foreground tracking-tight leading-none mb-4">
                {value}
            </h4>
            <div className="flex items-center gap-2">
                <span className={cn("flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg", chipStyle)}>
                    {Icon && <Icon size={11} />}
                    {change}
                </span>
                {info && <span className="text-[11px] font-light text-foreground/30">{info}</span>}
            </div>
        </div>
    );
}
