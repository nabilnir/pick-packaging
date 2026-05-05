"use client";

import React, { useEffect, useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockGeneralSettings } from "@/lib/settings/mock-data";
import { useSettingsDirty } from "../layout";
import { useToast } from "@/components/ui/toast-provider";
import { ImagePlus } from "lucide-react";

const GeneralSettingsSchema = z.object({
    platformName: z.string().min(1, "Required").max(60, "Max 60 characters"),
    supportEmail: z.string().email("Invalid email address"),
    businessAddress: z.string().optional(),
    vatNumber: z.string().optional(),
    defaultCurrency: z.string().min(1, "Required"),
    timezone: z.string().min(1, "Required"),
    dateFormat: z.string().min(1, "Required"),
});

type GeneralSettingsForm = z.infer<typeof GeneralSettingsSchema>;

const IANA_TIMEZONES = [
    "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi",
    "America/New_York", "America/Los_Angeles", "America/Sao_Paulo",
    "Asia/Tokyo", "Asia/Dubai", "Asia/Singapore",
    "Europe/London", "Europe/Paris", "Europe/Berlin",
    "Australia/Sydney"
];

export default function GeneralSettingsPage() {
    const { setIsDirty } = useSettingsDirty();
    const { success } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<GeneralSettingsForm>({
        resolver: zodResolver(GeneralSettingsSchema),
        defaultValues: {
            platformName: mockGeneralSettings.platformName,
            supportEmail: mockGeneralSettings.supportEmail,
            businessAddress: mockGeneralSettings.businessAddress,
            vatNumber: mockGeneralSettings.vatNumber,
            defaultCurrency: mockGeneralSettings.defaultCurrency,
            timezone: mockGeneralSettings.timezone,
            dateFormat: mockGeneralSettings.dateFormat,
        }
    });

    useEffect(() => {
        setIsDirty(isDirty);
    }, [isDirty, setIsDirty]);

    const onSubmit = async (data: GeneralSettingsForm) => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 800));
        setIsSaving(false);
        reset(data); // reset to new pristine values
        success("General settings saved successfully");
    };

    return (
        <SettingsSection
            title="General"
            description="Manage your primary platform details, branding, and localization preferences."
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={handleSubmit(onSubmit)}
            onReset={() => reset()}
        >
            <div className="space-y-6">
                
                {/* Logo Upload (Mock) */}
                <div className="flex items-center gap-6 pb-6 border-b border-foreground/[0.07]">
                    <div className="w-20 h-20 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0 border border-foreground/[0.06]">
                        <span className="font-display font-medium text-[24px] text-foreground/40">P</span>
                    </div>
                    <div>
                        <h4 className="text-[13px] font-medium text-foreground mb-1">Platform logo</h4>
                        <p className="text-[12px] font-light text-foreground/50 mb-3">
                            PNG, JPG, or SVG up to 2MB. Square format recommended.
                        </p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-foreground/[0.04] hover:bg-foreground/[0.08] transition-colors border border-foreground/[0.06] rounded-xl text-[12px] font-medium">
                            <ImagePlus size={14} /> Change logo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Platform Name</Label>
                        <Input {...register("platformName")} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                        {errors.platformName && <p className="text-[12px] text-red-500 mt-1">{errors.platformName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Support Email</Label>
                        <Input {...register("supportEmail")} type="email" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                        {errors.supportEmail && <p className="text-[12px] text-red-500 mt-1">{errors.supportEmail.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-foreground/70">Business Address</Label>
                    <Textarea {...register("businessAddress")} rows={3} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02] resize-none" />
                </div>

                <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-foreground/70">VAT number (optional)</Label>
                    <Input {...register("vatNumber")} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Default Currency</Label>
                        <Controller name="defaultCurrency" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                    <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Timezone</Label>
                        <Controller name="timezone" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background max-h-[300px]">
                                    {IANA_TIMEZONES.map(tz => (
                                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )} />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Date Format</Label>
                        <Controller name="dateFormat" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                </div>

            </div>
        </SettingsSection>
    );
}
