"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { ShoppingBag, Heart, MapPin, User, LayoutDashboard, Plus, Edit3, Trash2, X } from 'lucide-react';

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Settings", href: "/dashboard/settings", icon: User },
];

interface Address {
    id: string;
    locationName: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    isPrimary: boolean;
}

import Swal from 'sweetalert2';

export default function AddressesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            locationName: 'Office Location',
            fullName: 'Ragnar Rickens',
            phone: '',
            street: '123 Industrial Way',
            city: 'Woodstock, Cape Town',
            postalCode: '8001',
            isPrimary: true,
        },
        {
            id: '2',
            locationName: 'Home',
            fullName: 'Ragnar Rickens',
            phone: '',
            street: '45 Ocean View Drive',
            city: 'Camps Bay, Cape Town',
            postalCode: '8005',
            isPrimary: false,
        }
    ]);
    
    const [formData, setFormData] = useState<Partial<Address>>({
        isPrimary: false
    });

    const openAddModal = () => {
        setFormData({ isPrimary: false });
        setEditingId(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (address: Address) => {
        setFormData(address);
        setEditingId(address.id);
        setIsAddModalOpen(true);
    };

    const handleSave = () => {
        const addressData: Address = {
            id: editingId || Math.random().toString(36).substring(2, 9),
            locationName: formData.locationName || 'New Location',
            fullName: formData.fullName || '',
            phone: formData.phone || '',
            street: formData.street || '',
            city: formData.city || '',
            postalCode: formData.postalCode || '',
            isPrimary: formData.isPrimary || false,
        };

        if (addressData.isPrimary) {
            if (editingId) {
                setAddresses(prev => prev.map(a => a.id === editingId ? addressData : { ...a, isPrimary: false }));
            } else {
                setAddresses(prev => prev.map(a => ({ ...a, isPrimary: false })).concat(addressData));
            }
        } else {
            if (editingId) {
                setAddresses(prev => prev.map(a => a.id === editingId ? addressData : a));
            } else {
                setAddresses(prev => [...prev, addressData]);
            }
        }
        
        setIsAddModalOpen(false);
        setEditingId(null);
        setFormData({ isPrimary: false });
    };

    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Delete Address?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#E74C3C',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setAddresses(prev => prev.filter(a => a.id !== id));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your address has been removed.',
                    icon: 'success',
                    confirmButtonColor: '#2ECC71'
                });
            }
        });
    };

    return (
        <DashboardLayout items={USER_NAV} title="Address Book">
            <div className="max-w-5xl">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-[2rem] font-light font-display">Addresses</h2>
                        <p className="text-foreground/40 font-light text-[14px]">Manage your shipping and billing locations.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 py-3 px-6 bg-foreground text-background rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all"
                    >
                        <Plus size={16} />
                        Add New Address
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {addresses.map((address) => (
                        <div key={address.id} className={`bg-background rounded-2xl border p-8 relative transition-all ${address.isPrimary ? 'border-brand-green/30' : 'border-foreground/5 hover:border-foreground/10'}`}>
                            <div className="absolute top-6 right-6 flex gap-2">
                                <button onClick={() => openEditModal(address)} className="p-2 hover:bg-foreground/5 rounded-lg transition-all opacity-40 hover:opacity-100"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(address.id)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-40 hover:opacity-100"><Trash2 size={16} /></button>
                            </div>
                            <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-6 ${address.isPrimary ? 'text-brand-green' : 'text-foreground/20'}`}>
                                {address.isPrimary && <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
                                {address.isPrimary ? 'Primary Shipping' : address.locationName || 'Residential'}
                            </div>
                            <h4 className="text-[1.25rem] font-medium mb-1">{address.locationName}</h4>
                            <p className="text-[15px] font-medium text-foreground mb-1">{address.fullName}</p>
                            <p className="text-[14px] opacity-40 font-light leading-relaxed">
                                {address.street}<br />
                                {address.city} {address.postalCode}<br />
                                {address.phone && <>{address.phone}<br/></>}
                                South Africa
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Address Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    <div className="relative bg-background border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-foreground/5 shrink-0">
                            <h3 className="text-[1.25rem] font-medium">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 rounded-full hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Location Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Home, Office"
                                        value={formData.locationName || ''}
                                        onChange={e => setFormData({...formData, locationName: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/10 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe"
                                        value={formData.fullName || ''}
                                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/10 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Phone Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="+27 (0) 12 345 6789"
                                        value={formData.phone || ''}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/10 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Street Address</label>
                                    <input 
                                        type="text" 
                                        placeholder="123 Street Name"
                                        value={formData.street || ''}
                                        onChange={e => setFormData({...formData, street: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/10 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">City</label>
                                        <input 
                                            type="text" 
                                            placeholder="City"
                                            value={formData.city || ''}
                                            onChange={e => setFormData({...formData, city: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/10 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Postal Code</label>
                                        <input 
                                            type="text" 
                                            placeholder="Postal Code"
                                            value={formData.postalCode || ''}
                                            onChange={e => setFormData({...formData, postalCode: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/10 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isPrimary || false}
                                        onChange={e => setFormData({...formData, isPrimary: e.target.checked})}
                                        className="w-4 h-4 rounded border-foreground/20 text-brand-green focus:ring-0 cursor-pointer" 
                                    />
                                    <span className="text-[13px] font-medium group-hover:text-brand-green transition-colors">Set as primary shipping address</span>
                                </label>
                            </form>
                        </div>

                        <div className="p-6 border-t border-foreground/5 bg-foreground/[0.02] flex justify-end gap-3 shrink-0">
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-foreground/5 transition-all text-foreground/60"
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-6 py-3 bg-foreground text-background rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all"
                                onClick={handleSave}
                            >
                                {editingId ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
