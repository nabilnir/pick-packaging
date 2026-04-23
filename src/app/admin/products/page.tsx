"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { 
    Package, 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    LayoutDashboard, 
    ShoppingBag, 
    Users, 
    BarChart3, 
    Settings,
    Tag,
    Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ADMIN_NAV = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) setProducts(data.data);
                setLoading(false);
            });
    }, []);

    return (
        <DashboardLayout items={ADMIN_NAV} title="Inventory Manager">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-[2rem] font-light font-display">Products</h2>
                        <p className="text-foreground/40 font-light text-[14px]">Manage your global catalog and stock levels.</p>
                    </div>
                    <button className="flex items-center gap-2 py-4 px-6 bg-foreground text-background rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all shadow-lg">
                        <Plus size={18} />
                        Add New Product
                    </button>
                </div>

                <div className="bg-background rounded-2xl border border-foreground/5 overflow-hidden">
                    {/* Catalog Controls */}
                    <div className="p-6 border-b border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-foreground/3 rounded-xl border border-foreground/5 w-full md:w-96">
                            <Search size={16} className="opacity-30" />
                            <input type="text" placeholder="Search by name, SKU, or category..." className="bg-transparent text-[13px] focus:outline-none w-full" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-foreground/5 rounded-xl text-[12px] hover:bg-foreground/5 transition-all">
                                <Tag size={16} />
                                Categories
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-foreground/5 rounded-xl text-[12px] hover:bg-foreground/5 transition-all">
                                <Archive size={16} />
                                Out of Stock
                            </button>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="grid grid-cols-1 divide-y divide-foreground/5">
                        {loading ? (
                            <div className="py-20 text-center opacity-20 italic">Loading inventory...</div>
                        ) : products.map((product: any) => (
                            <div key={product._id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:bg-foreground/[0.01] transition-colors">
                                <div className="flex items-center gap-6 flex-1 min-w-0">
                                    <div className="relative w-24 h-24 rounded-xl bg-foreground/5 overflow-hidden p-2 border border-foreground/5 shrink-0">
                                        <Image src={product.image} alt={product.name} fill className="object-contain p-2" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green px-2 py-0.5 bg-brand-green/10 rounded-sm">
                                                {product.category}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                                                ID: {product.id}
                                            </span>
                                        </div>
                                        <h4 className="text-[1.25rem] font-light truncate mb-2">{product.name}</h4>
                                        <p className="text-[14px] font-bold">R{product.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-[12px] uppercase tracking-widest font-bold opacity-30 mb-1">Status</p>
                                        <div className="flex items-center gap-2 justify-end">
                                            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                                            <span className="text-[13px] font-medium">In Stock</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button className="p-3 bg-foreground/3 rounded-xl hover:bg-foreground/5 transition-all text-foreground/40 hover:text-foreground border border-foreground/5">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all text-red-400 hover:text-red-500 border border-red-100 flex items-center justify-center">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
