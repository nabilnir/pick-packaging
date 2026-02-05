"use client";

import React from "react";

const ScrollingTicker = () => {
    const tickerText = "Not sure what's possible? Get in touch to find out.";

    // Create an array of items to ensure seamless infinite loop
    // We'll repeat the content enough times to cover the screen width
    const items = Array(10).fill(null);

    return (
        <section className="relative w-full overflow-hidden bg-background py-8 md:py-16 border-y border-foreground/10 transition-colors duration-500">
            <div className="flex whitespace-nowrap">
                <div className="flex animate-marquee items-center">
                    {items.map((_, index) => (
                        <div key={`ticker-1-${index}`} className="flex items-center mx-6 md:mx-10 select-none">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-6 md:mr-10 transform -rotate-45 text-foreground/30"
                            >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                            <span className="text-[1.5rem] md:text-[3rem] font-light tracking-tight text-foreground font-display">
                                {tickerText}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Duplicate for infinite loop */}
                <div className="flex animate-marquee items-center" aria-hidden="true">
                    {items.map((_, index) => (
                        <div key={`ticker-2-${index}`} className="flex items-center mx-6 md:mx-10 select-none">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-6 md:mr-10 transform -rotate-45 text-foreground/30"
                            >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                            <span className="text-[1.5rem] md:text-[3rem] font-light tracking-tight text-foreground font-display">
                                {tickerText}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ScrollingTicker;
