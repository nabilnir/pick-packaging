"use client";

import React from 'react';
import { MoreHorizontal, Edit2, Trash2, Check } from 'lucide-react';
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
import type { Address, AddressType } from '@/types/addresses';

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (address: Address) => void;
    onSetPrimary: (id: string) => void;
    onSetType: (id: string, type: AddressType) => void;
}

// ─── Badge config per address type ───────────────────────────────────────────
const TYPE_LABEL: Record<AddressType, string> = {
    shipping: 'Shipping',
    billing:  'Billing',
    both:     'Shipping & Billing',
};

const TYPE_BADGE: Record<AddressType, string> = {
    shipping: 'bg-teal-100 text-teal-800',
    billing:  'bg-blue-100 text-blue-800',
    both:     'bg-[#1c3a2a] text-white',
};

export function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetPrimary,
    onSetType,
}: AddressCardProps) {
    const { isPrimary, type, usedInOrderCount } = address;

    return (
        <div className={cn(
            'bg-white border border-border rounded-xl p-5 flex flex-col transition-all',
            isPrimary
                ? 'border-l-[3px] border-l-[#1c3a2a] bg-[#f0f5f1]'
                : 'hover:shadow-sm',
        )}>
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Type badge */}
                    <span className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        TYPE_BADGE[type],
                    )}>
                        {TYPE_LABEL[type]}
                    </span>

                    {/* Primary badge */}
                    {isPrimary && (
                        <span className="bg-[#1a1f1a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            Primary
                        </span>
                    )}
                </div>

                {/* More menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            id={`addr-menu-${address.id}`}
                            className="p-1.5 rounded-full hover:bg-foreground/5 transition-colors"
                            aria-label="Address options"
                        >
                            <MoreHorizontal size={17} className="text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-xs uppercase tracking-widest font-semibold"
                            onClick={() => onEdit(address)}
                        >
                            <Edit2 size={13} /> Edit address
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={isPrimary}
                            className="gap-2 cursor-pointer text-xs uppercase tracking-widest font-semibold"
                            onClick={() => onSetPrimary(address.id)}
                        >
                            <Check size={13} /> Set as primary
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-xs uppercase tracking-widest font-semibold"
                            onClick={() => onSetType(address.id, 'shipping')}
                        >
                            Set as shipping
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-xs uppercase tracking-widest font-semibold"
                            onClick={() => onSetType(address.id, 'billing')}
                        >
                            Set as billing
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer text-xs uppercase tracking-widest font-semibold"
                            onClick={() => onSetType(address.id, 'both')}
                        >
                            Set as both
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {/* Delete — wrapped in AlertDialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div
                                    role="menuitem"
                                    className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-widest text-red-600 hover:bg-red-50 cursor-pointer rounded-sm"
                                >
                                    <Trash2 size={13} /> Delete address
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this address?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {usedInOrderCount > 0 ? (
                                            <>
                                                This address was used in{' '}
                                                <span className="font-semibold text-foreground">
                                                    {usedInOrderCount} past {usedInOrderCount === 1 ? 'order' : 'orders'}
                                                </span>
                                                . Deleting it will not affect those orders. Continue?
                                            </>
                                        ) : (
                                            'Are you sure? This action cannot be undone.'
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDelete(address)}
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

            {/* ── Body ───────────────────────────────────────────────────── */}
            <div className="flex-1 space-y-0.5 text-sm">
                <p className="font-medium text-[#1a1f1a]">{address.fullName}</p>
                {address.company && (
                    <p className="text-muted-foreground text-[13px]">{address.company}</p>
                )}
                <div className="text-muted-foreground leading-relaxed pt-1 text-[13px]">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}, {address.province} {address.postalCode}</p>
                    <p>{address.country}</p>
                </div>
                {address.phone && (
                    <p className="text-[13px] text-muted-foreground pt-1">
                        <span className="opacity-50">Tel:</span> {address.phone}
                    </p>
                )}
            </div>

            {/* ── Footer buttons ─────────────────────────────────────────── */}
            <div className="mt-5 flex flex-col gap-2">
                {!isPrimary && (
                    <button
                        onClick={() => onSetPrimary(address.id)}
                        className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-[#1c3a2a] hover:bg-white border border-transparent hover:border-border transition-all"
                    >
                        Set as primary
                    </button>
                )}
                <button
                    onClick={() => onEdit(address)}
                    className="w-full py-2.5 rounded-lg border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground hover:border-[#1c3a2a] hover:text-[#1c3a2a] transition-all"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
