"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard, ShoppingBag, Package, Users,
    BarChart3, Settings, Factory, MapPin, Search,
    SlidersHorizontal, ArrowUpDown, Plus,
    AlertTriangle, ClipboardCheck, CheckCircle2,
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

const PREMIER = {
    name:    "Apex Industrial Cardboard Co.",
    location:"Chicago, IL, USA",
    onTime:  "98.5%",
    orders:  24,
    volume:  "1.2M units",
    contact: { name: "Sarah Jenkins", email: "s.jenkins@apex.com" },
};

const NETWORK = [
    { label: "Active Vendors",  value: "42", type: "ok"    as const },
    { label: "Pending Audits",  value: "15", type: "warn"  as const },
    { label: "Supply Alerts",   value: "3",  type: "error" as const },
];

const VENDORS = [
    { name: "Global PolyTech",    status: "ACTIVE",    desc: "High-density polyethylene protective films and bubble wrap.",          rating: "4.8", orders: 12, dim: false },
    { name: "SteelStrap Inc.",    status: "ACTIVE",    desc: "Industrial-grade metal strapping and tensioning equipment.",           rating: "4.5", orders: 8,  dim: false },
    { name: "EcoKraft Paper",     status: "AUDIT REQ", desc: "Sustainable kraft paper rolls and void fill from recycled materials.", rating: "3.9", orders: 2,  dim: true  },
    { name: "Precision Tapes LLC",status: "ACTIVE",    desc: "Water-activated and reinforced tapes for automated carton sealing.",   rating: "4.9", orders: 19, dim: false },
    { name: "ShieldFoam Works",   status: "ACTIVE",    desc: "Custom-cut polyurethane and EPE foam inserts for fragile products.",   rating: "4.6", orders: 11, dim: false },
    { name: "ClearPack Solutions",status: "SUSPENDED", desc: "Transparent BOPP bags and wicketed poly bags for retail display.",     rating: "2.1", orders: 0,  dim: true  },
];

const STATUS_CHIP: Record<string, string> = {
    "ACTIVE":    "bg-emerald-50 text-emerald-700",
    "AUDIT REQ": "bg-amber-50 text-amber-700",
    "SUSPENDED": "bg-red-50 text-red-600",
};

export default function AdminVendors() {
    const [query, setQuery] = useState("");
    const filtered = VENDORS.filter(v => v.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">Admin Panel</p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">Vendors</h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1 max-w-xl">
                        Manage verified manufacturers, review performance metrics, and oversee active supply chains.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-foreground/[0.04] rounded-full border border-foreground/[0.06] w-56">
                        <Search size={13} className="text-foreground/30 shrink-0" />
                        <input
                            type="text" placeholder="Search vendors…"
                            value={query} onChange={e => setQuery(e.target.value)}
                            className="bg-transparent text-[13px] font-light focus:outline-none w-full placeholder:text-foreground/30"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors">
                        <Plus size={14} /> Add Vendor
                    </button>
                </div>
            </div>

            {/* ── Bento Grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Premier Supplier (8 cols) */}
                <div className="md:col-span-8 bg-background rounded-2xl border border-foreground/[0.07] p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/40 bg-foreground/5 px-3 py-1 rounded-full inline-block mb-4">
                                Premier Supplier
                            </span>
                            <h3 className="font-display text-[1.8rem] font-light text-foreground tracking-tight">
                                {PREMIER.name}
                            </h3>
                            <p className="text-[13px] font-light text-foreground/50 mt-2 flex items-center gap-1.5">
                                <MapPin size={13} /> {PREMIER.location}
                            </p>
                        </div>
                        <div className="text-right shrink-0 ml-6">
                            <div className="font-display text-[3rem] font-light text-foreground tracking-tight leading-none">
                                {PREMIER.onTime}
                            </div>
                            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 mt-1">
                                On-Time Delivery
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 border-t border-foreground/[0.07] pt-6">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-1">Active Orders</p>
                            <p className="font-display text-[1.5rem] font-light text-foreground">{PREMIER.orders}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-1">Volume (YTD)</p>
                            <p className="font-display text-[1.5rem] font-light text-foreground">{PREMIER.volume}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40 mb-1">Primary Contact</p>
                            <p className="text-[13px] font-medium text-foreground">{PREMIER.contact.name}</p>
                            <p className="text-[11px] font-light text-foreground/40">{PREMIER.contact.email}</p>
                        </div>
                    </div>
                </div>

                {/* Network Status (4 cols) */}
                <div className="md:col-span-4 bg-foreground/[0.025] rounded-2xl border border-foreground/[0.07] p-8 flex flex-col">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/40 pb-4 border-b border-foreground/[0.07] mb-8">
                        Network Status
                    </p>
                    <div className="flex-1 flex flex-col justify-center gap-8">
                        {NETWORK.map(n => (
                            <div key={n.label}>
                                <div className={cn(
                                    "font-display text-[3rem] font-light tracking-tight leading-none",
                                    n.type === "error" ? "text-red-500" : "text-foreground"
                                )}>
                                    {n.value}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    {n.type === "ok"    && <CheckCircle2 size={11} className="text-emerald-500" />}
                                    {n.type === "warn"  && <ClipboardCheck size={11} className="text-amber-500" />}
                                    {n.type === "error" && <AlertTriangle size={11} className="text-red-400"    />}
                                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40">
                                        {n.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vendor Grid (full width) */}
                <div className="md:col-span-12 mt-2">
                    <div className="flex justify-between items-center mb-6 pb-3 border-b border-foreground/[0.07]">
                        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40">
                            All Verified Vendors
                        </p>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">
                                <SlidersHorizontal size={13} /> Filter
                            </button>
                            <button className="flex items-center gap-1.5 text-[11px] font-medium text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest">
                                <ArrowUpDown size={13} /> Sort
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(v => (
                            <div
                                key={v.name}
                                className={cn(
                                    "bg-background rounded-2xl border border-foreground/[0.07] p-6 hover:border-foreground/20 transition-all cursor-pointer group",
                                    v.dim && "opacity-60"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h5 className="font-display text-[1.05rem] font-light text-foreground tracking-tight group-hover:underline underline-offset-4">
                                        {v.name}
                                    </h5>
                                    <span className={cn(
                                        "text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full shrink-0 ml-2",
                                        STATUS_CHIP[v.status] ?? "bg-foreground/5 text-foreground/40"
                                    )}>
                                        {v.status}
                                    </span>
                                </div>
                                <p className="text-[12px] font-light text-foreground/50 mb-5 h-8 overflow-hidden leading-snug">
                                    {v.desc}
                                </p>
                                <div className="flex justify-between items-end pt-4 border-t border-foreground/[0.06]">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/30 mb-1">Rating</p>
                                        <p className="text-[1.1rem] font-display font-light text-foreground">{v.rating} / 5.0</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/30 mb-1">Orders</p>
                                        <p className="text-[1.1rem] font-display font-light text-foreground">{v.orders}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="md:col-span-3 py-20 text-center text-[13px] font-light text-foreground/30">
                                No vendors match your search
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
