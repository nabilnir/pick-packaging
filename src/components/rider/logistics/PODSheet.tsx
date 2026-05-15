"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    CheckCircle2, 
    Camera, 
    X, 
    PenTool, 
    User, 
    Briefcase,
    AlertTriangle,
    Minus,
    Plus,
    Loader2
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast-provider';
import { DeliveryStop, PODRecord, DeliveredLineItem } from '@/types/rider/logistics';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PODSheetProps {
    stop: DeliveryStop | null;
    open: boolean;
    onClose: () => void;
    onComplete: (stopId: string, record: PODRecord) => void;
}

const SHORTAGE_REASONS = [
    'Item damaged',
    'Item missing from vehicle',
    'Customer refused partial order',
    'Wrong item loaded',
    'Other'
];

export function PODSheet({ stop, open, onClose, onComplete }: PODSheetProps) {
    const { success } = useToast();

    // ─── Form State ───────────────────────────────────────────────────────────
    const [deliveredQtys, setDeliveredQtys] = useState<Record<string, number>>({});
    const [shortageReasons, setShortageReasons] = useState<Record<string, string>>({});
    const [receivedByName, setReceivedByName] = useState('');
    const [recipientRole, setRecipientRole] = useState('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // ─── Signature Canvas State ───────────────────────────────────────────────
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Reset when opened
    useEffect(() => {
        if (open && stop) {
            const initialQtys: Record<string, number> = {};
            stop.items.forEach(item => {
                initialQtys[item.sku] = item.qty;
            });
            setDeliveredQtys(initialQtys);
            setShortageReasons({});
            setReceivedByName('');
            setRecipientRole('');
            setPhotoDataUrl(null);
            setHasSignature(false);
            setSubmitting(false);
            clearSignature();
        }
    }, [open, stop]);

    // ─── Signature Canvas Handlers ────────────────────────────────────────────
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.beginPath(); // reset path
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get coordinates depending on touch or mouse
        let clientX = 0;
        let clientY = 0;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1c3a2a';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        setHasSignature(true);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    // Prevent scrolling while signing on mobile
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const preventScroll = (e: TouchEvent) => e.preventDefault();
        canvas.addEventListener('touchstart', preventScroll, { passive: false });
        canvas.addEventListener('touchmove', preventScroll, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', preventScroll);
            canvas.removeEventListener('touchmove', preventScroll);
        };
    }, [open]);

    // ─── Photo Handler ────────────────────────────────────────────────────────
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!stop || !canvasRef.current) return;
        setSubmitting(true);

        const signatureDataUrl = canvasRef.current.toDataURL('image/png');
        
        const deliveredItems: DeliveredLineItem[] = stop.items.map(item => ({
            ...item,
            deliveredQty: deliveredQtys[item.sku] || 0,
            shortageReason: (deliveredQtys[item.sku] || 0) < item.qty ? shortageReasons[item.sku] : undefined
        }));

        const record: PODRecord = {
            id: `pod-${Math.random().toString(36).substr(2, 9)}`,
            stopId: stop.id,
            receivedByName,
            recipientRole: recipientRole || undefined,
            signatureDataUrl,
            photoDataUrl: photoDataUrl!, // Validated by isFormValid
            deliveredItems,
            submittedAt: new Date().toISOString()
        };

        // Simulate API
        await new Promise(r => setTimeout(r, 1000));

        success(`Stop ${stop.stopNumber} delivered · ${stop.companyName}`);
        onComplete(stop.id, record);
        setSubmitting(false);
        onClose();
    };

    // Validation
    const isFormValid = 
        hasSignature && 
        !!photoDataUrl && 
        receivedByName.trim().length > 0 &&
        stop?.items.every(item => {
            const delQty = deliveredQtys[item.sku] ?? item.qty;
            if (delQty < item.qty) {
                return !!shortageReasons[item.sku]; // Require reason if short
            }
            return true;
        });

    if (!stop) return null;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent 
                side="bottom" 
                className="rounded-t-3xl p-0 flex flex-col max-h-[95vh] sm:max-h-[85vh] sm:max-w-xl sm:mx-auto sm:right-0 sm:left-auto sm:rounded-none sm:rounded-l-3xl"
            >
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-foreground/5 shrink-0 bg-white z-10">
                    <SheetTitle className="text-[18px] font-semibold text-left">
                        Proof of Delivery — Stop {stop.stopNumber}
                    </SheetTitle>
                    <p className="text-[13px] text-foreground/50 text-left truncate">{stop.companyName}</p>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10 custom-scrollbar relative">
                    
                    {/* ── SECTION A: Item Confirmation ─────────────────────────── */}
                    <div className="space-y-4">
                        <h3 className="text-[12px] font-bold uppercase tracking-widest text-foreground/40 border-b border-foreground/5 pb-2">
                            Item Confirmation
                        </h3>
                        <div className="space-y-6">
                            {stop.items.map(item => {
                                const expQty = item.qty;
                                const delQty = deliveredQtys[item.sku] ?? expQty;
                                const isShort = delQty < expQty;

                                return (
                                    <div key={item.sku} className="space-y-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <p className="text-[14px] font-medium text-foreground leading-snug">{item.productName}</p>
                                                <p className="text-[11px] font-mono text-foreground/40 mt-0.5">{item.sku}</p>
                                            </div>
                                            <div className="shrink-0 flex items-center justify-between p-2 bg-white border border-foreground/10 rounded-xl w-[120px]">
                                                <button 
                                                    onClick={() => setDeliveredQtys(p => ({ ...p, [item.sku]: Math.max(0, delQty - 1) }))}
                                                    className="w-8 h-8 rounded-lg hover:bg-foreground/5 flex items-center justify-center text-foreground/50 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className={cn(
                                                    "text-[15px] font-bold tabular-nums",
                                                    isShort ? "text-amber-600" : "text-foreground"
                                                )}>{delQty}</span>
                                                <button 
                                                    onClick={() => setDeliveredQtys(p => ({ ...p, [item.sku]: Math.min(expQty, delQty + 1) }))}
                                                    className="w-8 h-8 rounded-lg hover:bg-foreground/5 flex items-center justify-center text-foreground/50 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Short Delivery Reason */}
                                        {isShort && (
                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-2" />
                                                <div className="flex-1 space-y-2">
                                                    <Label className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Shortage Reason</Label>
                                                    <Select 
                                                        value={shortageReasons[item.sku] || ''} 
                                                        onValueChange={(v) => setShortageReasons(p => ({ ...p, [item.sku]: v }))}
                                                    >
                                                        <SelectTrigger className="w-full bg-white border-amber-200 h-10 rounded-lg text-amber-900 focus:ring-amber-500/20">
                                                            <SelectValue placeholder="Select reason..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {SHORTAGE_REASONS.map(reason => (
                                                                <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── SECTION B: Recipient ─────────────────────────────────── */}
                    <div className="space-y-4">
                        <h3 className="text-[12px] font-bold uppercase tracking-widest text-foreground/40 border-b border-foreground/5 pb-2">
                            Recipient Information
                        </h3>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label className="text-[12px] text-foreground/60 flex items-center gap-1.5">
                                    <User size={14} /> Received by <span className="text-red-500">*</span>
                                </Label>
                                <Input 
                                    placeholder="Name of person signing"
                                    value={receivedByName}
                                    onChange={e => setReceivedByName(e.target.value)}
                                    className="h-12 bg-white rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[12px] text-foreground/60 flex items-center gap-1.5">
                                    <Briefcase size={14} /> Recipient role <span className="text-foreground/30 font-normal ml-1">(Optional)</span>
                                </Label>
                                <Input 
                                    placeholder="e.g. Warehouse Manager"
                                    value={recipientRole}
                                    onChange={e => setRecipientRole(e.target.value)}
                                    className="h-12 bg-white rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION C: Signature ─────────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
                            <h3 className="text-[12px] font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-1.5">
                                <PenTool size={14} /> Signature <span className="text-red-500 ml-0.5">*</span>
                            </h3>
                            {hasSignature && (
                                <button 
                                    onClick={clearSignature}
                                    className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-foreground"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        
                        <div className="border border-foreground/10 rounded-2xl bg-foreground/[0.02] overflow-hidden relative">
                            <canvas
                                ref={canvasRef}
                                width={500}
                                height={200}
                                className="w-full h-[200px] touch-none cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                            {!hasSignature && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <span className="text-foreground/20 font-medium text-[14px]">Sign here</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-foreground/40 font-medium text-center">
                            Signature is securely stored as proof of delivery.
                        </p>
                    </div>

                    {/* ── SECTION D: Photo ─────────────────────────────────────── */}
                    <div className="space-y-4">
                        <h3 className="text-[12px] font-bold uppercase tracking-widest text-foreground/40 border-b border-foreground/5 pb-2">
                            Delivery Photo <span className="text-red-500">*</span>
                        </h3>
                        
                        {photoDataUrl ? (
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-foreground/10 bg-black/5 group">
                                <Image src={photoDataUrl} alt="Delivery proof" fill className="object-cover" />
                                <button 
                                    onClick={() => setPhotoDataUrl(null)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    <p className="text-[10px] font-medium text-white flex items-center gap-1.5">
                                        <CheckCircle2 size={12} className="text-emerald-400" />
                                        Photo captured
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => photoInputRef.current?.click()}
                                className="w-full py-12 border-2 border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#1c3a2a]/30 hover:bg-[#1c3a2a]/5 transition-all text-foreground/30 hover:text-[#1c3a2a]"
                            >
                                <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <Camera size={26} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[14px] font-semibold text-foreground">Capture Drop-off</p>
                                    <p className="text-[11px] mt-1 opacity-70">Include parcels and location context</p>
                                </div>
                            </button>
                        )}
                        <input 
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>
                </div>

                {/* Footer */}
                <SheetFooter className="p-6 border-t border-foreground/5 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
                    <button 
                        disabled={!isFormValid || submitting}
                        onClick={handleSubmit}
                        className="w-full py-4 bg-[#1c3a2a] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:bg-[#1c3a2a] disabled:active:scale-100"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                Complete Delivery
                            </>
                        )}
                    </button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
