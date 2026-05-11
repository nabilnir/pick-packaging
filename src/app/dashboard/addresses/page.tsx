"use client";

import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, MapPin, User, LayoutDashboard, Plus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast-provider';
import { AddressCard } from '@/components/dashboard/addresses/AddressCard';
import { AddressForm } from '@/components/dashboard/addresses/AddressForm';
import { Address, AddressType } from '@/types/addresses';
import { MOCK_ADDRESSES } from '@/lib/addresses/mock-addresses';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function AddressesPage() {
    const { success } = useToast();
    
    // State
    const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add');
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // ─── Sheet Handlers ───────────────────────────────────────────────────────
    const openSheet = (mode: 'add' | 'edit', address?: Address) => {
        setSheetMode(mode);
        setEditingAddress(address || null);
        setSheetOpen(true);
    };

    const closeSheet = () => {
        setSheetOpen(false);
        setEditingAddress(null);
    };

    // ─── Action Handlers ──────────────────────────────────────────────────────
    const handleSave = (data: any) => {
        if (sheetMode === 'edit' && editingAddress) {
            setAddresses(prev => prev.map(a => 
                a._id === editingAddress._id ? { ...a, ...data } as Address : a
            ));
            success('Address updated');
        } else {
            const newAddress: Address = {
                ...data,
                _id: `addr-${Date.now()}`,
                orderCount: 0,
                country: 'South Africa',
            };
            
            if (newAddress.isPrimary) {
                setAddresses(prev => [
                    ...prev.map(a => ({ ...a, isPrimary: false })),
                    newAddress
                ]);
            } else {
                setAddresses(prev => [...prev, newAddress]);
            }
            success('Address saved');
        }
        closeSheet();
    };

    const handleDelete = (address: Address) => {
        setAddresses(prev => prev.filter(a => a._id !== address._id));
        success('Address deleted');
    };

    const handleSetPrimary = (id: string) => {
        setAddresses(prev => prev.map(a => ({
            ...a,
            isPrimary: a._id === id
        })));
        success('Primary address updated');
    };

    const handleSetType = (id: string, type: AddressType) => {
        setAddresses(prev => prev.map(a => 
            a._id === id ? { ...a, type } : a
        ));
        success(`Address type updated to ${type.toLowerCase()}`);
    };

    return (
        <DashboardLayout items={USER_NAV} title="Address Book">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-light">Addresses</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage your shipping and billing locations.
                        </p>
                    </div>
                    <Button 
                        onClick={() => openSheet('add')}
                        className="bg-[#1c3a2a] text-white hover:bg-[#152d20] uppercase tracking-widest text-xs rounded-full px-5 h-11"
                    >
                        + ADD NEW ADDRESS
                    </Button>
                </div>

                {addresses.length === 0 ? (
                    /* Existing Empty State */
                    <div className="py-20 text-center rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.01]">
                        <MapPin className="mx-auto opacity-20 mb-4" size={48} />
                        <p className="opacity-60 text-[15px] mb-6 font-light">You haven't saved any addresses yet.</p>
                        <Button 
                            variant="ghost"
                            onClick={() => openSheet('add')}
                            className="text-[#1c3a2a] font-bold uppercase tracking-widest text-[12px] hover:bg-transparent"
                        >
                            Add Your First Address
                        </Button>
                    </div>
                ) : (
                    /* Populated State */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                            <AddressCard 
                                key={addr._id}
                                address={addr}
                                onEdit={() => openSheet('edit', addr)}
                                onDelete={() => handleDelete(addr)}
                                onSetPrimary={() => handleSetPrimary(addr._id)}
                                onSetType={(type) => handleSetType(addr._id, type)}
                            />
                        ))}
                    </div>
                )}

                {/* Form Drawer */}
                <AddressForm 
                    mode={sheetMode} 
                    initialData={editingAddress}
                    open={sheetOpen} 
                    onClose={closeSheet} 
                    onSave={handleSave}
                />
            </div>
        </DashboardLayout>
    );
}
