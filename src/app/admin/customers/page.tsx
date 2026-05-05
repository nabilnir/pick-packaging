"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard, ShoppingBag, Package, Users,
    BarChart3, Settings, Factory, Search,
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

const MOCK_CUSTOMERS = [
    { id: "USR-001", name: "Amara Dlamini",  email: "amara@example.com",  orders: 12, spent: 14820, status: "Active",    joined: "2024-01-15" },
    { id: "USR-002", name: "Liam van Wyk",   email: "liam@example.com",   orders: 4,  spent: 3240,  status: "Active",    joined: "2024-03-22" },
    { id: "USR-003", name: "Priya Naidoo",   email: "priya@example.com",  orders: 27, spent: 48600, status: "Active",    joined: "2023-11-05" },
    { id: "USR-004", name: "Sipho Khumalo",  email: "sipho@example.com",  orders: 1,  spent: 899,   status: "Inactive",  joined: "2025-02-01" },
    { id: "USR-005", name: "Yuki Tanaka",    email: "yuki@example.com",   orders: 9,  spent: 11200, status: "Active",    joined: "2024-07-14" },
    { id: "USR-006", name: "Carlos Mendes",  email: "carlos@example.com", orders: 3,  spent: 2100,  status: "Suspended", joined: "2024-05-30" },
    { id: "USR-007", name: "Faith Okonkwo",  email: "faith@example.com",  orders: 18, spent: 22400, status: "Active",    joined: "2023-09-18" },
];

const STATUS_CHIP: Record<string, string> = {
    Active:    "bg-emerald-50 text-emerald-700",
    Inactive:  "bg-foreground/5 text-foreground/40",
    Suspended: "bg-red-50 text-red-600",
};

export default function AdminCustomers() {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("All");

    const filtered = MOCK_CUSTOMERS.filter(c => {
        const matchesQuery =
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.email.toLowerCase().includes(query.toLowerCase()) ||
            c.id.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === "All" || c.status === filter;
        return matchesQuery && matchesFilter;
    });

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">Admin Panel</p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">Customers</h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1">
                        Registered accounts, order history, and status management.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[11px] font-medium text-foreground/40 border border-foreground/10 px-4 py-2 rounded-xl">
                    <Users size={14} />
                    {MOCK_CUSTOMERS.length} total accounts
                </div>
            </div>

            {/* ── Table card ──────────────────────────────────────────── */}
            <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">

                {/* Controls */}
                <div className="px-6 py-4 border-b border-foreground/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-foreground/[0.04] rounded-full border border-foreground/[0.06] w-full md:w-72">
                        <Search size={14} className="text-foreground/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search customers…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="bg-transparent text-[13px] font-light focus:outline-none w-full text-foreground placeholder:text-foreground/30"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["All", "Active", "Inactive", "Suspended"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 rounded-lg transition-colors",
                                    filter === f
                                        ? "bg-foreground text-background"
                                        : "text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-foreground/[0.06] text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/30">
                                {["Customer ID", "Name / Email", "Orders", "Total Spent", "Status", "Joined"].map(h => (
                                    <th key={h} className="px-8 py-3 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/[0.05]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-16 text-center text-[13px] font-light text-foreground/30">
                                        No customers match your search
                                    </td>
                                </tr>
                            ) : filtered.map(c => (
                                <tr key={c.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                    <td className="px-8 py-4 font-mono text-[12px] text-foreground/40">{c.id}</td>
                                    <td className="px-8 py-4">
                                        <p className="text-[13px] font-medium text-foreground">{c.name}</p>
                                        <p className="text-[11px] font-light text-foreground/40">{c.email}</p>
                                    </td>
                                    <td className="px-8 py-4 text-[13px] font-medium text-foreground">{c.orders}</td>
                                    <td className="px-8 py-4 text-[13px] font-medium text-foreground">
                                        R{c.spent.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={cn(
                                            "text-[10px] font-medium uppercase tracking-[0.1em] px-2.5 py-1 rounded-full",
                                            STATUS_CHIP[c.status]
                                        )}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-[12px] font-light text-foreground/40">
                                        {new Date(c.joined).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-8 py-3 border-t border-foreground/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-light text-foreground/30">
                        Showing {filtered.length} of {MOCK_CUSTOMERS.length} customers
                    </span>
                </div>
            </div>
        </DashboardLayout>
    );
}
