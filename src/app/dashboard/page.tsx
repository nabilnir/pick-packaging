"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Heart, 
    MapPin, 
    User,
    Package,
    ArrowRight,
    Search,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function UserDashboard() {
    return (
        <DashboardLayout items={USER_NAV} title="Account Dashboard">
            <div className="max-w-6xl">
                {/* Welcome Message */}
                <div className="mb-12">
                    <h2 className="text-[2.5rem] font-light font-display leading-tight mb-2">Hello, Sarah</h2>
                    <p className="text-foreground/40 font-light text-[1.1rem]">Welcome back to your Yucca account. Here's what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left: Active Order Monitoring */}
                    <div className="lg:col-span-8 space-y-10">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-[14px] uppercase tracking-[0.2em] font-bold opacity-40">Active Order Monitoring</h3>
                                <Link href="/dashboard/orders" className="text-[12px] font-bold text-brand-green border-b border-brand-green/20">View Order Details</Link>
                            </div>
                            
                            <div className="bg-background rounded-2xl border border-foreground/5 p-8 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-foreground/5">
                                    <div>
                                        <p className="text-[12px] opacity-40 uppercase tracking-widest font-bold mb-1">Order #ORD-992120</p>
                                        <h4 className="text-[1.25rem] font-light">Expected Arrival: Thursday, 14 Apr</h4>
                                    </div>
                                    <div className="px-5 py-2 rounded-full bg-amber-50 text-amber-600 text-[12px] font-bold uppercase tracking-widest">
                                        Currently Processing
                                    </div>
                                </div>

                                {/* Tracking Stepper */}
                                <div className="relative pt-4 pb-12">
                                    <div className="absolute top-[28px] left-[15px] right-[15px] h-[2px] bg-foreground/5 z-0" />
                                    <div className="absolute top-[28px] left-[15px] w-[50%] h-[2px] bg-brand-green z-0" />
                                    
                                    <div className="relative z-10 flex justify-between">
                                        <TrackingStep label="Placed" time="10 Apr, 14:20" completed />
                                        <TrackingStep label="Processing" time="11 Apr, 08:30" completed active />
                                        <TrackingStep label="Packing" time="Est. 12 Apr" />
                                        <TrackingStep label="Delivery" time="Est. 14 Apr" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ActionCard 
                                icon={Package} 
                                title="Recent Purchases" 
                                description="Re-order your favorite products with one click." 
                                href="/dashboard/orders"
                            />
                            <ActionCard 
                                icon={Heart} 
                                title="Saved for Later" 
                                description="You have 12 items in your wishlist." 
                                href="/dashboard/wishlist"
                            />
                        </section>
                    </div>

                    {/* Right: Quick Overview */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-foreground text-background rounded-2xl p-8">
                            <h3 className="text-[1.25rem] font-light mb-6 font-display">Fast Checkout</h3>
                            <p className="text-background/60 text-[13px] font-light mb-8 leading-relaxed">
                                You have 4 items in your cart ready for checkout.
                            </p>
                            <Link 
                                href="/checkout"
                                className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-brand-green text-white text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                            >
                                Finish Order
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="bg-background rounded-2xl border border-foreground/5 p-8">
                            <h3 className="text-[14px] uppercase tracking-widest font-bold opacity-40 mb-6 flex items-center gap-2">
                                <MapPin size={14} />
                                Primary Address
                            </h3>
                            <p className="text-[14px] font-medium mb-1">Sarah Jenkins</p>
                            <p className="text-[14px] opacity-60 font-light leading-relaxed">
                                123 Industrial Way<br />
                                Cape Town 8001<br />
                                South Africa
                            </p>
                            <button className="text-[11px] uppercase tracking-widest font-bold text-brand-green mt-6">Edit Address</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function TrackingStep({ label, time, completed = false, active = false }: { label: string, time: string, completed?: boolean, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                completed && !active ? "bg-brand-green border-brand-green text-white" : "",
                active ? "border-brand-green bg-background text-brand-green shadow-[0_0_15px_rgba(46,204,113,0.3)]" : "",
                !completed && !active ? "bg-background border-foreground/10 text-foreground/20" : ""
            )}>
                {completed && !active ? <Check size={16} strokeWidth={3} /> : <div className={cn("w-2 h-2 rounded-full", active ? "bg-brand-green animate-pulse" : "bg-current")} />}
            </div>
            <div className="text-center">
                <p className={cn("text-[12px] font-bold uppercase tracking-widest mb-1", active ? "text-brand-green" : "opacity-60")}>{label}</p>
                <p className="text-[10px] opacity-30 font-medium">{time}</p>
            </div>
        </div>
    );
}

function ActionCard({ icon: Icon, title, description, href }: { icon: any, title: string, description: string, href: string }) {
    return (
        <Link 
            href={href}
            className="group p-8 rounded-2xl border border-foreground/5 bg-background hover:border-brand-green/20 transition-all shadow-sm"
        >
            <div className="w-10 h-10 rounded-xl bg-foreground/3 flex items-center justify-center text-foreground/40 group-hover:text-brand-green group-hover:bg-brand-green/5 transition-all mb-6">
                <Icon size={20} />
            </div>
            <h4 className="text-[1.1rem] font-medium mb-2">{title}</h4>
            <p className="text-[13px] opacity-40 font-light mb-0 leading-relaxed">{description}</p>
        </Link>
    );
}

import { Check } from 'lucide-react';
