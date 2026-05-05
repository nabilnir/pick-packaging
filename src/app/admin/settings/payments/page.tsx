"use client";

import React, { useEffect, useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsSubSection } from "@/components/settings/SettingsSubSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockPaymentSettings, mockInvoiceSettings } from "@/lib/settings/mock-data";
import { useSettingsDirty } from "../layout";
import { useToast } from "@/components/ui/toast-provider";
import { ExternalLink, CreditCard } from "lucide-react";

const PaymentsSchema = z.object({
    defaultCurrency: z.string(),
    vatRate: z.coerce.number().min(0).max(100),
    pricesDisplay: z.enum(["Excluding VAT", "Including VAT"]),
    invoicePrefix: z.string().max(6, "Max 6 chars"),
    invoiceNumberFormat: z.enum(["sequential", "date-prefixed"]),
    invoiceFooterNote: z.string().max(200),
    companyBankDetails: z.string()
});
type PaymentsForm = z.infer<typeof PaymentsSchema>;

export default function PaymentsSettingsPage() {
    const { setIsDirty } = useSettingsDirty();
    const { success } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<PaymentsForm>({
        resolver: zodResolver(PaymentsSchema),
        defaultValues: {
            ...mockPaymentSettings,
            ...mockInvoiceSettings
        }
    });

    useEffect(() => {
        setIsDirty(isDirty);
    }, [isDirty, setIsDirty]);

    const onSubmit = async (data: PaymentsForm) => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 600));
        setIsSaving(false);
        reset(data);
        success("Payment settings saved");
    };

    return (
        <SettingsSection
            title="Payments & Billing"
            description="Manage taxes, invoice generation, and view active payment gateways."
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={handleSubmit(onSubmit)}
            onReset={() => reset()}
        >
            {/* Currency & Tax */}
            <SettingsSubSection title="Currency & Tax">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Default Currency</Label>
                        <Controller name="defaultCurrency" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                    <SelectItem value="ZAR">ZAR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                        <p className="text-[11px] text-foreground/40 mt-1">Synced with General Settings.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">VAT Rate (%)</Label>
                        <Input {...register("vatRate")} type="number" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                        {errors.vatRate && <p className="text-[11px] text-red-500 mt-1">{errors.vatRate.message}</p>}
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-[12px] font-medium text-foreground/70">Prices Display</Label>
                    <Controller name="pricesDisplay" control={control} render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Excluding VAT" id="r1" className="text-teal-600 border-foreground/30" />
                                <Label htmlFor="r1" className="font-normal text-[13px]">Excluding VAT</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Including VAT" id="r2" className="text-teal-600 border-foreground/30" />
                                <Label htmlFor="r2" className="font-normal text-[13px]">Including VAT</Label>
                            </div>
                        </RadioGroup>
                    )} />
                </div>
            </SettingsSubSection>

            {/* Invoice Settings */}
            <SettingsSubSection title="Invoice Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Invoice Prefix</Label>
                        <Input {...register("invoicePrefix")} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                        <p className="text-[11px] text-foreground/40 mt-1">Preview: PP-00142</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Number Format</Label>
                        <Controller name="invoiceNumberFormat" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                    <SelectItem value="sequential">Sequential (001, 002)</SelectItem>
                                    <SelectItem value="date-prefixed">Date Prefixed (202405-01)</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-foreground/70">Company Bank Details</Label>
                    <Textarea {...register("companyBankDetails")} rows={3} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02] resize-none" placeholder="Bank: Standard Bank&#10;Account: 1029384756" />
                </div>

                <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-foreground/70">Invoice Footer Note</Label>
                    <Input {...register("invoiceFooterNote")} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                </div>
            </SettingsSubSection>

            {/* Gateway Read-only */}
            <SettingsSubSection title="Payment Gateway">
                <div className="rounded-xl border border-foreground/[0.07] bg-foreground/[0.02] p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-background border border-foreground/[0.07] flex items-center justify-center shrink-0">
                            <CreditCard size={18} className="text-foreground/60" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-[14px] font-medium text-foreground">Peach Payments</h4>
                                <span className="text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Connected</span>
                            </div>
                            <p className="text-[11px] text-foreground/40">Last transaction: Today at 09:41 AM</p>
                        </div>
                    </div>
                    <button className="text-[12px] font-medium text-foreground hover:text-foreground/70 flex items-center gap-1.5 transition-colors">
                        Manage gateway <ExternalLink size={12} />
                    </button>
                </div>
                <p className="text-[11px] text-foreground/40 mt-3 flex gap-2">
                    <span className="font-semibold">Note:</span> Payment gateway credentials are managed via environment variables and cannot be edited here.
                </p>
            </SettingsSubSection>

        </SettingsSection>
    );
}
