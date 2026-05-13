"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle2, AlertTriangle, Camera, Loader2,
    ChevronRight, ChevronLeft, Minus, Plus,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { PickupOrder, PickupLineItem } from '@/types/procurement';

// ─── Discrepancy reasons ──────────────────────────────────────────────────────
const DISCREPANCY_REASONS = [
    'Vendor short-shipped',
    'Damaged on loading',
    'Wrong SKU provided',
    'Count error',
] as const;
type DiscrepancyReason = typeof DISCREPANCY_REASONS[number];

// ─── Props ────────────────────────────────────────────────────────────────────
export interface CollectionComplete {
    actualQtys:   Record<string, number>;  // sku → actual qty
    reason?:      DiscrepancyReason;
    notes?:       string;
    photoDataUrl: string;
}

interface CollectionVerifySheetProps {
    order:      PickupOrder | null;
    open:       boolean;
    onClose:    () => void;
    onComplete: (orderId: string, data: CollectionComplete) => void;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDot({ active, done, n }: { active: boolean; done: boolean; n: number }) {
    return (
        <div className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all',
            done  ? 'bg-[#1c3a2a] border-[#1c3a2a] text-white' :
            active ? 'border-[#1c3a2a] text-[#1c3a2a] bg-white' :
            'border-foreground/15 text-foreground/30 bg-white',
        )}>
            {done ? <CheckCircle2 size={14} /> : n}
        </div>
    );
}

// ─── Qty stepper ──────────────────────────────────────────────────────────────
function QtyInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    return (
        <div className="flex items-center rounded-lg border border-border overflow-hidden h-9">
            <button
                type="button"
                onClick={() => onChange(Math.max(0, value - 1))}
                className="w-9 flex items-center justify-center text-muted-foreground hover:bg-gray-50 transition-colors disabled:opacity-30"
                disabled={value <= 0}
            >
                <Minus size={13} />
            </button>
            <span className="w-10 border-x border-border text-center text-[13px] font-semibold tabular-nums select-none">
                {value}
            </span>
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                className="w-9 flex items-center justify-center text-muted-foreground hover:bg-gray-50 transition-colors"
            >
                <Plus size={13} />
            </button>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CollectionVerifySheet({
    order,
    open,
    onClose,
    onComplete,
}: CollectionVerifySheetProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);

    // ── Form state ────────────────────────────────────────────────────────────
    const [step,          setStep]          = useState<1 | 2 | 3>(1);
    const [actualQtys,    setActualQtys]    = useState<Record<string, number>>({});
    const [reason,        setReason]        = useState<DiscrepancyReason | ''>('');
    const [notes,         setNotes]         = useState('');
    const [photoDataUrl,  setPhotoDataUrl]  = useState<string | null>(null);
    const [submitting,    setSubmitting]    = useState(false);

    // Initialise actual qtys from expected whenever order/open changes
    useEffect(() => {
        if (open && order) {
            const init: Record<string, number> = {};
            order.items.forEach(i => { init[i.sku] = i.qtyToCollect; });
            setActualQtys(init);
            setStep(1);
            setReason('');
            setNotes('');
            setPhotoDataUrl(null);
        }
    }, [open, order]);

    if (!order) return null;

    // ── Derived ───────────────────────────────────────────────────────────────
    const discrepancies = order.items.filter(i => {
        const actual = actualQtys[i.sku] ?? i.qtyToCollect;
        return actual !== i.qtyToCollect;
    });
    const hasDiscrepancy = discrepancies.length > 0;

    const totalExpected = order.items.reduce((s, i) => s + i.qtyToCollect, 0);
    const totalActual   = order.items.reduce((s, i) => s + (actualQtys[i.sku] ?? i.qtyToCollect), 0);

    // ── Photo capture ─────────────────────────────────────────────────────────
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    // ── Navigation ────────────────────────────────────────────────────────────
    const goNext = () => {
        if (step === 1) {
            setStep(hasDiscrepancy ? 2 : 3);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const goBack = () => {
        if (step === 3) setStep(hasDiscrepancy ? 2 : 1);
        else if (step === 2) setStep(1);
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleComplete = async () => {
        if (!photoDataUrl) return;
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 700));
        onComplete(order.id, {
            actualQtys,
            reason:      reason || undefined,
            notes:       notes  || undefined,
            photoDataUrl,
        });
        setSubmitting(false);
    };

    const step2Valid = !hasDiscrepancy || !!reason;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="bottom"
                className="rounded-t-2xl p-0 flex flex-col max-h-[90vh] sm:max-h-[85vh]"
            >
                {/* Header */}
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
                    <SheetTitle className="text-[17px] font-semibold">
                        Confirm collection — {order.poNumber}
                    </SheetTitle>

                    {/* Step indicators */}
                    <div className="flex items-center gap-2 mt-2">
                        <StepDot n={1} active={step === 1} done={step > 1} />
                        <div className={cn('flex-1 h-0.5 rounded-full transition-colors', step > 1 ? 'bg-[#1c3a2a]' : 'bg-foreground/10')} />
                        <StepDot n={2} active={step === 2} done={step > 2} />
                        <div className={cn('flex-1 h-0.5 rounded-full transition-colors', step > 2 ? 'bg-[#1c3a2a]' : 'bg-foreground/10')} />
                        <StepDot n={3} active={step === 3} done={false} />
                    </div>
                </SheetHeader>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

                    {/* ── STEP 1 — Item counts ─────────────────────────── */}
                    {step === 1 && (
                        <>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Verify quantities collected
                            </p>
                            <div className="space-y-3">
                                {order.items.map((item: PickupLineItem) => {
                                    const actual = actualQtys[item.sku] ?? item.qtyToCollect;
                                    const diff   = actual - item.qtyToCollect;
                                    return (
                                        <div
                                            key={item.sku}
                                            className={cn(
                                                'p-4 rounded-xl border transition-all',
                                                diff !== 0
                                                    ? 'border-amber-300 bg-amber-50'
                                                    : 'border-border bg-background',
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-mono text-[10px] text-muted-foreground/50 mb-0.5">
                                                        {item.sku}
                                                    </p>
                                                    <p className="text-[13px] font-medium leading-snug text-foreground">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                                        Expected: <span className="font-semibold">{item.qtyToCollect}</span>
                                                    </p>
                                                </div>
                                                <QtyInput
                                                    value={actual}
                                                    onChange={n => setActualQtys(prev => ({ ...prev, [item.sku]: n }))}
                                                />
                                            </div>

                                            {diff !== 0 && (
                                                <div className="flex items-center gap-1.5 mt-2.5">
                                                    <AlertTriangle size={12} className="text-amber-600 shrink-0" />
                                                    <p className="text-[11px] font-semibold text-amber-700">
                                                        {diff < 0
                                                            ? `Short by ${Math.abs(diff)} unit${Math.abs(diff) !== 1 ? 's' : ''}`
                                                            : `Extra ${diff} unit${diff !== 1 ? 's' : ''} found`
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {hasDiscrepancy && (
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                                    <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                                    <p className="text-[12px] font-semibold text-amber-800">
                                        {totalActual}/{totalExpected} units — discrepancy noted. Step 2 required.
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── STEP 2 — Discrepancy reason ──────────────────── */}
                    {step === 2 && (
                        <>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Discrepancy reason
                            </p>
                            <div className="space-y-2">
                                {DISCREPANCY_REASONS.map(r => (
                                    <label
                                        key={r}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all',
                                            reason === r
                                                ? 'border-[#1c3a2a] bg-[#f0f5f1]'
                                                : 'border-border hover:border-foreground/25',
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="discrepancy-reason"
                                            value={r}
                                            checked={reason === r}
                                            onChange={() => setReason(r)}
                                            className="accent-[#1c3a2a]"
                                        />
                                        <span className="text-[13px] font-medium">{r}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 block">
                                    Additional notes (optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Describe the discrepancy…"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-[13px] focus:border-[#1c3a2a] outline-none transition-all resize-none placeholder:text-muted-foreground/40"
                                />
                            </div>
                        </>
                    )}

                    {/* ── STEP 3 — Photo proof ─────────────────────────── */}
                    {step === 3 && (
                        <>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Photo proof of collection
                            </p>

                            {photoDataUrl ? (
                                <div className="space-y-3">
                                    {/* Thumbnail */}
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-gray-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={photoDataUrl}
                                            alt="Collection proof"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => photoInputRef.current?.click()}
                                        className="w-full py-2.5 rounded-xl border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:border-foreground/30 transition-all"
                                    >
                                        Retake photo
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => photoInputRef.current?.click()}
                                    className="w-full py-10 rounded-2xl border-2 border-dashed border-foreground/15 flex flex-col items-center gap-3 hover:border-[#1c3a2a]/40 hover:bg-[#f0f5f1] transition-all"
                                >
                                    <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center">
                                        <Camera size={26} className="text-foreground/30" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[13px] font-semibold text-foreground/60">Take photo</p>
                                        <p className="text-[11px] text-muted-foreground/50 mt-0.5">Opens camera on your device</p>
                                    </div>
                                </button>
                            )}

                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
                                <CheckCircle2 size={12} className="text-teal-500" />
                                Photo is saved as proof of collection
                            </div>

                            {/* Hidden file input — camera capture on mobile */}
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="sr-only"
                                onChange={handlePhotoChange}
                            />
                        </>
                    )}
                </div>

                {/* Footer */}
                <SheetFooter className="px-5 py-4 border-t border-border bg-background shrink-0">
                    <div className="flex gap-3 w-full">
                        {/* Back button */}
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex items-center gap-1 px-4 py-3 rounded-xl border border-border text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:border-foreground/30 transition-all"
                            >
                                <ChevronLeft size={14} /> Back
                            </button>
                        )}

                        {/* Next or Complete */}
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={goNext}
                                disabled={step === 2 && !step2Valid}
                                className="flex-1 py-3 rounded-xl bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleComplete}
                                disabled={!photoDataUrl || submitting}
                                className="flex-1 py-3 rounded-xl bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {submitting && <Loader2 size={13} className="animate-spin" />}
                                Complete Collection
                            </button>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
