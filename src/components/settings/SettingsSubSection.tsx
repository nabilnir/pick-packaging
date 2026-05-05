"use client";

import React from "react";

interface SettingsSubSectionProps {
    title: string;
    children: React.ReactNode;
}

export function SettingsSubSection({ title, children }: SettingsSubSectionProps) {
    return (
        <div className="border-b border-foreground/[0.07] last:border-0 pb-8 mb-8 last:pb-0 last:mb-0">
            <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-foreground mb-6">
                {title}
            </h3>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}
