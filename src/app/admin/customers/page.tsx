"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    Factory,
    Search,
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

// ── Mock data (replace with real API fetch when ready) ────────────────────
const MOCK_CUSTOMERS = [
    { id: "USR-001", name: "Amara Dlamini",   email: "amara@example.com",  orders: 12, spent: 14820, status: "Active",    joined: "2024-01-15" },
    { id: "USR-002", name: "Liam van Wyk",    email: "liam@example.com",   orders: 4,  spent: 3240,  status: "Active",    joined: "2024-03-22" },
    { id: "USR-003", name: "Priya Naidoo",    email: "priya@example.com",  orders: 27, spent: 48600, status: "Active",    joined: "2023-11-05" },
    { id: "USR-004", name: "Sipho Khumalo",   email: "sipho@example.com",  orders: 1,  spent: 899,   status: "Inactive",  joined: "2025-02-01" },
    { id: "USR-005", name: "Yuki Tanaka",     email: "yuki@example.com",   orders: 9,  spent: 11200, status: "Active",    joined: "2024-07-14" },
    { id: "USR-006", name: "Carlos Mendes",   email: "carlos@example.com", orders: 3,  spent: 2100,  status: "Suspended", joined: "2024-05-30" },
    { id: "USR-007", name: "Faith Okonkwo",   email: "faith@example.com",  orders: 18, spent: 22400, status: "Active",    joined: "2023-09-18" },
];

const STATUS_STYLES: Record<string, string> = {
    Active:    "bg-stone-900 text-white border-stone-900",
    Inactive:  "bg-stone-100 text-stone-500 border-stone-300",
    Suspended: "bg-red-50   text-red-700   border-red-300",
};

export default function AdminCustomers() {
    const [query, setQuery] = useState("");

    const filtered = MOCK_CUSTOMERS.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex justify-between items-end border-b border-stone-200 pb-5">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-stone-900">
                        Customers
                    </h1>
                    <p className="text-sm text-stone-500 mt-1 max-w-xl">
                        Registered accounts, order history, and account status management.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-stone-500 border border-stone-200 px-4 py-2">
                    <Users size={14} />
                    {MOCK_CUSTOMERS.length} Total
                </div>
            </div>

            {/* ── Table Card ──────────────────────────────────────────── */}
            <div className="border border-stone-200 bg-white overflow-hidden">

                {/* Controls */}
                <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 border border-stone-300 px-4 py-2 w-full md:w-80 bg-white">
                        <Search size={14} className="text-stone-400" />
                        <input
                            type="text"
                            placeholder="SEARCH CUSTOMERS..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="bg-transparent text-[11px] font-bold uppercase tracking-widest placeholder:text-stone-400 focus:outline-none w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["All", "Active", "Inactive", "Suspended"].map(f => (
                            <button
                                key={f}
                                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
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
                            <tr className="border-b border-stone-200">
                                {["Customer ID", "Name / Email", "Orders", "Total Spent", "Status", "Joined"].map(h => (
                                    <th key={h} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-[12px] uppercase tracking-widest text-stone-300 font-bold">
                                        No customers found
                                    </td>
                                </tr>
                            ) : filtered.map(c => (
                                <tr key={c.id} className="group hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-[12px] text-stone-400">{c.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-[14px] font-bold text-stone-900">{c.name}</p>
                                        <p className="text-[11px] text-stone-400">{c.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-stone-900">{c.orders}</td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-stone-900">
                                        R{c.spent.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                                            STATUS_STYLES[c.status]
                                        )}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[12px] text-stone-400">
                                        {new Date(c.joined).toLocaleDateString('en-ZA', { dateStyle: 'medium' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        Showing {filtered.length} of {MOCK_CUSTOMERS.length} customers
                    </span>
                </div>
            </div>
        </DashboardLayout>
    );
}
