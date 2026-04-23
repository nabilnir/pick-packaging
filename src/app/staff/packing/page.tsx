"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
    Package, 
    ClipboardList, 
    Truck, 
    Box, 
    Barcode,
    ListTodo,
    ChevronRight,
    Search,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast-provider';
import Image from 'next/image';

const STAFF_NAV = [
    { label: "Overview", href: "/staff", icon: ListTodo },
    { label: "Packing Queue", href: "/staff/packing", icon: Package },
    { label: "Shipments", href: "/staff/shipments", icon: Truck },
    { label: "Inventory", href: "/staff/inventory", icon: Box },
];

export default function StaffPacking() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    const fetchOrders = async () => {
        const res = await fetch('/api/orders?status=Processing'); // Staff only see orders ready to pack
        const data = await res.json();
        if (data.success) setOrders(data.data);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const moveToPacking = async (id: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'Packing' })
            });
            if (res.ok) {
                success('Order moved to packing station');
                fetchOrders();
            }
        } catch (err) { error('Failed to update status'); }
    };

    const markAsShipped = async (id: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'Dispatched', trackingNumber: 'TRK-' + Math.random().toString(36).substring(7).toUpperCase() })
            });
            if (res.ok) {
                success('Order marked as Dispatched! Label generated.');
                fetchOrders();
            }
        } catch (err) { error('Failed to update status'); }
    };

    return (
        <DashboardLayout items={STAFF_NAV} title="Packing Operations">
            <div className="max-w-5xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[2rem] font-light font-display">Packing Queue</h2>
                        <p className="text-foreground/40 font-light text-[14px]">Process orders and prepare them for shipment.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-bold text-brand-green px-3 py-1 bg-brand-green/10 rounded-full">{orders.length} Ready</span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center opacity-20 italic">Loading queue...</div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center rounded-2xl border-2 border-dashed border-foreground/5">
                        <CheckCircle2 className="mx-auto text-brand-green opacity-20 mb-4" size={48} />
                        <p className="opacity-40 font-light italic">All caught up! No orders pending packing.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="bg-background rounded-2xl border border-foreground/5 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-brand-green/20 transition-all">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4 pb-4 border-b border-foreground/5">
                                        <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/30">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-[18px] font-bold font-mono">#{order._id.substring(0, 8).toUpperCase()}</h4>
                                            <p className="text-[13px] opacity-40">{order.shippingAddress?.fullName} • {order.items.length} unique items</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 bg-foreground/[0.02] p-2 rounded-lg pr-4">
                                                <div className="relative w-10 h-10 rounded-md bg-white border border-foreground/5 p-1 shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[12px] font-medium truncate max-w-[120px]">{item.name}</p>
                                                    <p className="text-[11px] opacity-40">Qty: <span className="text-foreground font-bold">{item.quantity}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex sm:flex-col gap-3 min-w-[200px]">
                                    <button 
                                        onClick={() => markAsShipped(order._id)}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-brand-green text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                                    >
                                        <Truck size={14} />
                                        Ship Order
                                    </button>
                                    <button 
                                        onClick={() => success('Picking slip printing...')}
                                        className="w-full flex items-center justify-center gap-2 py-4 border border-foreground/10 text-foreground/60 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-all"
                                    >
                                        <Barcode size={14} />
                                        Print Slip
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
