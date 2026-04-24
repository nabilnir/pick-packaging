"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle2, Search, Filter, LayoutDashboard, Heart, MapPin, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            fetch(`/api/orders?email=${user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setOrders(data.data);
                    setLoading(false);
                });
        }
    }, [user]);

    return (
        <DashboardLayout items={USER_NAV} title="Order History">
            <div className="max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-[2rem] font-light font-display">My Orders</h2>
                        <p className="text-foreground/40 font-light text-[14px]">Manage and track your recent purchases.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-2 bg-background border border-foreground/5 rounded-xl text-[13px]">
                            <Search size={16} className="opacity-30" />
                            <input type="text" placeholder="Search orders..." className="bg-transparent focus:outline-none w-32" />
                        </div>
                        <button className="p-2 border border-foreground/5 rounded-xl hover:bg-foreground/5 transition-all">
                            <Filter size={20} className="opacity-40" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center opacity-20 italic">Loading your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="py-32 text-center rounded-2xl border-2 border-dashed border-foreground/5 bg-foreground/[0.01]">
                        <ShoppingBag className="mx-auto opacity-10 mb-6" size={64} strokeWidth={1} />
                        <p className="opacity-40 font-light italic text-[18px] mb-8 font-display">You haven't placed any orders yet.</p>
                        <Link 
                            href="/shop"
                            className="inline-flex items-center gap-2 py-4 px-8 bg-foreground text-background rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all shadow-md group"
                        >
                            Browse Products
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {orders.map((order: any) => (
                                <div key={order._id} className="group bg-background rounded-2xl border border-foreground/5 hover:border-foreground/10 transition-all overflow-hidden">
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-foreground/5">
                                        <div className="flex flex-wrap gap-8">
                                            <div>
                                                <p className="text-[11px] uppercase tracking-widest font-bold opacity-30 mb-1">Order Placed</p>
                                                <p className="text-[14px] font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-widest font-bold opacity-30 mb-1">Total Amount</p>
                                                <p className="text-[14px] font-medium">{order.currency}{order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-widest font-bold opacity-30 mb-1">Order ID</p>
                                                <p className="text-[14px] font-mono font-medium">#{order._id.substring(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={order.status} />
                                            <button className="p-2 rounded-xl hover:bg-foreground/5 transition-all text-foreground/40 hover:text-foreground">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6 md:p-8 bg-foreground/[0.01]">
                                        <div className="flex flex-wrap items-center gap-6">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 group/item">
                                                    <div className="relative w-16 h-16 rounded-xl bg-foreground/5 overflow-hidden p-2">
                                                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                                                    </div>
                                                    <div className="hidden lg:block">
                                                        <p className="text-[13px] font-medium leading-tight max-w-[150px] truncate">{item.name}</p>
                                                        <p className="text-[11px] opacity-40">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-12 border-t border-foreground/5 flex justify-center">
                            <Link 
                                href="/shop"
                                className="inline-flex items-center gap-3 py-4 px-10 bg-foreground text-background rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg group"
                            >
                                <ShoppingBag size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                Continue Shopping
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'Pending': 'bg-foreground/5 text-foreground/40',
        'Processing': 'bg-amber-100 text-amber-700',
        'Packing': 'bg-blue-100 text-blue-700',
        'Dispatched': 'bg-purple-100 text-purple-700',
        'Delivered': 'bg-emerald-100 text-emerald-700',
        'Cancelled': 'bg-red-100 text-red-700'
    };

    const icons: any = {
        'Processing': <Package size={12} />,
        'Dispatched': <Truck size={12} />,
        'Delivered': <CheckCircle2 size={12} />
    };

    return (
        <span className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
            styles[status] || 'bg-foreground/5 text-foreground/40'
        )}>
            {icons[status]}
            {status}
        </span>
    );
}
