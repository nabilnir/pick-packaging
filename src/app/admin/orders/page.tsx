"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    ShoppingBag, Search, MoreVertical,
    LayoutDashboard, Package, Users,
    BarChart3, Settings, Factory,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast-provider';

const ADMIN_NAV = [
    { label: "Overview",  href: "/admin",          icon: LayoutDashboard },
    { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag     },
    { label: "Products",  href: "/admin/products",  icon: Package         },
    { label: "Customers", href: "/admin/customers", icon: Users           },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3       },
    { label: "Vendors",   href: "/admin/vendors",   icon: Factory         },
    { label: "Settings",  href: "/admin/settings",  icon: Settings        },
];

const STATUS_CHIP: Record<string, string> = {
    Pending:    "bg-foreground/5 text-foreground/50",
    Processing: "bg-amber-50 text-amber-700",
    Packing:    "bg-blue-50 text-blue-700",
    Dispatched: "bg-violet-50 text-violet-700",
    Delivered:  "bg-emerald-50 text-emerald-700",
    Cancelled:  "bg-red-50 text-red-600",
};

export default function AdminOrders() {
    const [orders, setOrders]   = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery]     = useState("");
    const { success, error }    = useToast();

    const fetchOrders = async () => {
        const res  = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) setOrders(data.data);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/orders', {
                method:  'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ id, status }),
            });
            if (res.ok) { success(`Order updated to ${status}`); fetchOrders(); }
        } catch { error('Failed to update order status'); }
    };

    const filtered = orders.filter((o: any) =>
        o._id?.toLowerCase().includes(query.toLowerCase()) ||
        o.userEmail?.toLowerCase().includes(query.toLowerCase()) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">Admin Panel</p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">Orders</h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1">
                        Manage and update the status of all platform orders.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[11px] font-medium text-foreground/40 border border-foreground/10 px-4 py-2 rounded-xl">
                    <ShoppingBag size={14} />
                    {orders.length} total orders
                </div>
            </div>

            {/* ── Table Card ──────────────────────────────────────────── */}
            <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">

                {/* Controls */}
                <div className="px-6 py-4 border-b border-foreground/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-foreground/[0.04] rounded-full border border-foreground/[0.06] w-full md:w-80">
                        <Search size={14} className="text-foreground/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search orders, customers, IDs…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="bg-transparent text-[13px] font-light focus:outline-none w-full text-foreground placeholder:text-foreground/30"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["All", "Processing", "Dispatched", "Delivered"].map(f => (
                            <button
                                key={f}
                                className="text-[11px] font-medium uppercase tracking-[0.1em] px-3 py-1.5 rounded-lg text-foreground/40 hover:bg-foreground/5 hover:text-foreground transition-colors"
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
                                {["Order ID", "Customer", "Date", "Amount", "Status", ""].map((h, i) => (
                                    <th key={i} className={cn("px-8 py-3 font-medium", i === 5 && "text-right")}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/[0.05]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-[13px] font-light text-foreground/30 italic">
                                        Loading orders…
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-[13px] font-light text-foreground/30">
                                        No orders found
                                    </td>
                                </tr>
                            ) : filtered.map((order: any) => (
                                <tr key={order._id} className="group hover:bg-foreground/[0.02] transition-colors">
                                    <td className="px-8 py-4 text-[13px] font-mono font-medium text-foreground/60">
                                        #{order._id.substring(0, 8).toUpperCase()}
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-[13px] font-medium text-foreground">
                                            {order.shippingAddress?.fullName || 'Guest'}
                                        </p>
                                        <p className="text-[11px] font-light text-foreground/40">{order.userEmail}</p>
                                    </td>
                                    <td className="px-8 py-4 text-[13px] font-light text-foreground/50">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-4 text-[13px] font-medium text-foreground">
                                        R{order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-8 py-4">
                                        <select
                                            value={order.status}
                                            onChange={e => updateStatus(order._id, e.target.value)}
                                            className={cn(
                                                "text-[11px] font-medium uppercase tracking-[0.08em] px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-foreground/10 cursor-pointer appearance-none",
                                                STATUS_CHIP[order.status] ?? "bg-foreground/5 text-foreground/40"
                                            )}
                                        >
                                            {["Pending","Processing","Packing","Dispatched","Delivered","Cancelled"].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="p-1.5 opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-foreground transition-all rounded-lg hover:bg-foreground/5">
                                            <MoreVertical size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-8 py-3 border-t border-foreground/[0.06]">
                    <span className="text-[11px] font-light text-foreground/30">
                        {loading ? 'Loading…' : `${filtered.length} of ${orders.length} orders`}
                    </span>
                </div>
            </div>
        </DashboardLayout>
    );
}
