"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    Factory,
    MapPin,
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    Plus,
    AlertTriangle,
    ClipboardCheck,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ADMIN_NAV = [
    { label: "Overview",  href: "/admin",          icon: LayoutDashboard },
    { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag     },
    { label: "Products",  href: "/admin/products",  icon: Package         },
    { label: "Customers", href: "/admin/customers", icon: Users           },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3       },
    { label: "Vendors",   href: "/admin/vendors",   icon: Factory         },
    { label: "Settings",  href: "/admin/settings",  icon: Settings        },
];

// ── Data ──────────────────────────────────────────────────────────────────
const PREMIER = {
    name:    "Apex Industrial Cardboard Co.",
    location:"Chicago, IL, USA",
    onTime:  "98.5%",
    orders:  24,
    volume:  "1.2M units",
    contact: { name: "Sarah Jenkins", email: "s.jenkins@apex.com" },
};

const NETWORK = [
    { label: "Active Vendors",  value: "42", type: "ok"    },
    { label: "Pending Audits",  value: "15", type: "warn"  },
    { label: "Supply Alerts",   value: "3",  type: "error" },
];

const STATUS_MAP: Record<string, string> = {
    ACTIVE:     "bg-stone-900 text-white border-stone-900",
    "AUDIT REQ":"bg-stone-200 text-stone-700 border-stone-400",
    SUSPENDED:  "bg-red-50   text-red-700   border-red-300",
};

const VENDORS = [
    {
        name:    "Global PolyTech",
        status:  "ACTIVE",
        desc:    "Specialized manufacturer of high-density polyethylene protective films and bubble wrap.",
        rating:  "4.8 / 5.0",
        orders:  12,
        dim:     false,
    },
    {
        name:    "SteelStrap Inc.",
        status:  "ACTIVE",
        desc:    "Supplier of industrial-grade metal strapping and tensioning equipment for heavy freight.",
        rating:  "4.5 / 5.0",
        orders:  8,
        dim:     false,
    },
    {
        name:    "EcoKraft Paper",
        status:  "AUDIT REQ",
        desc:    "Sustainable kraft paper rolls and void fill solutions from recycled materials.",
        rating:  "3.9 / 5.0",
        orders:  2,
        dim:     true,
    },
    {
        name:    "Precision Tapes LLC",
        status:  "ACTIVE",
        desc:    "Water-activated and reinforced packaging tapes for automated carton sealing.",
        rating:  "4.9 / 5.0",
        orders:  19,
        dim:     false,
    },
    {
        name:    "ShieldFoam Works",
        status:  "ACTIVE",
        desc:    "Custom-cut polyurethane and EPE foam inserts for fragile product protection.",
        rating:  "4.6 / 5.0",
        orders:  11,
        dim:     false,
    },
    {
        name:    "ClearPack Solutions",
        status:  "SUSPENDED",
        desc:    "Transparent BOPP bags and wicketed poly bags for retail display packaging.",
        rating:  "2.1 / 5.0",
        orders:  0,
        dim:     true,
    },
];

// ═════════════════════════════════════════════════════════════════════════
export default function AdminVendors() {
    const [query, setQuery] = useState("");

    const filtered = VENDORS.filter(v =>
        v.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-5">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-stone-900">
                        Vendors
                    </h1>
                    <p className="text-sm text-stone-500 mt-1 max-w-2xl">
                        Manage verified manufacturers, review performance metrics, and oversee active supply chains.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border border-stone-300 bg-white px-3 py-2 w-56">
                        <Search size={14} className="text-stone-400 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="bg-transparent text-[12px] font-bold uppercase tracking-widest placeholder:text-stone-400 focus:outline-none w-full"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-stone-900 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-stone-700 transition-colors border border-stone-900">
                        <Plus size={14} />
                        Add Vendor
                    </button>
                </div>
            </div>

            {/* ── Bento Grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Premier Supplier (8 cols) */}
                <div className="md:col-span-8 border border-stone-900 bg-white p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <span className="bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mb-4 border border-stone-300">
                                PREMIER SUPPLIER
                            </span>
                            <h3 className="text-3xl font-black tracking-tighter text-stone-900">
                                {PREMIER.name}
                            </h3>
                            <p className="text-sm text-stone-500 mt-2 flex items-center gap-1.5">
                                <MapPin size={13} />
                                {PREMIER.location}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-black tracking-tighter text-stone-900">
                                {PREMIER.onTime}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">
                                ON-TIME DELIVERY
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 border-t border-stone-200 pt-6">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">ACTIVE ORDERS</div>
                            <div className="text-2xl font-black text-stone-900">{PREMIER.orders}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">TOTAL VOLUME (YTD)</div>
                            <div className="text-2xl font-black text-stone-900">{PREMIER.volume}</div>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">PRIMARY CONTACT</div>
                            <div className="text-sm font-bold text-stone-900">{PREMIER.contact.name}</div>
                            <div className="text-xs text-stone-400">{PREMIER.contact.email}</div>
                        </div>
                    </div>
                </div>

                {/* Network Status (4 cols) */}
                <div className="md:col-span-4 border border-stone-900 bg-stone-100 p-8 flex flex-col">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 pb-4 border-b border-stone-300 mb-8">
                        NETWORK STATUS
                    </h4>
                    <div className="flex-1 flex flex-col justify-center gap-8">
                        {NETWORK.map(n => (
                            <div key={n.label}>
                                <div className={cn(
                                    "text-5xl font-black tracking-tighter",
                                    n.type === "error" ? "text-red-600" : "text-stone-900"
                                )}>
                                    {n.value}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    {n.type === "ok"    && <CheckCircle2 size={12} className="text-stone-400" />}
                                    {n.type === "warn"  && <ClipboardCheck size={12} className="text-stone-500" />}
                                    {n.type === "error" && <AlertTriangle  size={12} className="text-red-500" />}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                        {n.label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vendor List (12 cols) */}
                <div className="md:col-span-12 mt-4">
                    <div className="flex justify-between items-end mb-6 pb-3 border-b border-stone-200">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                            ALL VERIFIED VENDORS
                        </h4>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors">
                                <SlidersHorizontal size={13} /> Filter
                            </button>
                            <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors">
                                <ArrowUpDown size={13} /> Sort
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(v => (
                            <div
                                key={v.name}
                                className={cn(
                                    "border border-stone-900 bg-white p-6 hover:bg-stone-50 transition-colors cursor-pointer group",
                                    v.dim && "opacity-70"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h5 className="text-xl font-black tracking-tight text-stone-900 group-hover:underline underline-offset-2">
                                        {v.name}
                                    </h5>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shrink-0 ml-2",
                                        STATUS_MAP[v.status] ?? "bg-stone-100 text-stone-500 border-stone-300"
                                    )}>
                                        {v.status}
                                    </span>
                                </div>

                                <p className="text-sm text-stone-500 mb-6 h-10 overflow-hidden leading-tight">
                                    {v.desc}
                                </p>

                                <div className="flex justify-between items-end border-t border-stone-200 pt-4">
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">RATING</div>
                                        <div className="text-lg font-black text-stone-900">{v.rating}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">ORDERS</div>
                                        <div className="text-lg font-black text-stone-900">{v.orders}</div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="md:col-span-3 py-20 text-center text-[12px] font-bold uppercase tracking-widest text-stone-300">
                                No vendors match your search
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
