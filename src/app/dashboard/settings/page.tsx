"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, MapPin, User, LayoutDashboard, Camera, Save, Shield, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <DashboardLayout items={USER_NAV} title="Account Settings">
            <div className="max-w-4xl">
                <div className="mb-12">
                    <h2 className="text-[2rem] font-light font-display">Settings</h2>
                    <p className="text-foreground/40 font-light text-[14px]">Manage your profile and account preferences.</p>
                </div>

                <div className="space-y-12">
                    {/* Profile Section */}
                    <section className="bg-background rounded-2xl border border-foreground/5 p-10">
                        <div className="flex items-center gap-8 mb-10 pb-10 border-b border-foreground/5">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-[2rem] font-bold overflow-hidden border-4 border-background">
                                    {user?.displayName?.[0] || 'R'}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-foreground text-background rounded-full hover:bg-brand-green transition-all shadow-lg">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div>
                                <h4 className="text-[1.25rem] font-medium leading-none mb-2">{user?.displayName || 'Ragnar Rickens'}</h4>
                                <p className="text-[14px] opacity-40 font-light">Last login: 2 hours ago</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Full Name</label>
                                <input 
                                    type="text" 
                                    defaultValue={user?.displayName || 'Ragnar Rickens'} 
                                    className="w-full px-5 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Email Address</label>
                                <input 
                                    type="email" 
                                    defaultValue={user?.email || 'ragnar@example.com'} 
                                    className="w-full px-5 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                />
                            </div>
                        </div>

                        <button className="mt-10 flex items-center gap-2 py-4 px-8 bg-foreground text-background rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all">
                            <Save size={16} />
                            Save Changes
                        </button>
                    </section>

                    {/* Preferences & Security */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-background rounded-2xl border border-foreground/5 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield size={20} className="text-brand-green" />
                                <h4 className="text-[16px] font-bold uppercase tracking-widest opacity-60">Security</h4>
                            </div>
                            <p className="text-[13px] opacity-40 font-light mb-6 leading-relaxed">Change your password and secure your account.</p>
                            <button className="w-full py-4 border border-foreground/10 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-all">
                                Update Password
                            </button>
                        </section>

                        <section className="bg-background rounded-2xl border border-foreground/5 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Bell size={20} className="text-brand-green" />
                                <h4 className="text-[16px] font-bold uppercase tracking-widest opacity-60">Notifications</h4>
                            </div>
                            <p className="text-[13px] opacity-40 font-light mb-6 leading-relaxed">Manage how you receive order updates and news.</p>
                            <button className="w-full py-4 border border-foreground/10 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-all">
                                Configure Alerts
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
