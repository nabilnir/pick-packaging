"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
    Package, 
    ClipboardList, 
    Truck, 
    Box, 
    Barcode,
    ListTodo,
    ChevronRight,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const STAFF_NAV = [
    { label: "Overview", href: "/staff", icon: ListTodo },
    { label: "Picking List", href: "/staff/picking", icon: ClipboardList },
    { label: "Packing Queue", href: "/staff/packing", icon: Package },
    { label: "Shipments", href: "/staff/shipments", icon: Truck },
    { label: "Inventory", href: "/staff/inventory", icon: Box },
    { label: "Manifests", href: "/staff/manifests", icon: Barcode },
];

export default function StaffDashboard() {
    return (
        <DashboardLayout items={STAFF_NAV} title="Warehouse Operations">
            <div className="space-y-10">
                {/* Workload Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <WorkloadCard 
                        label="Oustanding Picks" 
                        count={18} 
                        status="Urgent" 
                        color="text-red-600 bg-red-50"
                        icon={ClipboardList}
                    />
                    <WorkloadCard 
                        label="Ready to Pack" 
                        count={12} 
                        status="Standard" 
                        color="text-amber-600 bg-amber-50"
                        icon={Package}
                    />
                    <WorkloadCard 
                        label="Pending Shipment" 
                        count={24} 
                        status="Next Pickup: 16:00" 
                        color="text-emerald-600 bg-emerald-50"
                        icon={Truck}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Active Picking Queue */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[1.25rem] font-light font-display">Active Packing Queue</h3>
                            <button className="text-[12px] font-bold text-brand-green uppercase tracking-widest">Refresh Queue</button>
                        </div>
                        
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <PackingJobCard 
                                    key={i}
                                    id={`#ORD-202${i}`}
                                    items={4+i}
                                    customer="Premium Customer Ltd"
                                    timeAge={`${i * 15}m ago`}
                                    priority={i === 1}
                                />
                            ))}
                        </div>

                        <Link 
                            href="/staff/packing" 
                            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-foreground/5 rounded-2xl text-[13px] font-bold uppercase tracking-widest text-foreground/20 hover:border-brand-green/20 hover:text-brand-green transition-all"
                        >
                            View Full Queue
                            <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Right: Operations Feed */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-background rounded-2xl border border-foreground/5 p-8">
                            <h3 className="text-[14px] uppercase tracking-widest font-bold opacity-40 mb-8">Stock Alerts</h3>
                            <div className="space-y-6">
                                <StockAlertItem 
                                    item="95mm Dome Lids" 
                                    status="Low Stock" 
                                    remaining="250 units" 
                                />
                                <StockAlertItem 
                                    item="Eco Burger Boxes" 
                                    status="Critical" 
                                    remaining="12 units" 
                                    critical 
                                />
                                <StockAlertItem 
                                    item="Kraft Sandwich Box" 
                                    status="Low Stock" 
                                    remaining="400 units" 
                                />
                            </div>
                            <button className="w-full mt-8 py-3 bg-foreground text-background rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-brand-green transition-colors">
                                Inventory Audit
                            </button>
                        </section>

                        <div className="p-8 rounded-2xl bg-brand-green/5 border border-brand-green/10">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 size={18} className="text-brand-green" />
                                <h4 className="text-[14px] font-bold text-brand-green uppercase tracking-widest">Manifest Signed</h4>
                            </div>
                            <p className="text-[13px] opacity-60 font-light leading-relaxed">
                                Currier pickup for #MANIFEST-302 was successful at 14:10.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function WorkloadCard({ label, count, status, color, icon: Icon }: { label: string, count: number, status: string, color: string, icon: any }) {
    return (
        <div className="bg-background rounded-2xl border border-foreground/5 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-foreground/3 flex items-center justify-center text-foreground/30">
                    <Icon size={20} />
                </div>
                <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", color)}>
                    {status}
                </span>
            </div>
            <p className="text-[12px] uppercase tracking-widest opacity-40 font-bold mb-1">{label}</p>
            <h4 className="text-[2.5rem] font-light leading-none">{count}</h4>
        </div>
    );
}

function PackingJobCard({ id, items, customer, timeAge, priority }: { id: string, items: number, customer: string, timeAge: string, priority?: boolean }) {
    return (
        <div className={cn(
            "bg-background rounded-2xl border p-6 flex items-center justify-between group hover:shadow-md transition-all",
            priority ? "border-brand-green/30 bg-brand-green/[0.02]" : "border-foreground/5"
        )}>
            <div className="flex items-center gap-6">
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    priority ? "bg-brand-green text-white" : "bg-foreground/5 text-foreground/30"
                )}>
                    <Package size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[15px] font-bold font-mono">{id}</span>
                        {priority && <span className="text-[10px] font-bold uppercase tracking-tighter text-brand-green px-1.5 py-0.5 bg-brand-green/10 rounded-sm">High Priority</span>}
                    </div>
                    <p className="text-[13px] opacity-40 font-light">{customer} • {items} items</p>
                </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                    <p className="text-[12px] font-medium">{timeAge}</p>
                    <p className="text-[11px] opacity-30">In Queue</p>
                </div>
                <button className="flex items-center gap-2 py-3 px-5 rounded-xl bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:bg-brand-green transition-colors group/btn">
                    Start Packing
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}

function StockAlertItem({ item, status, remaining, critical = false }: { item: string, status: string, remaining: string, critical?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            <AlertCircle size={16} className={cn("mt-0.5", critical ? "text-red-500" : "text-amber-500")} />
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                    <h5 className="text-[13px] font-medium truncate">{item}</h5>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", critical ? "text-red-500" : "text-amber-500")}>
                        {status}
                    </span>
                </div>
                <p className="text-[11px] opacity-40 font-light">Only {remaining} left in location A-12</p>
            </div>
        </div>
    );
}
