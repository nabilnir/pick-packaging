"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import {
    Package, Plus, Search,
    Edit, Trash2, LayoutDashboard,
    ShoppingBag, Users, BarChart3,
    Settings, Factory, Tag, Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ADMIN_NAV = [
    { label: "Overview",  href: "/admin",          icon: LayoutDashboard },
    { label: "Orders",    href: "/admin/orders",    icon: ShoppingBag     },
    { label: "Products",  href: "/admin/products",  icon: Package         },
    { label: "Customers", href: "/admin/customers", icon: Users           },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3       },
    { label: "Vendors",   href: "/admin/vendors",   icon: Factory         },
    { label: "Settings",  href: "/admin/settings",  icon: Settings        },
];

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading]   = useState(true);
    const [query, setQuery]       = useState("");

    useEffect(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then(data => {
                if (data.success) setProducts(data.data);
                setLoading(false);
            });
    }, []);

    const filtered = products.filter((p: any) =>
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase()) ||
        String(p.id)?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <DashboardLayout items={ADMIN_NAV} title="Administrator">

            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-foreground/[0.07]">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 mb-1">Admin Panel</p>
                    <h1 className="font-display text-[2.2rem] font-light text-foreground tracking-tight">Products</h1>
                    <p className="text-[14px] font-light text-foreground/50 mt-1">
                        Manage your global catalog, pricing, and stock levels.
                    </p>
                </div>
                <button className="shrink-0 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/80 transition-colors">
                    <Plus size={14} /> Add Product
                </button>
            </div>

            {/* ── Catalog Card ────────────────────────────────────────── */}
            <div className="bg-background rounded-2xl border border-foreground/[0.07] overflow-hidden">

                {/* Controls */}
                <div className="px-6 py-4 border-b border-foreground/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 px-4 py-2 bg-foreground/[0.04] rounded-full border border-foreground/[0.06] w-full md:w-80">
                        <Search size={14} className="text-foreground/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU, or category…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="bg-transparent text-[13px] font-light focus:outline-none w-full text-foreground placeholder:text-foreground/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 text-[11px] font-medium text-foreground/40 hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors uppercase tracking-[0.1em]">
                            <Tag size={13} /> Categories
                        </button>
                        <button className="flex items-center gap-2 text-[11px] font-medium text-foreground/40 hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors uppercase tracking-[0.1em]">
                            <Archive size={13} /> Out of Stock
                        </button>
                    </div>
                </div>

                {/* Product list */}
                <div className="divide-y divide-foreground/[0.05]">
                    {loading ? (
                        <div className="py-20 text-center text-[13px] font-light text-foreground/30 italic">
                            Loading inventory…
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center text-[13px] font-light text-foreground/30">
                            No products found
                        </div>
                    ) : filtered.map((product: any) => (
                        <div
                            key={product._id}
                            className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-foreground/[0.01] transition-colors"
                        >
                            {/* Product info */}
                            <div className="flex items-center gap-6 flex-1 min-w-0">
                                <div className="relative w-20 h-20 rounded-xl bg-foreground/[0.04] overflow-hidden border border-foreground/[0.06] shrink-0">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
                                            {product.category}
                                        </span>
                                        <span className="text-[10px] font-light text-foreground/25 font-mono">
                                            #{product.id}
                                        </span>
                                    </div>
                                    <h4 className="font-display text-[1.1rem] font-light text-foreground truncate tracking-tight">
                                        {product.name}
                                    </h4>
                                    <p className="text-[13px] font-medium text-foreground/70 mt-0.5">
                                        R{product.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Right section */}
                            <div className="flex items-center gap-8 shrink-0">
                                <div className="hidden lg:block text-right">
                                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/30 mb-1">Status</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[12px] font-medium text-foreground/60">In Stock</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2.5 rounded-xl bg-foreground/[0.04] hover:bg-foreground/[0.08] border border-foreground/[0.06] text-foreground/40 hover:text-foreground transition-all">
                                        <Edit size={15} />
                                    </button>
                                    <button className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 text-red-400 hover:text-red-500 transition-all">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                {!loading && (
                    <div className="px-8 py-3 border-t border-foreground/[0.06]">
                        <span className="text-[11px] font-light text-foreground/30">
                            {filtered.length} of {products.length} products
                        </span>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
