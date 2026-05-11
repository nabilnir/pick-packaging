"use client";

import React from 'react';
import { MoreHorizontal, Edit2, Trash2, Check, MapPin } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Address, AddressType } from '@/types/addresses';

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (id: string) => void;
    onSetPrimary: (id: string) => void;
    onSetType: (id: string, type: AddressType) => void;
}

export function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetPrimary,
    onSetType,
}: AddressCardProps) {
    const isPrimary = address.isPrimary;

    const typeLabels: Record<AddressType, string> = {
        SHIPPING: 'Shipping',
        BILLING: 'Billing',
        BOTH: 'Shipping & Billing',
    };

    const typeBadgeStyles: Record<AddressType, string> = {
        SHIPPING: 'bg-teal-100 text-teal-800',
        BILLING: 'bg-blue-100 text-blue-800',
        BOTH: 'bg-[#1c3a2a] text-white',
    };

    return (
        <div
            className={cn(
                'bg-white border rounded-xl p-5 flex flex-col transition-all relative',
                isPrimary ? 'border-l-[3px] border-l-[#1c3a2a] bg-[#f0f5f1]' : 'border-border'
            )}
        >
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        typeBadgeStyles[address.type]
                    )}>
                        {typeLabels[address.type]}
                    </span>
                    {isPrimary && (
                        <span className="bg-[#1a1f1a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            Primary
                        </span>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1.5 hover:bg-foreground/5 rounded-full transition-colors">
                            <MoreHorizontal size={18} className="text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(address)} className="gap-2 cursor-pointer">
                            <Edit2 size={14} /> Edit address
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            disabled={isPrimary} 
                            onClick={() => onSetPrimary(address._id)}
                            className="gap-2 cursor-pointer"
                        >
                            <Check size={14} /> Set as primary
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onSetType(address._id, 'SHIPPING')} className="cursor-pointer">
                            Set as shipping
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSetType(address._id, 'BILLING')} className="cursor-pointer">
                            Set as billing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSetType(address._id, 'BOTH')} className="cursor-pointer">
                            Set as both
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-sm">
                                    <Trash2 size={14} /> Delete address
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {address.orderCount && address.orderCount > 0 ? (
                                            <>
                                                This address was used in <span className="font-bold">{address.orderCount}</span> past orders. 
                                                Deleting it will not affect those orders. Continue?
                                            </>
                                        ) : (
                                            "Are you sure you want to delete this address? This action cannot be undone."
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => onDelete(address._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-1">
                <p className="font-medium text-[#1a1f1a]">{address.fullName}</p>
                {address.companyName && (
                    <p className="text-[13px] text-muted-foreground">{address.companyName}</p>
                )}
                <div className="text-[14px] text-muted-foreground leading-relaxed pt-1">
                    <p>{address.streetLine1}</p>
                    {address.streetLine2 && <p>{address.streetLine2}</p>}
                    <p>{address.city}, {address.province}, {address.postalCode}</p>
                    <p>{address.country}</p>
                </div>
                {address.phone && (
                    <p className="text-[13px] text-muted-foreground pt-1 flex items-center gap-1.5">
                        <span className="opacity-50">Phone:</span> {address.phone}
                    </p>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex flex-col gap-2">
                {!isPrimary && (
                    <button
                        onClick={() => onSetPrimary(address._id)}
                        className="w-full py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1c3a2a] hover:bg-white border border-transparent transition-all"
                    >
                        Set as Primary
                    </button>
                )}
                <button
                    onClick={() => onEdit(address)}
                    className="w-full py-2.5 rounded-lg border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:border-[#1c3a2a] hover:text-[#1c3a2a] transition-all"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
