"use client";

import React from 'react';

/**
 * IndustryIntroduction Component
 * 
 * Clones the introductory section with centered text and a call-to-action button.
 * Adheres to the "Industrial Minimalist" design system.
 * 
 * Design Details:
 * - Background: #4A4843 (Primary Background)
 * - Text: #FFFFFF (Primary Text) for headings, #BAB7AE (Secondary Text) for descriptions
 * - Fonts: Inter (Sans-Serif), Light weight (300) for headers
 * - Spacing: Section padding 120px
 */
const IndustryIntroduction: React.FC = () => {
    return (
        <section className="bg-background py-32 md:py-48 flex flex-col items-center justify-center overflow-hidden transition-colors duration-500">
            <div className="container mx-auto max-w-[1440px]">
                <div className="max-w-[850px] mx-auto text-center flex flex-col items-center">
                    {/* Main Heading Statement */}
                    <h2 className="text-foreground text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] tracking-tight mb-12 text-balance font-display">
                        Set the standard for packaging excellence in your industry. Let us help you make your products memorable.
                    </h2>

                    {/* Call to Action Button */}
                    <div className="mt-4">
                        <a
                            href="/shop"
                            className="bg-foreground text-background px-10 py-4 rounded-[4px] text-[14px] font-semibold tracking-widest inline-flex items-center justify-center transition-all duration-500 hover:bg-brand-green hover:text-white active:scale-[0.98] cursor-pointer no-underline uppercase"
                        >
                            See products
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IndustryIntroduction;