"use client";

import React from 'react';

interface RiderPageHeaderProps {
    title: string;
    subtitle: string;
}

export function RiderPageHeader({ title, subtitle }: RiderPageHeaderProps) {
    return (
        <div className="mb-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/35 mb-1">
                Rider Portal · Sector 4
            </p>
            <h1 className="font-display text-[2rem] font-light text-foreground tracking-tight">
                {title}
            </h1>
            <p className="text-[14px] font-light text-foreground/45 mt-1">
                {subtitle}
            </p>
        </div>
    );
}
