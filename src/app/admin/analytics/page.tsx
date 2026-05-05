"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    LayoutDashboard, ShoppingBag, Package, Users,
    BarChart3, Settings, Factory, Calendar as CalendarIcon, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';

// Data imports
import {
    mockKpi, mockRevenue, mockOrderAnalytics,
    mockSegments, mockTopCustomers, mockTopSkus,
    mockSectorData, mockVendors, mockFunnelStages
} from '@/lib/analytics/mock-data';

// Component imports
import KpiStrip from '@/components/analytics/KpiStrip';
import RevenueChart from '@/components/analytics/RevenueChart';
import OrderChart from '@/components/analytics/OrderChart';
import CustomerSegments from '@/components/analytics/CustomerSegments';
import ProductPerformance from '@/components/analytics/ProductPerformance';
import VendorHealth from '@/components/analytics/VendorHealth';
import ProcurementFunnel from '@/components/analytics/ProcurementFunnel';
import { DateRange } from '@/types/analytics';

const ADMIN_NAV = [
    { label: "Overview",  href: "/admin",          icon: LayoutDashboard },
    { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag     },
    { label: "Products",  href: "/admin/products",  icon: Package         },
    { label: "Customers", href: "/admin/customers", icon: Users           },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3       },
    { label: "Vendors",   href: "/admin/vendors",   icon: Factory         },
    { label: "Settings",  href: "/admin/settings",  icon: Settings        },
];

type Preset = '7d' | '30d' | '90d' | 'custom';

export default function AnalyticsDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [preset, setPreset] = useState<Preset>('30d');
    const [dateRange, setDateRange] = useState<DateRange>({
        from: subDays(new Date(), 30),
        to: new Date()
    });
    const [granularity, setGranularity] = useState<'daily'|'monthly'>('daily');

    // Simulate network delay on mount or date range change
    useEffect(() => {
        setIsLoading(true);
        const t = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(t);
    }, [dateRange]);

    const handlePresetChange = (p: Preset) => {
        setPreset(p);
        const to = new Date();
        if (p === '7d') setDateRange({ from: subDays(to, 7), to });
        if (p === '30d') setDateRange({ from: subDays(to, 30), to });
        if (p === '90d') setDateRange({ from: subDays(to, 90), to });
    };

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">
            
            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">Admin Panel</p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">Analytics</h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1">
                        Comprehensive insights into revenue, orders, products, and supply chain.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    {/* Date Presets */}
                    <div className="flex items-center bg-foreground/[0.04] p-1 rounded-xl border border-foreground/[0.06]">
                        {(['7d', '30d', '90d'] as Preset[]).map(p => (
                            <button
                                key={p}
                                onClick={() => handlePresetChange(p)}
                                className={cn(
                                    "text-[11px] font-medium uppercase tracking-[0.1em] px-4 py-2 rounded-lg transition-all",
                                    preset === p 
                                        ? "bg-foreground text-background shadow-sm" 
                                        : "text-foreground/50 hover:text-foreground"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    {/* Custom Date Range Display (Mocked Picker Trigger) */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-background border border-foreground/[0.1] rounded-xl text-[12px] font-medium text-foreground/70 hover:text-foreground transition-colors">
                        <CalendarIcon size={14} className="text-foreground/40" />
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </button>

                    {/* Global Export */}
                    <button className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors">
                        <Download size={14} /> Export All
                    </button>
                </div>
            </div>

            {/* ── Dashboard Content ───────────────────────────────────── */}
            <div className="space-y-6">
                <KpiStrip data={mockKpi} isLoading={isLoading} />
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <RevenueChart 
                        data={mockRevenue} 
                        isLoading={isLoading} 
                        granularity={granularity}
                        onGranularityChange={setGranularity}
                    />
                    <OrderChart data={mockOrderAnalytics} isLoading={isLoading} />
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <CustomerSegments 
                        segmentData={mockSegments} 
                        topCustomers={mockTopCustomers} 
                        isLoading={isLoading} 
                    />
                    <ProductPerformance 
                        topSkus={mockTopSkus} 
                        sectorData={mockSectorData} 
                        isLoading={isLoading} 
                    />
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <VendorHealth vendors={mockVendors} isLoading={isLoading} />
                    <ProcurementFunnel stages={mockFunnelStages} isLoading={isLoading} />
                </div>
            </div>
            
        </DashboardLayout>
    );
}
