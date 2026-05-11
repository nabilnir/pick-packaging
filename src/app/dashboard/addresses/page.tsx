"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, MapPin, User, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';
import { Button } from '@/components/ui/button';
import { AddressCard } from '@/components/dashboard/addresses/AddressCard';
import { AddressForm } from '@/components/dashboard/addresses/AddressForm';
import type { Address, AddressType, AddressPayload } from '@/types/addresses';
import { MOCK_ADDRESSES } from '@/lib/addresses/mock-addresses';

// ─── Nav ─────────────────────────────────────────────────────────────────────
const USER_NAV = [
    { label: 'Overview',   href: '/dashboard',           icon: LayoutDashboard },
    { label: 'My Orders',  href: '/dashboard/orders',    icon: ShoppingBag },
    { label: 'Wishlist',   href: '/dashboard/wishlist',  icon: Heart },
    { label: 'Addresses',  href: '/dashboard/addresses', icon: MapPin },
    { label: 'Settings',   href: '/dashboard/settings',  icon: User },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AddressesPage() {
    const { success } = useToast();
    const [addresses, setAddresses]         = useState<Address[]>(MOCK_ADDRESSES);
    const [sheetOpen, setSheetOpen]         = useState(false);
    const [sheetMode, setSheetMode]         = useState<'add' | 'edit'>('add');
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // ── Sheet helpers ──────────────────────────────────────────────────────────
    const openSheet = (mode: 'add' | 'edit', address?: Address) => {
        setSheetMode(mode);
        setEditingAddress(address ?? null);
        setSheetOpen(true);
    };
    const closeSheet = () => {
        setSheetOpen(false);
        setEditingAddress(null);
    };

    // ── Save (add or edit) ─────────────────────────────────────────────────────
    const handleSave = (payload: AddressPayload) => {
        if (sheetMode === 'edit' && editingAddress) {
            setAddresses(prev =>
                prev.map(a => a.id === editingAddress.id ? { ...a, ...payload } : a)
            );
            success('Address updated');
        } else {
            const created: Address = {
                ...payload,
                id: `addr-${Date.now()}`,
                usedInOrderCount: 0,
            };
            if (created.isPrimary) {
                setAddresses(prev => [
                    ...prev.map(a => ({ ...a, isPrimary: false })),
                    created,
                ]);
            } else {
                setAddresses(prev => [...prev, created]);
            }
            success('Address saved');
        }
        closeSheet();
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = (address: Address) => {
        setAddresses(prev => prev.filter(a => a.id !== address.id));
        success('Address deleted');
    };

    // ── Set primary ────────────────────────────────────────────────────────────
    const handleSetPrimary = (id: string) => {
        setAddresses(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));
        success('Primary address updated');
    };

    // ── Set type ───────────────────────────────────────────────────────────────
    const handleSetType = (id: string, type: AddressType) => {
        setAddresses(prev => prev.map(a => a.id === id ? { ...a, type } : a));
        success(`Address set as ${type}`);
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
                        + Add new address
                    </Button>
                </div>

                {addresses.length === 0 ? (
                    /* Empty State (preserved) */
                    <div className="py-20 text-center rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.01]">
                        <MapPin className="mx-auto opacity-20 mb-4" size={48} />
                        <p className="text-muted-foreground text-[15px] mb-6 font-light">
                            You haven't saved any addresses yet.
                        </p>
                        <Button
                            variant="ghost"
                            onClick={() => openSheet('add')}
                            className="text-[#1c3a2a] font-bold uppercase tracking-widest text-xs hover:bg-transparent"
                        >
                            Add your first address
                        </Button>
                    </div>
                ) : (
                    /* Populated grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                            <AddressCard
                                key={addr.id}
                                address={addr}
                                onEdit={() => openSheet('edit', addr)}
                                onDelete={() => handleDelete(addr)}
                                onSetPrimary={() => handleSetPrimary(addr.id)}
                                onSetType={(type) => handleSetType(addr.id, type)}
                            />
                        ))}
                    </div>
                )}

                {/* Sheet drawer */}
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
