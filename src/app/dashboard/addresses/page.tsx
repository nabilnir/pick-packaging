"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, MapPin, User, LayoutDashboard, Plus, Edit3, Trash2 } from 'lucide-react';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function AddressesPage() {
    return (
        <DashboardLayout items={USER_NAV} title="Address Book">
            <div className="max-w-5xl">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-[2rem] font-light font-display">Addresses</h2>
                        <p className="text-foreground/40 font-light text-[14px]">Manage your shipping and billing locations.</p>
                    </div>
                    <button className="flex items-center gap-2 py-3 px-6 bg-foreground text-background rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all">
                        <Plus size={16} />
                        Add New Address
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primary Address */}
                    <div className="bg-background rounded-2xl border border-brand-green/30 p-8 relative">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all opacity-40 hover:opacity-100"><Edit3 size={16} /></button>
                            <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-40 hover:opacity-100"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2 text-brand-green text-[11px] font-bold uppercase tracking-widest mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                            Primary Shipping
                        </div>
                        <h4 className="text-[1.25rem] font-medium mb-1">Office Location</h4>
                        <p className="text-[15px] font-medium text-foreground mb-1">Ragnar Rickens</p>
                        <p className="text-[14px] opacity-40 font-light leading-relaxed">
                            123 Industrial Way<br />
                            Woodstock, Cape Town 8001<br />
                            South Africa
                        </p>
                    </div>

                    {/* Secondary Address */}
                    <div className="bg-background rounded-2xl border border-foreground/5 p-8 relative hover:border-foreground/10 transition-all">
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button className="p-2 hover:bg-foreground/5 rounded-lg transition-all opacity-40 hover:opacity-100"><Edit3 size={16} /></button>
                            <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-40 hover:opacity-100"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/20 text-[11px] font-bold uppercase tracking-widest mb-6">
                            Residential
                        </div>
                        <h4 className="text-[1.25rem] font-medium mb-1">Home</h4>
                        <p className="text-[15px] font-medium text-foreground mb-1">Ragnar Rickens</p>
                        <p className="text-[14px] opacity-40 font-light leading-relaxed">
                            45 Ocean View Drive<br />
                            Camps Bay, Cape Town 8005<br />
                            South Africa
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
