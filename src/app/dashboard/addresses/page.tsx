"use client";

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, MapPin, User, LayoutDashboard, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast-provider';
import { AddressCard } from '@/components/dashboard/addresses/AddressCard';
import { Address, AddressType } from '@/types/addresses';
import { MOCK_ADDRESSES } from '@/lib/addresses/mock-addresses';
import { cn } from '@/lib/utils';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

export default function AddressesPage() {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    
    // State
    const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
    const [loading, setLoading] = useState(false); // Set to false since using mock data for now
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Address>>({
        type: 'SHIPPING',
        isPrimary: false,
        country: 'South Africa',
    });

    // Handlers
    const openAddModal = () => {
        setFormData({
            fullName: '',
            companyName: '',
            streetLine1: '',
            streetLine2: '',
            city: '',
            province: '',
            postalCode: '',
            phone: '',
            type: 'SHIPPING',
            isPrimary: false,
            country: 'South Africa',
            userEmail: user?.email || '',
        });
        setEditingAddress(null);
        setIsAddModalOpen(true);
    };

    const handleEdit = (address: Address) => {
        setFormData(address);
        setEditingAddress(address);
        setIsAddModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setAddresses(prev => prev.filter(a => a._id !== id));
        success('Address deleted successfully');
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
        success(`Address set as ${type.toLowerCase()}`);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        if (editingAddress) {
            setAddresses(prev => prev.map(a => 
                a._id === editingAddress._id ? { ...a, ...formData } as Address : a
            ));
            success('Address updated');
        } else {
            const newAddress: Address = {
                ...formData as Address,
                _id: `addr-${Date.now()}`,
                orderCount: 0,
            };
            
            if (newAddress.isPrimary) {
                setAddresses(prev => [
                    ...prev.map(a => ({ ...a, isPrimary: false })),
                    newAddress
                ]);
            } else {
                setAddresses(prev => [...prev, newAddress]);
            }
            success('Address added');
        }

        setSaving(false);
        setIsAddModalOpen(false);
    };

    return (
        <DashboardLayout items={USER_NAV} title="Address Book">
            <div className="max-w-5xl p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-[2rem] font-light text-[#1a1f1a]">Addresses</h1>
                        <p className="text-muted-foreground text-[14px] mt-1">Manage your shipping and billing locations.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 py-3.5 px-7 bg-[#1a1f1a] text-white rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-[#1c3a2a] transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        Add New Address
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-40">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p className="italic text-[14px]">Loading addresses...</p>
                    </div>
                ) : addresses.length === 0 ? (
                    /* Empty State (Preserved) */
                    <div className="py-20 text-center rounded-2xl border border-dashed border-foreground/10 bg-foreground/[0.01]">
                        <MapPin className="mx-auto opacity-20 mb-4" size={48} />
                        <p className="opacity-60 text-[15px] mb-6 font-light">You haven't saved any addresses yet.</p>
                        <button 
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 text-[#1c3a2a] font-bold uppercase tracking-widest text-[12px] hover:opacity-80 transition-opacity"
                        >
                            Add Your First Address
                        </button>
                    </div>
                ) : (
                    /* Populated State */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {addresses.map((address) => (
                            <AddressCard 
                                key={address._id}
                                address={address}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetPrimary={handleSetPrimary}
                                onSetType={handleSetType}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal - Could be a separate component for cleaner code, but kept here for now as requested in flow */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    <div className="relative bg-white border border-border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                            <h3 className="text-[1.25rem] font-medium">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all"
                            >
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form className="space-y-5" id="address-form" onSubmit={handleSave}>
                                {/* Full Name & Company */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="John Doe"
                                            value={formData.fullName || ''}
                                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Company Name (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Acme Corp"
                                            value={formData.companyName || ''}
                                            onChange={e => setFormData({...formData, companyName: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Phone Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="+27 (0) 12 345 6789"
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                    />
                                </div>

                                {/* Address Lines */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Street Address</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="123 Main St"
                                            value={formData.streetLine1 || ''}
                                            onChange={e => setFormData({...formData, streetLine1: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Street Address Line 2 (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Apartment, suite, unit, etc."
                                            value={formData.streetLine2 || ''}
                                            onChange={e => setFormData({...formData, streetLine2: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                </div>

                                {/* City, Province, Postal */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">City</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="City"
                                            value={formData.city || ''}
                                            onChange={e => setFormData({...formData, city: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Province</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Province"
                                            value={formData.province || ''}
                                            onChange={e => setFormData({...formData, province: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Postal Code</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="Postal Code"
                                            value={formData.postalCode || ''}
                                            onChange={e => setFormData({...formData, postalCode: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-border focus:border-[#1c3a2a] transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                </div>

                                {/* Type Selection */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Address Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['SHIPPING', 'BILLING', 'BOTH'] as AddressType[]).map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, type})}
                                                className={cn(
                                                    "py-2 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-all",
                                                    formData.type === type 
                                                        ? "bg-[#1c3a2a] text-white border-[#1c3a2a]" 
                                                        : "bg-white text-muted-foreground border-border hover:border-muted-foreground"
                                                )}
                                            >
                                                {type === 'BOTH' ? 'Both' : type.toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Primary Checkbox */}
                                <label className="flex items-center gap-3 pt-2 cursor-pointer group w-fit">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isPrimary || false}
                                        onChange={e => setFormData({...formData, isPrimary: e.target.checked})}
                                        className="w-4 h-4 rounded border-border text-[#1c3a2a] focus:ring-0 cursor-pointer" 
                                    />
                                    <span className="text-[13px] font-medium group-hover:text-[#1c3a2a] transition-colors">Set as primary shipping address</span>
                                </label>
                            </form>
                        </div>

                        <div className="p-6 border-t border-border bg-gray-50 flex justify-end gap-3 shrink-0">
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                disabled={saving}
                                className="px-7 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all text-muted-foreground disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                form="address-form"
                                type="submit"
                                className="flex items-center gap-2 px-7 py-3 bg-[#1a1f1a] text-white rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-[#1c3a2a] transition-all disabled:opacity-50 shadow-sm"
                                disabled={saving}
                            >
                                {saving ? <Loader2 className="animate-spin" size={14} /> : null}
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
