"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
    AlertTriangle, 
    Camera, 
    CheckCircle2, 
    Loader2, 
    Minus, 
    Plus,
    X
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import { 
    ManifestItem, 
    DamageType, 
    DamageSeverity, 
    DamageResponsibility,
    DamageReport
} from '@/types/rider/inventory';
import Image from 'next/image';

// ─── Constants ──────────────────────────────────────────────────────────────
const DAMAGE_TYPES: DamageType[] = [
    'Crushed', 
    'Wet damage', 
    'Torn packaging', 
    'Missing labels', 
    'Contamination', 
    'Other'
];

const SEVERITY_LEVELS: { value: DamageSeverity; label: string; color: string }[] = [
    { value: 'Minor',    label: 'Minor',    color: 'bg-teal-500' },
    { value: 'Moderate', label: 'Moderate', color: 'bg-amber-500' },
    { value: 'Severe',   label: 'Severe',   color: 'bg-red-500' }
];

const RESPONSIBILITY_OPTIONS: { value: DamageResponsibility; label: string }[] = [
    { value: 'Vendor',     label: 'Vendor (damaged at source)' },
    { value: 'In transit', label: 'In transit (damaged during delivery)' },
    { value: 'Unknown',    label: 'Unknown' }
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface DamageReportSheetProps {
    item: ManifestItem | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (itemId: string, report: DamageReport) => void;
}

export function DamageReportSheet({
    item,
    open,
    onClose,
    onSubmit
}: DamageReportSheetProps) {
    const { success } = useToast();
    const photoInputRef = useRef<HTMLInputElement>(null);

    // ─── Form State ───────────────────────────────────────────────────────────
    const [damageType, setDamageType] = useState<DamageType | ''>('');
    const [qtyAffected, setQtyAffected] = useState(1);
    const [severity, setSeverity] = useState<DamageSeverity>('Minor');
    const [description, setDescription] = useState('');
    const [responsibility, setResponsibility] = useState<DamageResponsibility>('In transit');
    const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Reset form when item changes or sheet opens
    useEffect(() => {
        if (open && item) {
            setDamageType('');
            setQtyAffected(1);
            setSeverity('Minor');
            setDescription('');
            setResponsibility('In transit');
            setPhotoDataUrl(null);
            setSubmitting(false);
        }
    }, [open, item]);

    if (!item) return null;

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhotoDataUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleFormSubmit = async () => {
        if (!damageType) return;
        
        setSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));

        const report: DamageReport = {
            id: `rep-${Math.random().toString(36).substr(2, 9)}`,
            itemId: item.id,
            type: damageType as DamageType,
            qtyAffected,
            severity,
            description: description || undefined,
            photoDataUrl: photoDataUrl || undefined,
            responsibility,
            reportedAt: new Date().toISOString()
        };

        onSubmit(item.id, report);
        success(`Damage reported for ${item.sku}`);
        
        if (responsibility === 'Vendor') {
            console.log(`FLAGGED VENDOR: ${item.vendorName} for admin review regarding ${item.sku}`);
        }

        setSubmitting(false);
        onClose();
    };

    const isFormValid = !!damageType && qtyAffected > 0;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent 
                side="bottom" 
                className="rounded-t-3xl p-0 flex flex-col max-h-[92vh] sm:max-h-[85vh] sm:max-w-xl sm:mx-auto sm:right-0 sm:left-auto sm:rounded-none sm:rounded-l-3xl"
            >
                {/* Header */}
                <SheetHeader className="px-6 pt-6 pb-4 border-b border-foreground/5 shrink-0">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[18px] font-semibold">Report Damage</SheetTitle>
                    </div>
                    <div className="flex items-center gap-3 mt-3 bg-foreground/5 p-3 rounded-xl">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                            <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-foreground truncate">{item.productName}</p>
                            <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">{item.sku}</p>
                        </div>
                    </div>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
                    
                    {/* Damage Type */}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Damage Type</Label>
                        <Select value={damageType} onValueChange={(v) => setDamageType(v as DamageType)}>
                            <SelectTrigger className="w-full bg-white border-foreground/10 h-11 rounded-xl">
                                <SelectValue placeholder="Select type of damage" />
                            </SelectTrigger>
                            <SelectContent>
                                {DAMAGE_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Quantity Affected</Label>
                        <div className="flex items-center justify-between p-3 bg-white border border-foreground/10 rounded-xl h-11">
                            <span className="text-[13px] font-medium text-foreground/60">Units damaged</span>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setQtyAffected(Math.max(1, qtyAffected - 1))}
                                    className="p-1 hover:bg-foreground/5 rounded-md transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="text-[14px] font-bold w-4 text-center tabular-nums">{qtyAffected}</span>
                                <button 
                                    onClick={() => setQtyAffected(Math.min(item.collectedQty, qtyAffected + 1))}
                                    className="p-1 hover:bg-foreground/5 rounded-md transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-foreground/30 font-medium">Max available: {item.collectedQty} units</p>
                    </div>

                    {/* Severity */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Severity</Label>
                        <RadioGroup 
                            value={severity} 
                            onValueChange={(v) => setSeverity(v as DamageSeverity)}
                            className="flex gap-2"
                        >
                            {SEVERITY_LEVELS.map(level => (
                                <div key={level.value} className="flex-1">
                                    <RadioGroupItem value={level.value} id={level.value} className="peer sr-only" />
                                    <Label 
                                        htmlFor={level.value}
                                        className={cn(
                                            "flex flex-col items-center justify-center py-3 rounded-xl border border-foreground/10 cursor-pointer transition-all peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-white hover:border-foreground/25",
                                        )}
                                    >
                                        <div className={cn("w-1.5 h-1.5 rounded-full mb-1", level.color)} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">{level.label}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Description (Optional)</Label>
                        <Textarea 
                            placeholder="Provide more details about the damage..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] bg-white border-foreground/10 rounded-xl focus-visible:ring-[#1c3a2a]/20"
                        />
                    </div>

                    {/* Photo Proof */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Photo Proof</Label>
                        {photoDataUrl ? (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-foreground/10 bg-black/5 group">
                                <Image src={photoDataUrl} alt="Damage proof" fill className="object-cover" />
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
                                className="w-full py-10 border-2 border-dashed border-foreground/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[#1c3a2a]/30 hover:bg-[#1c3a2a]/5 transition-all text-foreground/30 hover:text-[#1c3a2a]"
                            >
                                <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <Camera size={24} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] font-semibold">Take Photo</p>
                                    <p className="text-[11px] opacity-60">Opens camera to capture proof</p>
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

                    {/* Responsibility */}
                    <div className="space-y-3">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">Who is responsible?</Label>
                        <RadioGroup 
                            value={responsibility} 
                            onValueChange={(v) => setResponsibility(v as DamageResponsibility)}
                            className="space-y-2"
                        >
                            {RESPONSIBILITY_OPTIONS.map(option => (
                                <div key={option.value} className="flex items-center space-x-3 p-3 border border-foreground/5 rounded-xl hover:bg-foreground/[0.02] cursor-pointer group transition-colors">
                                    <RadioGroupItem value={option.value} id={option.value} className="border-foreground/20 text-[#1c3a2a]" />
                                    <Label htmlFor={option.value} className="text-[13px] font-medium cursor-pointer flex-1">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                {/* Footer */}
                <SheetFooter className="p-6 border-t border-foreground/5 bg-white shrink-0">
                    <button 
                        disabled={!isFormValid || submitting}
                        onClick={handleFormSubmit}
                        className="w-full py-4 bg-[#1c3a2a] text-white rounded-xl text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#152d20] active:scale-[0.98] transition-all disabled:opacity-40"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={16} />
                                Submit Report
                            </>
                        )}
                    </button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
