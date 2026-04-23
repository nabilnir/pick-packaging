"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
    ShoppingBag, 
    Search, 
    Filter, 
    MoreVertical, 
    LayoutDashboard, 
    Package, 
    Users, 
    BarChart3, 
    Settings,
    Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast-provider';

const ADMIN_NAV = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    const fetchOrders = async () => {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) setOrders(data.data);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                success(`Order status updated to ${status}`);
                fetchOrders();
            }
        } catch (err) {
            error('Failed to update status');
        }
    };

    return (
        <DashboardLayout items={ADMIN_NAV} title="Global Orders">
            <div className="bg-background rounded-2xl border border-foreground/5 overflow-hidden">
                {/* Filters */}
                <div className="p-6 border-b border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-foreground/3 rounded-xl border border-foreground/5 w-full md:w-96">
                        <Search size={16} className="opacity-30" />
                        <input type="text" placeholder="Search orders, customers, IDs..." className="bg-transparent text-[13px] focus:outline-none w-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-foreground/5 rounded-xl text-[13px] hover:bg-foreground/5 transition-all">
                            <Filter size={16} />
                            Status
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-foreground/[0.01] text-[11px] uppercase tracking-widest opacity-40">
                                <th className="px-8 py-4 font-bold">Order ID</th>
                                <th className="px-8 py-4 font-bold">Customer</th>
                                <th className="px-8 py-4 font-bold">Date</th>
                                <th className="px-8 py-4 font-bold">Amount</th>
                                <th className="px-8 py-4 font-bold">Status</th>
                                <th className="px-8 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/5">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-20 text-center opacity-20 italic">Loading orders...</td></tr>
                            ) : orders.map((order: any) => (
                                <tr key={order._id} className="group hover:bg-foreground/[0.01] transition-colors">
                                    <td className="px-8 py-5 text-[14px] font-mono font-medium">#{order._id.substring(0, 8).toUpperCase()}</td>
                                    <td className="px-8 py-5">
                                        <p className="text-[14px] font-medium">{order.shippingAddress?.fullName || 'Guest'}</p>
                                        <p className="text-[11px] opacity-40">{order.userEmail}</p>
                                    </td>
                                    <td className="px-8 py-5 text-[14px] opacity-60">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-[14px] font-medium">R{order.totalAmount.toFixed(2)}</td>
                                    <td className="px-8 py-5">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className={cn(
                                                "text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-brand-green/20 cursor-pointer",
                                                order.status === 'Processing' ? "bg-amber-100 text-amber-700" :
                                                order.status === 'Packing' ? "bg-blue-100 text-blue-700" :
                                                order.status === 'Dispatched' ? "bg-purple-100 text-purple-700" :
                                                order.status === 'Delivered' ? "bg-emerald-100 text-emerald-700" :
                                                "bg-foreground/5 text-foreground/40"
                                            )}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Packing">Packing</option>
                                            <option value="Dispatched">Dispatched</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-foreground/5 rounded-lg transition-all">
                                            <MoreVertical size={16} className="opacity-40" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
