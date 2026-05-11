"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Loader2, Check } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Address, AddressType } from '@/types/addresses';

// ─── SA Provinces ─────────────────────────────────────────────────────────────
const PROVINCES = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Western Cape',
];

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const addressSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    companyName: z.string().optional(),
    phone: z.string().optional().refine((val) => {
        if (!val) return true;
        // Basic SA phone validation: +27 followed by 9 digits
        return /^\+27\s\d{2}\s\d{3}\s\d{4}$/.test(val) || /^\+27\d{9}$/.test(val);
    }, 'Invalid SA format (e.g. +27 XX XXX XXXX)'),
    streetLine1: z.string().min(1, 'Street address is required'),
    streetLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    postalCode: z.string().length(4, 'Postal code must be exactly 4 digits'),
    type: z.enum(['SHIPPING', 'BILLING', 'BOTH'] as const),
    isPrimary: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddressFormProps {
    mode: 'add' | 'edit';
    initialData?: Address | null;
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export function AddressForm({
    mode,
    initialData,
    open,
    onClose,
    onSave,
}: AddressFormProps) {
    const [fetchingCity, setFetchingCity] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors, isDirty, isValid },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        mode: 'onBlur',
        defaultValues: {
            fullName: '',
            companyName: '',
            phone: '',
            streetLine1: '',
            streetLine2: '',
            city: '',
            province: '',
            postalCode: '',
            type: 'SHIPPING',
            isPrimary: false,
        },
    });

    // Reset form when initialData changes or modal opens
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                reset({
                    fullName: initialData.fullName,
                    companyName: initialData.companyName || '',
                    phone: initialData.phone || '',
                    streetLine1: initialData.streetLine1,
                    streetLine2: initialData.streetLine2 || '',
                    city: initialData.city,
                    province: initialData.province,
                    postalCode: initialData.postalCode,
                    type: initialData.type,
                    isPrimary: initialData.isPrimary,
                });
            } else {
                reset({
                    fullName: '',
                    companyName: '',
                    phone: '',
                    streetLine1: '',
                    streetLine2: '',
                    city: '',
                    province: '',
                    postalCode: '',
                    type: 'SHIPPING',
                    isPrimary: false,
                });
            }
        }
    }, [open, mode, initialData, reset]);

    const watchType = watch('type');
    const watchProvince = watch('province');

    // ─── Postal Code Lookup ──────────────────────────────────────────────────
    const handlePostalCodeBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const code = e.target.value;
        if (code.length === 4 && !getValues('city')) {
            setFetchingCity(true);
            // Mock API lookup
            setTimeout(() => {
                const mockMap: Record<string, string> = {
                    '8001': 'Cape Town',
                    '2000': 'Johannesburg',
                    '4001': 'Durban',
                    '0001': 'Pretoria',
                };
                if (mockMap[code]) {
                    setValue('city', mockMap[code], { shouldValidate: true });
                }
                setFetchingCity(false);
            }, 600);
        }
    };

    const onSubmit = (data: AddressFormData) => {
        onSave(data);
    };

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent className="sm:max-w-[480px] p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border">
                    <SheetTitle className="text-2xl font-light">
                        {mode === 'add' ? 'Add new address' : 'Edit address'}
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <form id="address-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Full name
                            </label>
                            <input
                                {...register('fullName')}
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm",
                                    errors.fullName && "border-red-500 focus:border-red-500"
                                )}
                                placeholder="Enter full name"
                            />
                            {errors.fullName && <p className="text-[11px] text-red-500 font-medium">{errors.fullName.message}</p>}
                        </div>

                        {/* Company Name */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Company / Business name (optional)
                            </label>
                            <input
                                {...register('companyName')}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm"
                                placeholder="Enter company name"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Phone number (optional)
                            </label>
                            <input
                                {...register('phone')}
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm",
                                    errors.phone && "border-red-500 focus:border-red-500"
                                )}
                                placeholder="+27 XX XXX XXXX"
                            />
                            {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone.message}</p>}
                        </div>

                        {/* Address Line 1 */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Address line 1
                            </label>
                            <input
                                {...register('streetLine1')}
                                className={cn(
                                    "w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm",
                                    errors.streetLine1 && "border-red-500 focus:border-red-500"
                                )}
                                placeholder="Street address or P.O. box"
                            />
                            {errors.streetLine1 && <p className="text-[11px] text-red-500 font-medium">{errors.streetLine1.message}</p>}
                        </div>

                        {/* Address Line 2 */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Address line 2 (optional)
                            </label>
                            <input
                                {...register('streetLine2')}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm"
                                placeholder="Apt, suite, unit, building"
                            />
                        </div>

                        {/* City & Province Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    City
                                </label>
                                <div className="relative">
                                    <input
                                        {...register('city')}
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm",
                                            errors.city && "border-red-500 focus:border-red-500"
                                        )}
                                        placeholder="City"
                                    />
                                    {fetchingCity && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />}
                                </div>
                                {errors.city && <p className="text-[11px] text-red-500 font-medium">{errors.city.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Province
                                </label>
                                <Select
                                    value={watchProvince}
                                    onValueChange={(val) => setValue('province', val, { shouldValidate: true, shouldDirty: true })}
                                >
                                    <SelectTrigger className={cn("w-full h-[42px] border-border", errors.province && "border-red-500")}>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROVINCES.map((p) => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.province && <p className="text-[11px] text-red-500 font-medium">{errors.province.message}</p>}
                            </div>
                        </div>

                        {/* Postal Code & Country Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Postal code
                                </label>
                                <input
                                    {...register('postalCode')}
                                    onBlur={(e) => {
                                        register('postalCode').onBlur(e);
                                        handlePostalCodeBlur(e);
                                    }}
                                    className={cn(
                                        "w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-[#1c3a2a] outline-none transition-all text-sm",
                                        errors.postalCode && "border-red-500 focus:border-red-500"
                                    )}
                                    placeholder="4-digit code"
                                    maxLength={4}
                                />
                                {errors.postalCode && <p className="text-[11px] text-red-500 font-medium">{errors.postalCode.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Country
                                </label>
                                <div className="relative">
                                    <input
                                        disabled
                                        value="South Africa"
                                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/30 text-muted-foreground text-sm cursor-not-allowed pr-10"
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 opacity-30" />
                                </div>
                            </div>
                        </div>

                        {/* Address Type (Segmented Control) */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Address type
                            </label>
                            <div className="flex p-1 bg-muted/50 rounded-xl border border-border">
                                {(['SHIPPING', 'BILLING', 'BOTH'] as AddressType[]).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setValue('type', type, { shouldDirty: true })}
                                        className={cn(
                                            "flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all",
                                            watchType === type
                                                ? "bg-white text-[#1c3a2a] shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {type === 'BOTH' ? 'Both' : type.charAt(0) + type.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Set as primary address */}
                        <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
                            <div className="relative flex items-center">
                                <Checkbox
                                    checked={watch('isPrimary')}
                                    onCheckedChange={(checked) => setValue('isPrimary', !!checked, { shouldDirty: true })}
                                    className="border-border data-[state=checked]:bg-[#1c3a2a] data-[state=checked]:border-[#1c3a2a]"
                                />
                            </div>
                            <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                Set as primary address
                            </span>
                        </label>
                    </form>
                </div>

                <SheetFooter className="p-6 border-t border-border bg-muted/10 sticky bottom-0">
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            form="address-form"
                            type="submit"
                            disabled={!isDirty || !isValid}
                            className={cn(
                                "w-full py-3 rounded-full text-[12px] font-bold uppercase tracking-widest transition-all",
                                isDirty && isValid
                                    ? "bg-[#1c3a2a] text-white hover:bg-[#152d20] shadow-sm"
                                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            )}
                        >
                            Save address
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 rounded-full text-[12px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
