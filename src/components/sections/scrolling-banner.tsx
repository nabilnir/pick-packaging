"use client";

import React from 'react';

const ScrollingBanner = () => {
    const items = [
        "Quality",
        "Branding",
        "PickPacking Rewards",
        "PickPacking Direct (B2B)",
        "Custom Packaging",
        "Sustainable",
        "Innovation",
        "Partnerships",
        "Custom Solutions",
    ];

    const duplicatedItems = [...items, ...items, ...items];

    return (
        <section
            className="relative w-full overflow-hidden bg-background py-4 md:py-8 border-y border-foreground/5 transition-colors duration-500"
            aria-hidden="true"
        >
            <div className="marquee-container flex select-none overflow-hidden">
                <div className="marquee-content flex min-w-full shrink-0 items-center justify-around gap-12">
                    {duplicatedItems.map((item, index) => (
                        <span
                            key={index}
                            className="text-[clamp(2.5rem,8vw,6.5rem)] font-display font-light leading-none tracking-tight whitespace-nowrap opacity-30 px-6"
                            style={{
                                WebkitTextStroke: '1px var(--foreground-rgb)',
                                color: 'transparent',
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>
                <div className="marquee-content flex min-w-full shrink-0 items-center justify-around gap-12">
                    {duplicatedItems.map((item, index) => (
                        <span
                            key={`second-${index}`}
                            className="text-[clamp(2.5rem,8vw,6.5rem)] font-display font-light leading-none tracking-tight whitespace-nowrap opacity-30 px-6"
                            style={{
                                WebkitTextStroke: '1px var(--foreground-rgb)',
                                color: 'transparent',
                            }}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ScrollingBanner;
