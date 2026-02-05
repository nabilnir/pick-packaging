"use client";

import React from 'react';

/**
 * TickerBanner Component
 * 
 * A horizontally scrolling marquee section that matches the "Minimalist Industrial Premium" design.
 * Features the text "Not sure what's possible? Get in touch to find out." separated by arrow icons.
 */
const TickerBanner: React.FC = () => {
    const tickerText = "Not sure what's possible? Get in touch to find out.";

    return (
        <section
            className="relative overflow-hidden border-y border-[#444441] bg-[#333330] py-8 lg:py-12"
            aria-label="Contact Ticker"
        >
            <div className="flex select-none overflow-hidden">
                {/* Animated Marquee Container */}
                <div className="flex animate-marquee whitespace-nowrap">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            <span
                                className="mx-8 text-[32px] font-light tracking-tight text-[#666663] opacity-50 sm:text-[42px] lg:text-[56px] lg:leading-[1.2]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {tickerText}
                            </span>
                            <div className="flex items-center justify-center opacity-40">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-[#666663] lg:h-16 lg:w-16"
                                >
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Duplicate for seamless looping */}
                <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center">
                            <span
                                className="mx-8 text-[32px] font-light tracking-tight text-[#666663] opacity-50 sm:text-[42px] lg:text-[56px] lg:leading-[1.2]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {tickerText}
                            </span>
                            <div className="flex items-center justify-center opacity-40">
                                <svg
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-[#666663] lg:h-16 lg:w-16"
                                >
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        /* Pause on hover for better UX */
        .overflow-hidden:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default TickerBanner;
