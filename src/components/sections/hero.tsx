"use client";

import React from 'react';
import Image from 'next/image';
import Parallax from '@/components/ui/parallax';

const HeroSection: React.FC = () => {
    // Data for the interactive cards
    const categories = [
        {
            id: 'food-service',
            title: 'Food Service',
            description: 'Deliver meals that look good, travel well and impress customers with attention to detail.',
            link: '/sectors/food-service'
        },
        {
            id: 'food-processing',
            title: 'Food Processing',
            description: 'Take the complexity out of food processing. Streamline production and maintain product quality.',
            link: '/sectors/food-processing'
        },
        {
            id: 'agriculture',
            title: 'Agriculture',
            description: 'Packaging that protects your harvest and is retail-ready. We understand the pace of agriculture.',
            link: '/sectors/agriculture'
        }
    ];

    return (
        <section className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col justify-between transition-colors duration-700">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 h-[120%]">
                <Parallax offset={100} className="w-full h-full">
                    <Image
                        src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/yucca-packaging-homepage-intro-plastic-cups-for-ic-9.jpg"
                        alt="Premium Packaging Background"
                        fill
                        priority
                        className="object-cover object-center opacity-60 grayscale-[20%] contrast-[1.1]"
                        quality={90}
                    />
                    {/* Subtle overlay for readability */}
                    <div className="absolute inset-0 bg-background/20 transition-opacity duration-500" />
                </Parallax>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col justify-start items-start w-full max-w-[1440px] mx-auto px-8 md:px-16 pt-[180px] md:pt-[220px]">
                <h1 className="max-w-[1000px] text-foreground font-display font-light tracking-tight leading-[1.05] text-[clamp(3.5rem,8vw,6.5rem)] text-balance">
                    Packaging that Performs. Innovated for Industry Leaders.
                </h1>
            </div>

            {/* Bottom Interface / Interactive Cards */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-8 md:px-16 pb-12 md:pb-20 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative overflow-hidden rounded-xl border border-foreground/10 bg-white/30 backdrop-blur-md transition-all duration-500 hover:bg-white/50 hover:shadow-lg"
                        >
                            <div className="p-8 h-[200px] flex flex-col justify-end transition-all duration-500">
                                <h3 className="text-[24px] font-display font-light text-foreground mb-2 uppercase tracking-wide">
                                    {category.title}
                                </h3>

                                <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-[200px] group-hover:opacity-100">
                                    <p className="text-[14px] text-foreground/80 font-light leading-relaxed mb-6">
                                        {category.description}
                                    </p>
                                    <a
                                        href={category.link}
                                        className="inline-flex items-center text-[12px] uppercase tracking-widest font-bold text-foreground group/link"
                                    >
                                        Tell me more
                                        <span className="ml-2 transform transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Fade Gradient */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background via-background/20 to-transparent z-[5]" />
        </section>
    );
};

export default HeroSection;