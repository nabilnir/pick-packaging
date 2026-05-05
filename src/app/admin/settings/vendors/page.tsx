"use client";

import React, { useEffect, useState } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsSubSection } from "@/components/settings/SettingsSubSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockVendorPolicy } from "@/lib/settings/mock-data";
import { useSettingsDirty } from "../layout";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

const VendorSchema = z.object({
    requireVerification: z.boolean(),
    autoApproveDomains: z.boolean(),
    allowedDomains: z.string(),
    requiredDocuments: z.array(z.string()),
    defaultSlaHours: z.coerce.number().min(1),
    autoSuspendBreachRate: z.coerce.number().min(1).max(100),
    notifySlaDeadlineHours: z.coerce.number().min(1),
    allowedSectors: z.array(z.string()),
    onboardingMessage: z.string()
});
type VendorForm = z.infer<typeof VendorSchema>;

const DOC_TYPES = ["Business registration", "Tax certificate", "Bank letter", "Product catalogue", "ISO certification"];
const SECTORS = ["Food Service", "Agriculture", "Industrial", "Pharmaceutical", "Retail", "Other"];

export default function VendorsSettingsPage() {
    const { setIsDirty } = useSettingsDirty();
    const { success } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, control, reset, watch, formState: { isDirty } } = useForm<VendorForm>({
        resolver: zodResolver(VendorSchema),
        defaultValues: mockVendorPolicy
    });

    const autoApprove = watch("autoApproveDomains");

    useEffect(() => {
        setIsDirty(isDirty);
    }, [isDirty, setIsDirty]);

    const onSubmit = async (data: VendorForm) => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 600));
        setIsSaving(false);
        reset(data);
        success("Vendor policy saved");
    };

    return (
        <SettingsSection
            title="Vendor Policy"
            description="Manage onboarding rules, SLA targets, and verification requirements."
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={handleSubmit(onSubmit)}
            onReset={() => reset()}
        >
            <SettingsSubSection title="Verification Policy">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-foreground/[0.07] bg-foreground/[0.01]">
                        <div className="space-y-0.5">
                            <Label className="text-[13px] font-medium text-foreground">Require verification</Label>
                            <p className="text-[11px] text-foreground/50">Vendors cannot list products until manually approved.</p>
                        </div>
                        <Controller name="requireVerification" control={control} render={({ field }) => (
                            <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-teal-600" />
                        )} />
                    </div>

                    <div className="flex flex-col p-4 rounded-xl border border-foreground/[0.07] bg-foreground/[0.01] gap-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-[13px] font-medium text-foreground">Auto-approve domains</Label>
                                <p className="text-[11px] text-foreground/50">Automatically verify vendors signing up from trusted email domains.</p>
                            </div>
                            <Controller name="autoApproveDomains" control={control} render={({ field }) => (
                                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-teal-600" />
                            )} />
                        </div>
                        {autoApprove && (
                            <div className="pt-2 border-t border-foreground/[0.05]">
                                <Label className="text-[11px] text-foreground/50 mb-2 block">Allowed domains (comma separated)</Label>
                                <Input {...register("allowedDomains")} placeholder="e.g. apex.com, globalpoly.co.za" className="rounded-lg h-8 text-[12px] border-foreground/[0.1] bg-background" />
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        <Label className="text-[13px] font-medium text-foreground block mb-3">Required Documents</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Controller name="requiredDocuments" control={control} render={({ field }) => (
                                <>
                                    {DOC_TYPES.map(doc => (
                                        <div key={doc} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`doc-${doc}`}
                                                checked={field.value.includes(doc)}
                                                onCheckedChange={(checked) => {
                                                    const current = new Set(field.value);
                                                    if (checked) current.add(doc);
                                                    else current.delete(doc);
                                                    field.onChange(Array.from(current));
                                                }}
                                                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                            />
                                            <Label htmlFor={`doc-${doc}`} className="text-[12px] font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {doc}
                                            </Label>
                                        </div>
                                    ))}
                                </>
                            )} />
                        </div>
                    </div>
                </div>
            </SettingsSubSection>

            <SettingsSubSection title="SLA & Performance">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Default SLA (Hours)</Label>
                        <Input {...register("defaultSlaHours")} type="number" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Auto-suspend Breach (%)</Label>
                        <Input {...register("autoSuspendBreachRate")} type="number" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Notify Before (Hours)</Label>
                        <Input {...register("notifySlaDeadlineHours")} type="number" className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" />
                    </div>
                </div>
            </SettingsSubSection>

            <SettingsSubSection title="Allowed Sectors">
                <Controller name="allowedSectors" control={control} render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                        {SECTORS.map(sec => {
                            const active = field.value.includes(sec);
                            return (
                                <button
                                    key={sec}
                                    type="button"
                                    onClick={() => {
                                        const current = new Set(field.value);
                                        if (active) current.delete(sec);
                                        else current.add(sec);
                                        field.onChange(Array.from(current));
                                    }}
                                    className={cn(
                                        "text-[11px] font-medium px-4 py-2 rounded-full transition-colors border",
                                        active ? "bg-teal-600 text-white border-teal-600" : "bg-foreground/[0.02] border-foreground/[0.1] text-foreground/60 hover:border-foreground/30 hover:text-foreground"
                                    )}
                                >
                                    {sec}
                                </button>
                            );
                        })}
                    </div>
                )} />
            </SettingsSubSection>

            <SettingsSubSection title="Onboarding Message">
                <div className="space-y-2">
                    <Textarea {...register("onboardingMessage")} rows={4} className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02] resize-none" />
                    <p className="text-[11px] text-foreground/40 mt-1">Shown to new vendors on their first login. Markdown supported.</p>
                </div>
            </SettingsSubSection>

        </SettingsSection>
    );
}
