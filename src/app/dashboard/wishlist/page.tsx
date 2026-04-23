"use client";

import React from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, Trash2, ArrowRight, LayoutDashboard, MapPin, User, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/contexts/wishlist-context';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function WishlistPage() {
    const { items, removeItem } = useWishlist();
    const { addToCart } = useCart();
    const { success } = useToast();

    const handleAddToCart = (product: any) => {
        addToCart(product);
        success(`Added ${product.name} to cart`);
    };

    return (
        <DashboardLayout items={USER_NAV} title="Saved Items">
            <div className="max-w-5xl">
                <div className="mb-12">
                    <h2 className="text-[2rem] font-light font-display">My Wishlist</h2>
                    <p className="text-foreground/40 font-light text-[14px]">Products you've saved for later.</p>
                </div>

                {items.length === 0 ? (
                    <div className="py-20 text-center rounded-2xl border-2 border-dashed border-foreground/5">
                        <Heart className="mx-auto opacity-10 mb-4" size={48} />
                        <p className="opacity-40 font-light italic text-[15px]">Your wishlist is currently empty.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 text-brand-green font-bold uppercase tracking-widest text-[11px] mt-6">
                            Start Shopping
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map((item: any) => (
                            <div key={item._id} className="group relative bg-background rounded-2xl border border-foreground/5 p-6 flex items-center gap-6 hover:border-brand-green/20 transition-all">
                                <div className="relative w-24 h-24 rounded-xl bg-foreground/5 overflow-hidden p-2 shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[16px] font-medium truncate mb-1">{item.name}</h4>
                                    <p className="text-[14px] font-bold mb-4">{item.currency || 'R'}{item.price.toFixed(2)}</p>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleAddToCart(item)}
                                            className="flex-1 py-3 bg-foreground text-background rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-green transition-all"
                                        >
                                            <ShoppingCart size={14} />
                                            Add to Cart
                                        </button>
                                        <button 
                                            onClick={() => removeItem(item._id)}
                                            className="p-3 border border-foreground/5 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all group/trash"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={16} className="opacity-40 group-hover/trash:opacity-100" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
