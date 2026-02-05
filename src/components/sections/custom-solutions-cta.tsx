import React from 'react';
import Image from 'next/image';

const CustomSolutionsCTA = () => {
    return (
        <section className="bg-brand-green py-32 md:py-48 relative overflow-hidden transition-colors duration-500">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                    {/* Left Content Area */}
                    <div className="w-full lg:w-3/5 z-10">
                        <span className="text-[13px] font-bold uppercase tracking-[0.3em] text-brand-olive/60 block mb-10">
                            Custom Solutions
                        </span>
                        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] font-light text-brand-olive max-w-[900px] text-balance font-display">
                            Brands that thrive invest in custom-designed packaging. Let us help bring your vision to life.
                        </h2>
                    </div>

                    {/* Right Mockup Area */}
                    <div className="w-full lg:w-2/5 relative flex justify-end">
                        <div className="relative w-full aspect-square max-w-[500px] group">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/1c9fd89a470793175cfc7f14a7a6e6dc-10.webp"
                                alt="Custom Packaging Mockup"
                                fill
                                className="object-contain opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle background detail */}
            <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-10">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-brand-olive/20 to-transparent" />
            </div>
        </section>
    );
};

export default CustomSolutionsCTA;