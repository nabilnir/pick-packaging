"use client";

import React, { useState, useEffect } from 'react';
import { 
    RotateCcw, 
    ChevronRight, 
    ChevronLeft, 
    Package, 
    MapPin, 
    Clock, 
    CheckCircle2, 
    Loader2,
    Minus,
    Plus,
    AlertCircle
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import { 
    ManifestItem, 
    ReturnReason, 
    ReturnRecord 
} from '@/types/rider/inventory';
import Image from 'next/image';

// ─── Constants ──────────────────────────────────────────────────────────────
const RETURN_REASONS: { value: ReturnReason; label: string; description: string }[] = [
    { 
        value: 'Undeliverable', 
        label: 'Undeliverable', 
        description: 'Company refused shipment or location was closed.' 
    },
    { 
        value: 'Damaged', 
        label: 'Damaged', 
        description: 'Items are damaged and must be returned to vendor.' 
    },
    { 
        value: 'Wrong item', 
        label: 'Wrong item', 
        description: 'SKU mismatch or wrong product provided.' 
    },
    { 
        value: 'Overstock', 
        label: 'Overstock', 
        description: 'Buyer cancelled or reduced order after loading.' 
    }
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface ReturnFlowProps {
    item: ManifestItem | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (itemId: string, record: ReturnRecord) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ReturnFlow({
    item,
    open,
    onClose,
    onConfirm
}: ReturnFlowProps) {
    const { success } = useToast();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // ─── Form State ───────────────────────────────────────────────────────────
    const [reason, setReason] = useState<ReturnReason | ''>('');
    const [qtyToReturn, setQtyToReturn] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    // Reset when open/item changes
    useEffect(() => {
        if (open && item) {
            setStep(1);
            setReason('');
            setQtyToReturn(item.remainingQty);
            setSubmitting(false);
        }
    }, [open, item]);

    if (!item) return null;

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        setSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));

        const record: ReturnRecord = {
            id: `ret-${Math.random().toString(36).substr(2, 9)}`,
            itemId: item.id,
            reason: reason as ReturnReason,
            qtyToReturn,
            vendorName: item.vendorName,
            vendorAddress: 'Epping Industria Site, Cape Town', // Mocking vendor address
            returnWindow: '17:00 today',
            reportedAt: new Date().toISOString()
        };

        onConfirm(item.id, record);
        success(`Return confirmed for ${item.sku}. Vendor added to route.`);
        setSubmitting(false);
        onClose();
    };

    const isStep1Valid = !!reason;
    const isStep2Valid = qtyToReturn > 0;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent 
                side="bottom" 
                className="rounded-t-3xl p-0 flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:max-w-xl sm:mx-auto sm:right-0 sm:left-auto sm:rounded-none sm:rounded-l-3xl"
            >
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-foreground/5 shrink-0">
                    <SheetTitle className="text-[18px] font-semibold flex items-center gap-2">
                        <RotateCcw size={18} className="text-red-500" />
                        Return Items
                    </SheetTitle>
                    
                    {/* Progress Dots */}
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map((s) => (
                            <div 
                                key={s}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    step === s ? "w-8 bg-red-500" : "w-1.5 bg-foreground/10",
                                    step > s ? "bg-red-200" : ""
                                )}
                            />
                        ))}
                    </div>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    
                    {/* Item Info Summary */}
                    <div className="bg-foreground/[0.03] p-4 rounded-2xl flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-foreground/5">
                            <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-foreground truncate">{item.productName}</p>
                            <p className="text-[11px] font-mono text-foreground/40 uppercase tracking-wider">
                                {item.sku} • {item.remainingQty} units remaining
                            </p>
                        </div>
                    </div>

                    {/* ── STEP 1: Reason Selection ────────────────────────────── */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-bold text-foreground">Why are these items being returned?</h3>
                                <p className="text-[12px] text-foreground/40">Select the primary reason for this return stop.</p>
                            </div>
                            <RadioGroup 
                                value={reason} 
                                onValueChange={(v) => setReason(v as ReturnReason)}
                                className="space-y-3"
                            >
                                {RETURN_REASONS.map((option) => (
                                    <Label 
                                        key={option.value}
                                        htmlFor={option.value}
                                        className={cn(
                                            "flex flex-col gap-1 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-foreground/[0.02]",
                                            reason === option.value ? "border-red-500 bg-red-50/30" : "border-foreground/5"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[14px] font-bold text-foreground">{option.label}</span>
                                            <RadioGroupItem value={option.value} id={option.value} className="text-red-500 border-foreground/20" />
                                        </div>
                                        <p className="text-[11px] text-foreground/40 leading-relaxed pr-6">{option.description}</p>
                                    </Label>
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    {/* ── STEP 2: Quantity Confirmation ───────────────────────── */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-bold text-foreground">How many units to return?</h3>
                                <p className="text-[12px] text-foreground/40">Confirm the physical count currently on your vehicle.</p>
                            </div>

                            <div className="p-8 border border-foreground/5 rounded-3xl bg-white flex flex-col items-center justify-center gap-6">
                                <div className="flex items-center gap-10">
                                    <button 
                                        onClick={() => setQtyToReturn(Math.max(1, qtyToReturn - 1))}
                                        className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/40 hover:bg-foreground/10 hover:text-foreground transition-all"
                                    >
                                        <Minus size={24} />
                                    </button>
                                    <div className="text-center">
                                        <span className="text-[48px] font-bold leading-none tabular-nums">{qtyToReturn}</span>
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/30 mt-1">Units</p>
                                    </div>
                                    <button 
                                        onClick={() => setQtyToReturn(Math.min(item.remainingQty, qtyToReturn + 1))}
                                        className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/40 hover:bg-foreground/10 hover:text-foreground transition-all"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-[11px] font-bold">
                                    <AlertCircle size={14} />
                                    Max {item.remainingQty} units available
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Return Destination ──────────────────────────── */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-[15px] font-bold text-foreground">Return Destination</h3>
                                <p className="text-[12px] text-foreground/40">These items must be returned to the origin vendor.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 border border-foreground/5 rounded-2xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <RotateCcw size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-foreground">{item.vendorName}</p>
                                            <p className="text-[11px] text-foreground/40">Origin Vendor</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 pt-4 border-t border-foreground/5">
                                        <MapPin size={16} className="text-foreground/30 mt-0.5 shrink-0" />
                                        <div className="space-y-1">
                                            <p className="text-[12px] font-medium text-foreground leading-snug">
                                                Epping Industria Site, Cape Town
                                            </p>
                                            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">Address</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-foreground/5">
                                        <Clock size={16} className="text-foreground/30 shrink-0" />
                                        <div>
                                            <p className="text-[12px] font-bold text-red-600">Before 17:00 today</p>
                                            <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-bold">Return Window</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <SheetFooter className="p-6 border-t border-foreground/5 bg-white shrink-0">
                    <div className="flex gap-3 w-full">
                        {step > 1 && (
                            <button 
                                onClick={() => setStep((s) => (s - 1) as any)}
                                className="px-6 py-4 border border-foreground/10 rounded-xl text-[12px] font-bold uppercase tracking-widest text-foreground/40 hover:bg-foreground/[0.02] transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}
                        {step < 3 ? (
                            <button 
                                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                                onClick={() => setStep((s) => (s + 1) as any)}
                                className="flex-1 py-4 bg-[#1c3a2a] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-40"
                            >
                                Next Step
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button 
                                disabled={submitting}
                                onClick={handleConfirm}
                                className="flex-1 py-4 bg-red-600 text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-40"
                            >
                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                                Confirm Return
                            </button>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
