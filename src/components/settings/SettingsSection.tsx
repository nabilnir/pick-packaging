"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface SettingsSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
    isDirty?: boolean;
    onSave?: () => void;
    onReset?: () => void;
    isSaving?: boolean;
}

export function SettingsSection({
    title,
    description,
    children,
    isDirty,
    onSave,
    onReset,
    isSaving
}: SettingsSectionProps) {
    return (
        <div className="max-w-[720px] mx-auto w-full pb-10">
            <div className="mb-6">
                <h2 className="font-display text-[1.5rem] font-light text-foreground tracking-tight">{title}</h2>
                <p className="text-[14px] font-light text-foreground/60 mt-1">
                    {description}
                </p>
            </div>
            <div className="bg-background border border-foreground/[0.07] rounded-2xl overflow-hidden relative">
                <div className="p-6">
                    {children}
                </div>
                {(onSave || onReset) && (
                    <div className="sticky bottom-0 border-t border-foreground/[0.07] bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-end gap-3 z-10">
                        {onReset && (
                            <Button 
                                variant="ghost" 
                                onClick={onReset} 
                                disabled={!isDirty || isSaving}
                                className="text-foreground/60 hover:text-foreground text-[12px] font-medium"
                            >
                                Reset
                            </Button>
                        )}
                        {onSave && (
                            <Button 
                                onClick={onSave} 
                                disabled={!isDirty || isSaving}
                                className="bg-foreground text-background hover:bg-foreground/90 text-[12px] font-medium px-6 rounded-xl"
                            >
                                {isSaving ? "Saving..." : "Save changes"}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
