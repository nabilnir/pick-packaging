"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    AlertTriangle,
    Camera,
    X,
    Calendar,
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/toast-provider';
import { DeliveryStop, FailedDeliveryRecord, FailureReason } from '@/types/rider/logistics';
import Image from 'next/image';

interface FailedDeliverySheetProps {
    stop: DeliveryStop | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (stopId: string, record: FailedDeliveryRecord) => void;
}

const FAILURE_REASONS: FailureReason[] = [
    'Recipient not available',
    'Business closed',
    'Address not found',
    'Access denied',
    'Refused delivery',
    'Time window missed'
];

const TIME_WINDOWS = [
    'Morning (08:00 - 12:00)',
    'Afternoon (12:00 - 17:00)'
];

export function FailedDeliverySheet({ stop, open, onClose, onSubmit }: FailedDeliverySheetProps) {
    const { toast } = useToast();

    // ─── Form State ───────────────────────────────────────────────────────────
    const [reason, setReason] = useState<FailureReason | ''>('');
    const [notes, setNotes] = useState('');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [requestReschedule, setRequestReschedule] = useState(false);
    const [rescheduleWindow, setRescheduleWindow] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Reset when opened
    useEffect(() => {
        if (open && stop) {
            setReason('');
            setNotes('');
            setPhotoDataUrl(null);
            setRequestReschedule(false);
            setRescheduleWindow('');
            setSubmitting(false);
        }
    }, [open, stop]);

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
        if (!stop || !reason) return;
        setSubmitting(true);

        const record: FailedDeliveryRecord = {
            id: `fail-${Math.random().toString(36).substr(2, 9)}`,
            stopId: stop.id,
            reason: reason as FailureReason,
            notes: notes || undefined,
            photoDataUrl: photoDataUrl || undefined,
            requestReschedule,
            rescheduleWindow: requestReschedule ? rescheduleWindow : undefined,
            reportedAt: new Date().toISOString()
        };

        // Simulate API
        await new Promise(r => setTimeout(r, 1000));

        onSubmit(stop.id, record);
        
        toast({
            title: `Stop ${stop.stopNumber} marked failed`,
            description: 'Dispatch has been notified. Items automatically marked for return.',
            variant: 'destructive',
        });

        // Simulate inventory update logic internally
        console.log(`[Inventory] Marked ${stop.items.length} items from Stop ${stop.stopNumber} as RETURN`);
        
        setSubmitting(false);
        onClose();
    };

    // Validation
    const isFormValid = 
        !!reason && 
        (!requestReschedule || (requestReschedule && !!rescheduleWindow));

    if (!stop) return null;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent 
                side="bottom" 
                className="rounded-t-3xl p-0 flex flex-col max-h-[95vh] sm:max-h-[85vh] sm:max-w-xl sm:mx-auto sm:right-0 sm:left-auto sm:rounded-none sm:rounded-l-3xl"
            >
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-foreground/5 shrink-0 bg-white z-10">
                    <div className="flex items-center gap-2 text-red-600 mb-1">
                        <AlertTriangle size={18} />
                        <SheetTitle className="text-[18px] font-semibold text-inherit">
                            Report Failed Delivery
                        </SheetTitle>
                    </div>
                    <p className="text-[13px] text-foreground/50 text-left truncate">
                        Stop {stop.stopNumber} · {stop.companyName}
                    </p>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
                    
                    {/* Failure Reason */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                            Failure Reason <span className="text-red-500">*</span>
                        </Label>
                        <Select value={reason} onValueChange={(v) => setReason(v as FailureReason)}>
                            <SelectTrigger className="w-full bg-white border-foreground/10 h-12 rounded-xl focus:ring-red-500/20">
                                <SelectValue placeholder="Select why delivery failed" />
                            </SelectTrigger>
                            <SelectContent>
                                {FAILURE_REASONS.map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                            Additional Notes <span className="text-foreground/30 font-normal ml-1">(Optional)</span>
                        </Label>
                        <Textarea 
                            placeholder="Provide more details for dispatch..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[100px] bg-white border-foreground/10 rounded-xl focus-visible:ring-red-500/20"
                        />
                    </div>

                    {/* Photo Evidence */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
                            Photo Evidence <span className="text-foreground/30 font-normal ml-1">(Optional)</span>
                        </Label>
                        
                        {photoDataUrl ? (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-foreground/10 bg-black/5 group">
                                <Image src={photoDataUrl} alt="Evidence" fill className="object-cover" />
                                <button 
                                    onClick={() => setPhotoDataUrl(null)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => photoInputRef.current?.click()}
                                className="w-full py-8 border-2 border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-red-500/30 hover:bg-red-50 transition-all text-foreground/40 hover:text-red-600"
                            >
                                <Camera size={24} />
                                <span className="text-[13px] font-medium">Capture Evidence</span>
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

                    {/* Reschedule */}
                    <div className="space-y-4 pt-4 border-t border-foreground/5">
                        <div className="flex items-start space-x-3">
                            <Checkbox 
                                id="reschedule" 
                                checked={requestReschedule} 
                                onCheckedChange={(c) => setRequestReschedule(!!c)} 
                                className="mt-0.5 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                            />
                            <div className="space-y-1">
                                <Label htmlFor="reschedule" className="text-[14px] font-semibold cursor-pointer">
                                    Request reschedule for tomorrow
                                </Label>
                                <p className="text-[12px] text-foreground/50">
                                    Adds this stop to tomorrow's manifest.
                                </p>
                            </div>
                        </div>

                        {requestReschedule && (
                            <div className="pl-7 animate-in fade-in slide-in-from-top-2 duration-200">
                                <Select value={rescheduleWindow} onValueChange={setRescheduleWindow}>
                                    <SelectTrigger className="w-full bg-white border-foreground/10 h-11 rounded-lg">
                                        <div className="flex items-center gap-2 text-foreground/70">
                                            <Calendar size={14} />
                                            <SelectValue placeholder="Preferred time window" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_WINDOWS.map(w => (
                                            <SelectItem key={w} value={w}>{w}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <SheetFooter className="p-6 border-t border-foreground/5 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
                    <button 
                        disabled={!isFormValid || submitting}
                        onClick={handleSubmit}
                        className="w-full py-4 bg-red-600 text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:bg-red-600 disabled:active:scale-100"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Report Failed Delivery'
                        )}
                    </button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
