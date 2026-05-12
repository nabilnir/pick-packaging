"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2, AlertCircle, Clock, Truck,
    MapPin, MessageCircle, ChevronDown, ChevronUp,
    ExternalLink, BadgeCheck, Loader2, XCircle, Package,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import type { PickupOrder, PickupStatus, MissReason } from '@/types/procurement';
import { MISS_REASONS } from '@/types/procurement';

// ─── Props ────────────────────────────────────────────────────────────────────
export interface PickupCardProps {
    order:      PickupOrder;
    onConfirm:  (id: string) => void;
    onArrive:   (id: string) => void;
    onCollect:  (id: string) => void;
    onMiss:     (id: string, reason: MissReason) => void;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<PickupStatus, string> = {
    ASSIGNED:  'bg-gray-100 text-gray-600 border-gray-200',
    CONFIRMED: 'bg-teal-50 text-teal-700 border-teal-200',
    EN_ROUTE:  'bg-amber-50 text-amber-700 border-amber-200',
    COLLECTED: 'bg-[#1c3a2a] text-white border-[#1c3a2a]',
    MISSED:    'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABEL: Record<PickupStatus, string> = {
    ASSIGNED:  'Assigned',
    CONFIRMED: 'Confirmed',
    EN_ROUTE:  'En Route',
    COLLECTED: 'Collected',
    MISSED:    'Missed',
};

const STATUS_ICON: Record<PickupStatus, React.ReactNode> = {
    ASSIGNED:  <Clock size={11} />,
    CONFIRMED: <CheckCircle2 size={11} />,
    EN_ROUTE:  null, // uses pulsing dot
    COLLECTED: <CheckCircle2 size={11} />,
    MISSED:    <XCircle size={11} />,
};

// ─── Live countdown ────────────────────────────────────────────────────────────
function useCountdown(windowEnd: string): { label: string; urgency: 'ok' | 'amber' | 'red' } {
    const calc = useCallback(() => {
        const now  = new Date();
        const [h, m] = windowEnd.split(':').map(Number);
        const end  = new Date(now);
        end.setHours(h, m, 0, 0);
        const diffMs  = end.getTime() - now.getTime();
        const diffMin = Math.floor(diffMs / 60_000);
        if (diffMin <= 0) return { label: 'Window closed', urgency: 'red' as const };
        const hrs  = Math.floor(diffMin / 60);
        const mins = diffMin % 60;
        const label = hrs > 0 ? `Closes in ${hrs}h ${mins}m` : `Closes in ${mins}m`;
        const urgency = diffMin < 10 ? 'red' : diffMin < 30 ? 'amber' : 'ok';
        return { label, urgency: urgency as 'ok' | 'amber' | 'red' };
    }, [windowEnd]);

    const [state, setState] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setState(calc()), 30_000);
        return () => clearInterval(id);
    }, [calc]);

    return state;
}

// ─── Items summary line ───────────────────────────────────────────────────────
function itemsSummary(order: PickupOrder): string {
    const skuCount  = order.items.length;
    const units     = order.items.reduce((s, i) => s + i.qtyToCollect, 0);
    const weightKg  = order.items.reduce((s, i) => s + i.qtyToCollect * i.unitWeightKg, 0);
    return `${skuCount} SKU${skuCount !== 1 ? 's' : ''} · ${units} units · ~${weightKg.toFixed(0)}kg`;
}

// ─── Google Maps URL ──────────────────────────────────────────────────────────
function mapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// ─── WhatsApp URL ─────────────────────────────────────────────────────────────
function waUrl(phone: string, poNumber: string): string {
    const clean = phone.replace(/\s+/g, '').replace(/^\+/, '');
    const msg   = encodeURIComponent(`Hi, I'm your PickPackaging rider for pickup ${poNumber}. I'm on my way.`);
    return `https://wa.me/${clean}?text=${msg}`;
}

// ─── Can't-make-it AlertDialog ────────────────────────────────────────────────
function MissDialog({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: MissReason) => void;
}) {
    const [selected, setSelected] = useState<MissReason | ''>('');

    return (
        <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
            <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold">
                        Can't make this pickup?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[13px]">
                        Select a reason. This will be escalated to dispatch immediately.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2 py-2">
                    {MISS_REASONS.map((r) => (
                        <label
                            key={r}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-all',
                                selected === r
                                    ? 'border-red-400 bg-red-50 text-red-800'
                                    : 'border-border hover:border-muted-foreground/30',
                            )}
                        >
                            <input
                                type="radio"
                                name="miss-reason"
                                value={r}
                                checked={selected === r}
                                onChange={() => setSelected(r)}
                                className="accent-red-600"
                            />
                            <span className="text-[13px] font-medium">{r}</span>
                        </label>
                    ))}
                </div>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel onClick={onClose} className="flex-1">
                        Go back
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={!selected}
                        onClick={() => selected && onConfirm(selected as MissReason)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-40"
                    >
                        Report to dispatch
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ─── Main PickupCard ──────────────────────────────────────────────────────────
export function PickupCard({ order, onConfirm, onArrive, onCollect, onMiss }: PickupCardProps) {
    const { success } = useToast();
    const [expanded,  setExpanded]  = useState(false);
    const [missOpen,  setMissOpen]  = useState(false);
    const [acting,    setActing]    = useState(false);

    const { label: countdownLabel, urgency } = useCountdown(order.windowEnd);

    const countdownColor =
        urgency === 'red'   ? 'text-red-600' :
        urgency === 'amber' ? 'text-amber-600' :
        'text-foreground/40';

    // ── Async action wrapper ─────────────────────────────────────────────────
    const act = async (fn: () => void, toastMsg: string) => {
        setActing(true);
        await new Promise(r => setTimeout(r, 650));
        fn();
        success(toastMsg);
        setActing(false);
    };

    const handleMissConfirm = (reason: MissReason) => {
        setMissOpen(false);
        onMiss(order.id, reason);
        success('Escalated to dispatch');
    };

    const isDimmed = order.status === 'COLLECTED' || order.status === 'MISSED';

    return (
        <>
            <div className={cn(
                'bg-background rounded-2xl border border-foreground/[0.08] overflow-hidden transition-all',
                isDimmed && 'opacity-55',
            )}>
                {/* ── HEADER ─────────────────────────────────────────────── */}
                <div className="p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                        {/* PO + status */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Status badge */}
                            <span className={cn(
                                'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest',
                                STATUS_STYLE[order.status],
                            )}>
                                {order.status === 'EN_ROUTE' ? (
                                    <span className="relative flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping absolute" />
                                        <span className="w-2 h-2 rounded-full bg-amber-500 relative" />
                                    </span>
                                ) : STATUS_ICON[order.status]}
                                {STATUS_LABEL[order.status]}
                            </span>

                            {/* PO number */}
                            <span className="font-mono text-[12px] font-semibold text-foreground/50">
                                {order.poNumber}
                            </span>
                        </div>

                        {/* Pickup window + countdown */}
                        <div className="text-right">
                            <p className="text-[12px] font-semibold text-foreground/70">
                                {order.windowStart} – {order.windowEnd}
                            </p>
                            {order.status !== 'COLLECTED' && order.status !== 'MISSED' && (
                                <p className={cn('text-[11px] font-medium', countdownColor)}>
                                    {countdownLabel}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── BODY ───────────────────────────────────────────── */}
                    {/* Vendor */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <p className="font-semibold text-[15px] text-foreground leading-snug">
                            {order.vendorName}
                        </p>
                        {order.vendorVerified && (
                            <BadgeCheck size={16} className="text-teal-500 shrink-0" />
                        )}
                    </div>

                    {/* Address — 2-line clamp */}
                    <div className="flex items-start gap-1.5 mb-2">
                        <MapPin size={12} className="text-foreground/30 mt-0.5 shrink-0" />
                        <p className="text-[12px] text-foreground/50 line-clamp-2 leading-snug">
                            {order.address}
                        </p>
                    </div>

                    {/* Action links */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <a
                            href={mapsUrl(order.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[12px] font-semibold text-[#1c3a2a] hover:underline"
                        >
                            Get directions
                            <ExternalLink size={11} />
                        </a>
                        <span className="text-foreground/15">·</span>
                        <a
                            href={waUrl(order.vendorPhone, order.poNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#25D366] hover:underline"
                        >
                            <MessageCircle size={13} />
                            WhatsApp vendor
                        </a>
                    </div>

                    {/* Items summary + expand toggle */}
                    <button
                        onClick={() => setExpanded(v => !v)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] hover:border-foreground/[0.12] transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Package size={13} className="text-foreground/35" />
                            <span className="text-[12px] font-semibold text-foreground/55">
                                {itemsSummary(order)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-foreground/35">
                            {expanded ? (
                                <><ChevronUp size={14} /> Hide</>
                            ) : (
                                <><ChevronDown size={14} /> Show items</>
                            )}
                        </div>
                    </button>

                    {/* ── Expanded: item list ─────────────────────────────── */}
                    {expanded && (
                        <div className="mt-3 border border-foreground/[0.06] rounded-xl overflow-hidden">
                            {order.items.map((item, idx) => (
                                <div
                                    key={item.sku}
                                    className={cn(
                                        'flex items-center justify-between px-4 py-3 gap-3',
                                        idx !== order.items.length - 1 && 'border-b border-foreground/[0.05]',
                                    )}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-mono text-[10px] font-semibold text-foreground/35 mb-0.5">
                                            {item.sku}
                                        </p>
                                        <p className="text-[13px] font-medium text-foreground/75 leading-snug truncate">
                                            {item.productName}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-[13px] font-bold text-foreground">
                                            ×{item.qtyToCollect}
                                        </p>
                                        <p className="text-[11px] text-foreground/35">
                                            {(item.qtyToCollect * item.unitWeightKg).toFixed(1)}kg
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── FOOTER ACTION BAR ───────────────────────────────── */}
                    <div className="mt-4 space-y-2">
                        {/* ASSIGNED */}
                        {order.status === 'ASSIGNED' && (
                            <>
                                <button
                                    disabled={acting}
                                    onClick={() => act(() => onConfirm(order.id), 'Pickup confirmed')}
                                    className="w-full py-3 rounded-xl bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {acting && <Loader2 size={13} className="animate-spin" />}
                                    Confirm Pickup
                                </button>
                                <button
                                    disabled={acting}
                                    onClick={() => setMissOpen(true)}
                                    className="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                                >
                                    Can't make this
                                </button>
                            </>
                        )}

                        {/* CONFIRMED */}
                        {order.status === 'CONFIRMED' && (
                            <>
                                <button
                                    disabled={acting}
                                    onClick={() => act(() => onArrive(order.id), "Arrival recorded — en route!")}
                                    className="w-full py-3 rounded-xl border-2 border-[#1c3a2a] text-[#1c3a2a] text-[11px] font-bold uppercase tracking-widest hover:bg-[#1c3a2a] hover:text-white active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {acting && <Loader2 size={13} className="animate-spin" />}
                                    <Truck size={14} />
                                    I've Arrived
                                </button>
                                <button
                                    disabled={acting}
                                    onClick={() => setMissOpen(true)}
                                    className="w-full py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                                >
                                    Can't make this
                                </button>
                            </>
                        )}

                        {/* EN_ROUTE */}
                        {order.status === 'EN_ROUTE' && (
                            <button
                                disabled={acting}
                                onClick={() => act(() => onCollect(order.id), 'Collection recorded!')}
                                className="w-full py-3 rounded-xl bg-[#1c3a2a] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {acting && <Loader2 size={13} className="animate-spin" />}
                                <CheckCircle2 size={14} />
                                Mark as Collected
                            </button>
                        )}

                        {/* COLLECTED */}
                        {order.status === 'COLLECTED' && (
                            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-50 border border-teal-100">
                                <CheckCircle2 size={14} className="text-teal-600 shrink-0" />
                                <p className="text-[12px] font-semibold text-teal-700">
                                    Collected
                                    {order.collectedAt && (
                                        <> at {new Date(order.collectedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</>
                                    )}
                                    {order.collectedCount != null && (
                                        <> · {order.collectedCount}/{order.items.reduce((s, i) => s + i.qtyToCollect, 0)} items</>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* MISSED */}
                        {order.status === 'MISSED' && (
                            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                <AlertCircle size={14} className="text-red-500 shrink-0" />
                                <p className="text-[12px] font-semibold text-red-600">
                                    Escalated to dispatch
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Miss / Can't-make-it dialog */}
            <MissDialog
                open={missOpen}
                onClose={() => setMissOpen(false)}
                onConfirm={handleMissConfirm}
            />
        </>
    );
}
