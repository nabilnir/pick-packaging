import React from 'react';
import Image from 'next/image';

/**
 * VisionCTA component:
 * - Theme: Dark (#2B2B28 background)
 * - Text: Brands that thrive invest in custom-designed packaging...
 * - Image: Clear packaging render (Asset provided)
 */
export default function VisionCTA() {
    return (
        <section className="bg-brand-green py-[120px] md:py-[180px] overflow-hidden relative transition-colors duration-500">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-12 md:gap-8">

                    {/* Text Content */}
                    <div className="md:col-span-8 lg:col-span-7">
                        <span className="text-brand-olive text-[14px] font-medium uppercase tracking-widest mb-10 block opacity-60">
                            Custom Solutions
                        </span>
                        <h2 className="text-brand-olive text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1.1] tracking-tight max-w-[850px]">
                            Brands that thrive invest in custom-designed packaging. Let us help bring your vision to life.
                        </h2>
                    </div>

                    {/* Visual Content */}
                    <div className="md:col-span-4 lg:col-span-5 flex justify-center md:justify-end relative">
                        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
                            {/* Product Image - Render of clear packaging */}
                            <div className="relative w-full h-full transform translate-x-10 translate-y-4 md:translate-x-32 scale-125 md:scale-[1.7] origin-center pointer-events-none">
                                <Image
                                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/yucca-packaging-for-cold-warm-hot-food-6.jpg"
                                    alt="Custom designed clear packaging render"
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="opacity-95 contrast-125 brightness-110"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Decorative hairline border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-olive/5"></div>
        </section>
    );
}
