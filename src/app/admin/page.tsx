"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Package, 
    Users, 
    BarChart3, 
    Settings,
    TrendingUp,
    TrendingDown,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminOverview() {
    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    label="Total Revenue" 
                    value="R124,500" 
                    change="+12.5%" 
                    trend="up" 
                    info="vs last month"
                />
                <StatCard 
                    label="New Orders" 
                    value="42" 
                    change="+18.2%" 
                    trend="up" 
                    info="vs last month"
                />
                <StatCard 
                    label="Active Customers" 
                    value="1,240" 
                    change="-2.1%" 
                    trend="down" 
                    info="vs last month"
                />
                <StatCard 
                    label="AOV" 
                    value="R2,964" 
                    change="+5.4%" 
                    trend="up" 
                    info="vs last month"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-8 bg-background rounded-2xl border border-foreground/5 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[1.25rem] font-light font-display">Recent Orders</h3>
                        <Link href="/admin/orders" className="text-[12px] uppercase tracking-widest text-brand-green font-bold hover:opacity-70">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-foreground/5 text-[11px] uppercase tracking-widest opacity-40">
                                    <th className="pb-4 font-bold">Order ID</th>
                                    <th className="pb-4 font-bold">Customer</th>
                                    <th className="pb-4 font-bold">Amount</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right text-transparent">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-foreground/5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="group hover:bg-foreground/[0.02]">
                                        <td className="py-4 text-[14px] font-medium font-mono">#ORD-00{i}</td>
                                        <td className="py-4 text-[14px]">Demo Customer</td>
                                        <td className="py-4 text-[14px]">R2,450.00</td>
                                        <td className="py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                                                i % 2 === 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                            )}>
                                                {i % 2 === 0 ? "Packing" : "Delivered"}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button className="p-2 opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-foreground transition-all">
                                                <ArrowUpRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales Chart Placeholder */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-background rounded-2xl border border-foreground/5 p-8 h-full flex flex-col">
                        <h3 className="text-[1.25rem] font-light font-display mb-8">Revenue Breakdown</h3>
                        <div className="flex-1 flex items-center justify-center opacity-20 italic font-light">
                            Chart Visualization placeholder
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ label, value, change, trend, info }: { label: string, value: string, change: string, trend: 'up' | 'down', info: string }) {
    return (
        <div className="bg-background rounded-2xl border border-foreground/5 p-8 group hover:border-brand-green/20 transition-all shadow-sm">
            <p className="text-[12px] uppercase tracking-widest opacity-40 font-bold mb-4">{label}</p>
            <h4 className="text-[2.25rem] font-light leading-none mb-4">{value}</h4>
            <div className="flex items-center gap-2">
                <div className={cn(
                    "flex items-center gap-1 text-[13px] font-bold py-1 px-2 rounded-lg",
                    trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {change}
                </div>
                <span className="text-[12px] opacity-40 font-light">{info}</span>
            </div>
        </div>
    );
}

// Minimal mock Link since I'm mixing definitions
import Link from 'next/link';
