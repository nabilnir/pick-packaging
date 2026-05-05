"use client";

import React, { useState, useEffect } from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockNotificationMatrix } from "@/lib/settings/mock-data";
import { NotificationEvent, NotificationMatrix } from "@/types/settings";
import { useSettingsDirty } from "../layout";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

const EVENTS = Object.keys(mockNotificationMatrix) as NotificationEvent[];

export default function NotificationsSettingsPage() {
    const { setIsDirty } = useSettingsDirty();
    const { success } = useToast();
    
    const [matrix, setMatrix] = useState<NotificationMatrix>(mockNotificationMatrix);
    const [email, setEmail] = useState("admin@pickpackaging.com");
    const [digest, setDigest] = useState("Weekly");
    const [isSaving, setIsSaving] = useState(false);
    
    // Simple dirty check
    const [isDirty, setLocalDirty] = useState(false);
    
    const handleToggle = (event: NotificationEvent, channel: 'Email' | 'In-app') => {
        setMatrix(prev => ({
            ...prev,
            [event]: { ...prev[event], [channel]: !prev[event][channel] }
        }));
        setLocalDirty(true);
    };

    const handleRowToggle = (event: NotificationEvent) => {
        setMatrix(prev => {
            const row = prev[event];
            const allOn = row.Email && row['In-app'];
            return {
                ...prev,
                [event]: { Email: !allOn, 'In-app': !allOn }
            };
        });
        setLocalDirty(true);
    };

    useEffect(() => {
        setIsDirty(isDirty);
    }, [isDirty, setIsDirty]);

    const onSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 600));
        setIsSaving(false);
        setLocalDirty(false);
        success("Notification preferences saved");
    };

    const onReset = () => {
        setMatrix(mockNotificationMatrix);
        setEmail("admin@pickpackaging.com");
        setDigest("Weekly");
        setLocalDirty(false);
    };

    return (
        <SettingsSection
            title="Notifications"
            description="Configure which events trigger alerts and where they are delivered."
            isDirty={isDirty}
            isSaving={isSaving}
            onSave={onSave}
            onReset={onReset}
        >
            <div className="space-y-8">

                {/* Matrix */}
                <div className="overflow-x-auto border border-foreground/[0.07] rounded-xl">
                    <table className="w-full text-left text-[13px]">
                        <thead>
                            <tr className="border-b border-foreground/[0.06] bg-foreground/[0.02]">
                                <th className="px-4 py-3 font-medium text-foreground/60">Event</th>
                                <th className="px-4 py-3 font-medium text-foreground/60 text-center w-24">Email</th>
                                <th className="px-4 py-3 font-medium text-foreground/60 text-center w-24">In-app</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/[0.04]">
                            {EVENTS.map(ev => (
                                <tr key={ev} className="hover:bg-foreground/[0.01]">
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => handleRowToggle(ev)}
                                            className="text-foreground hover:text-foreground/70 transition-colors text-left"
                                        >
                                            {ev}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Switch 
                                            checked={matrix[ev].Email} 
                                            onCheckedChange={() => handleToggle(ev, 'Email')} 
                                            className={cn("data-[state=checked]:bg-teal-600")}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Switch 
                                            checked={matrix[ev]['In-app']} 
                                            onCheckedChange={() => handleToggle(ev, 'In-app')} 
                                            className={cn("data-[state=checked]:bg-teal-600")}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Settings below matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-foreground/[0.07]">
                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Notification email</Label>
                        <Input 
                            value={email} 
                            onChange={e => { setEmail(e.target.value); setLocalDirty(true); }}
                            className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]" 
                        />
                        <p className="text-[11px] text-foreground/40 mt-1">Default address for system alerts.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[12px] font-medium text-foreground/70">Digest frequency</Label>
                        <Select value={digest} onValueChange={(v) => { setDigest(v); setLocalDirty(true); }}>
                            <SelectTrigger className="rounded-xl border-foreground/[0.1] bg-foreground/[0.02]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-foreground/[0.07] bg-background">
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Never">Never</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[11px] text-foreground/40 mt-1">For the weekly summary digest event.</p>
                    </div>
                </div>

            </div>
        </SettingsSection>
    );
}
