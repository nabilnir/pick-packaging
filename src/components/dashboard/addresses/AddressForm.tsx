"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Loader2, ChevronsUpDown, Check } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Address, AddressType, AddressPayload } from '@/types/addresses';

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
] as const;

// Postal code → city mock (replace with real API call)
const POSTAL_CITY_MAP: Record<string, string> = {
    '8001': 'Cape Town',
    '8000': 'Cape Town',
    '2000': 'Johannesburg',
    '2001': 'Johannesburg',
    '4001': 'Durban',
    '4000': 'Durban',
    '0001': 'Pretoria',
    '0002': 'Pretoria',
    '7500': 'Stellenbosch',
    '6001': 'Port Elizabeth',
};

// ─── Zod schema ───────────────────────────────────────────────────────────────
const schema = z.object({
    fullName:   z.string().min(1, 'Full name is required'),
    company:    z.string().optional(),
    phone:      z
        .string()
        .optional()
        .refine(
            (v) => !v || /^\+27\s?\d{2}\s?\d{3}\s?\d{4}$/.test(v),
            'Use SA format: +27 XX XXX XXXX',
        ),
    line1:      z.string().min(1, 'Street address is required'),
    line2:      z.string().optional(),
    city:       z.string().min(1, 'City is required'),
    province:   z.string().min(1, 'Province is required'),
    postalCode: z.string().regex(/^\d{4}$/, 'Must be exactly 4 digits'),
    type:       z.enum(['shipping', 'billing', 'both'] as const),
    isPrimary:  z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface AddressFormProps {
    mode: 'add' | 'edit';
    initialData?: Address | null;
    open: boolean;
    onClose: () => void;
    onSave: (data: AddressPayload) => void;
}

// ─── Reusable field wrapper ───────────────────────────────────────────────────
function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 block">
                {label}
            </label>
            {children}
            {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AddressForm({ mode, initialData, open, onClose, onSave }: AddressFormProps) {
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [lookingUpCity, setLookingUpCity] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors, isDirty, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            fullName:   '',
            company:    '',
            phone:      '',
            line1:      '',
            line2:      '',
            city:       '',
            province:   '',
            postalCode: '',
            type:       'shipping',
            isPrimary:  false,
        },
    });

    const watchType     = watch('type');
    const watchProvince = watch('province');
    const watchPrimary  = watch('isPrimary');

    // Sync form when sheet opens / initialData changes
    useEffect(() => {
        if (!open) return;
        if (mode === 'edit' && initialData) {
            reset({
                fullName:   initialData.fullName,
                company:    initialData.company   ?? '',
                phone:      initialData.phone     ?? '',
                line1:      initialData.line1,
                line2:      initialData.line2     ?? '',
                city:       initialData.city,
                province:   initialData.province,
                postalCode: initialData.postalCode,
                type:       initialData.type,
                isPrimary:  initialData.isPrimary,
            });
        } else {
            reset({
                fullName: '', company: '', phone: '',
                line1: '', line2: '', city: '', province: '',
                postalCode: '', type: 'shipping', isPrimary: false,
            });
        }
    }, [open, mode, initialData, reset]);

    // ── Postal code auto-fill city ────────────────────────────────────────────
    const handlePostalBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const code = e.target.value.trim();
        if (code.length !== 4) return;
        if (getValues('city')) return; // don't overwrite an existing entry

        setLookingUpCity(true);
        await new Promise(r => setTimeout(r, 500));
        const city = POSTAL_CITY_MAP[code];
        if (city) setValue('city', city, { shouldValidate: true });
        setLookingUpCity(false);
    };

    const onSubmit = (data: FormData) => {
        onSave({ ...data, country: 'South Africa' } as AddressPayload);
    };

    const inputCls = (hasError?: boolean) =>
        cn(
            'w-full px-4 py-2.5 rounded-lg border bg-background text-sm transition-all outline-none',
            'placeholder:text-muted-foreground/40',
            hasError
                ? 'border-red-400 focus:border-red-500'
                : 'border-border focus:border-[#1c3a2a]',
        );

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            {/* 480px wide, full width on mobile */}
            <SheetContent
                side="right"
                className="w-[480px] max-w-full p-0 flex flex-col gap-0"
            >
                {/* Header */}
                <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
                    <SheetTitle className="text-2xl font-light">
                        {mode === 'add' ? 'Add new address' : 'Edit address'}
                    </SheetTitle>
                </SheetHeader>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <form id="address-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full name */}
                        <Field label="Full name" error={errors.fullName?.message}>
                            <input
                                {...register('fullName')}
                                className={inputCls(!!errors.fullName)}
                                placeholder="Enter full name"
                            />
                        </Field>

                        {/* Company */}
                        <Field label="Company / Business name (optional)">
                            <input
                                {...register('company')}
                                className={inputCls()}
                                placeholder="e.g. Acme (Pty) Ltd"
                            />
                        </Field>

                        {/* Phone */}
                        <Field label="Phone number (optional)" error={errors.phone?.message}>
                            <input
                                {...register('phone')}
                                className={inputCls(!!errors.phone)}
                                placeholder="+27 XX XXX XXXX"
                                inputMode="tel"
                            />
                        </Field>

                        {/* Line 1 */}
                        <Field label="Address line 1" error={errors.line1?.message}>
                            <input
                                {...register('line1')}
                                className={inputCls(!!errors.line1)}
                                placeholder="Street address or P.O. box"
                            />
                        </Field>

                        {/* Line 2 */}
                        <Field label="Address line 2 (optional)">
                            <input
                                {...register('line2')}
                                className={inputCls()}
                                placeholder="Apt, suite, unit, building"
                            />
                        </Field>

                        {/* City & Province */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="City" error={errors.city?.message}>
                                <div className="relative">
                                    <input
                                        {...register('city')}
                                        className={inputCls(!!errors.city)}
                                        placeholder="City"
                                    />
                                    {lookingUpCity && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground/50" />
                                    )}
                                </div>
                            </Field>

                            {/* Province — searchable Popover + Command */}
                            <Field label="Province" error={errors.province?.message}>
                                <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            role="combobox"
                                            aria-expanded={provinceOpen}
                                            className={cn(
                                                inputCls(!!errors.province),
                                                'flex items-center justify-between text-left',
                                                !watchProvince && 'text-muted-foreground/40',
                                            )}
                                        >
                                            {watchProvince || 'Select province'}
                                            <ChevronsUpDown className="size-4 opacity-40 shrink-0 ml-1" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Search..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No province found.</CommandEmpty>
                                                <CommandGroup>
                                                    {PROVINCES.map((p) => (
                                                        <CommandItem
                                                            key={p}
                                                            value={p}
                                                            onSelect={() => {
                                                                setValue('province', p, {
                                                                    shouldValidate: true,
                                                                    shouldDirty: true,
                                                                });
                                                                setProvinceOpen(false);
                                                            }}
                                                        >
                                                            {p}
                                                            {watchProvince === p && (
                                                                <Check className="ml-auto size-4 text-[#1c3a2a]" />
                                                            )}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </Field>
                        </div>

                        {/* Postal code & Country */}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Postal code" error={errors.postalCode?.message}>
                                {(() => {
                                    const { onBlur: rhfBlur, ...postalReg } = register('postalCode');
                                    return (
                                        <input
                                            {...postalReg}
                                            onBlur={async (e) => {
                                                await rhfBlur(e);        // RHF validation
                                                await handlePostalBlur(e); // city lookup
                                            }}
                                            className={inputCls(!!errors.postalCode)}
                                            placeholder="4-digit code"
                                            inputMode="numeric"
                                            maxLength={4}
                                        />
                                    );
                                })()}
                            </Field>

                            <Field label="Country">
                                <div className="relative">
                                    <input
                                        disabled
                                        value="South Africa"
                                        className={cn(
                                            inputCls(),
                                            'bg-muted/40 text-muted-foreground cursor-not-allowed pr-9',
                                        )}
                                    />
                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 opacity-25" />
                                </div>
                            </Field>
                        </div>

                        {/* Address type — segmented control */}
                        <Field label="Address type">
                            <div className="flex p-1 rounded-xl border border-border bg-muted/30">
                                {(['shipping', 'billing', 'both'] as AddressType[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() =>
                                            setValue('type', t, { shouldDirty: true })
                                        }
                                        className={cn(
                                            'flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all',
                                            watchType === t
                                                ? 'bg-white text-[#1c3a2a] shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        {t === 'both' ? 'Both' : t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        {/* Primary checkbox */}
                        <label className="flex items-center gap-3 cursor-pointer group w-fit select-none">
                            <Checkbox
                                checked={watchPrimary}
                                onCheckedChange={(v) =>
                                    setValue('isPrimary', !!v, { shouldDirty: true })
                                }
                                className="border-border data-[state=checked]:bg-[#1c3a2a] data-[state=checked]:border-[#1c3a2a]"
                            />
                            <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                Set as primary address
                            </span>
                        </label>
                    </form>
                </div>

                {/* Sticky footer */}
                <SheetFooter className="px-6 py-5 border-t border-border bg-muted/10 shrink-0 sticky bottom-0">
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            type="submit"
                            form="address-form"
                            disabled={!isDirty || !isValid}
                            className={cn(
                                'w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all',
                                isDirty && isValid
                                    ? 'bg-[#1c3a2a] text-white hover:bg-[#152d20] shadow-sm'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50',
                            )}
                        >
                            Save address
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/60 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
