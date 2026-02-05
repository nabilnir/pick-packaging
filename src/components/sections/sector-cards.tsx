"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { SECTOR_DATA } from '@/data/sectors';

export default function SectorCards() {
    return (
        <section className="relative w-full bg-background transition-colors duration-500">
            {/* Intro Text Section */}
            <div className="container mx-auto py-20 md:py-32 flex flex-col items-center text-center">
                <p className="text-[20px] md:text-[28px] font-light text-foreground max-w-[850px] leading-snug font-display">
                    Set the standard for packaging excellence in your industry. Let us help you make your products memorable.
                </p>
                <div className="mt-10">
                    <a
                        href="/shop"
                        className="inline-block px-10 py-4 bg-foreground text-background text-[13px] uppercase tracking-widest font-semibold rounded-[4px] hover:bg-brand-green hover:text-white transition-all duration-300"
                    >
                        See products
                    </a>
                </div>
            </div>

            {/* Grid Section */}
            <div className="w-full flex flex-col md:flex-row min-h-[700px]">
                {SECTOR_DATA.map((sector, index) => (
                    <SectorCard
                        key={sector.id}
                        title={sector.title}
                        description={sector.description}
                        image={sector.image}
                    />
                ))}
            </div>
        </section>
    );
}

const SectorCard = ({ title, description, image }: { title: string, description: string, image: string }) => {
    return (
        <div className="group relative w-full h-[700px] overflow-hidden flex flex-col justify-end">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-brand-green/20 group-hover:bg-brand-green/10 transition-colors duration-500" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 md:p-8">
                {/* Transparent Title (always visible when not active) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-[32px] md:text-[48px] font-light text-white tracking-widest uppercase text-center px-4 drop-shadow-2xl">
                        {title}
                    </h3>
                </div>

                {/* Info Card (Active/Hover state) */}
                <div className={`
          absolute left-0 bottom-0 w-full md:w-[420px] m-4 md:m-10
          bg-brand-green/95 backdrop-blur-md p-10 flex flex-col gap-6 rounded-xl
          transition-all duration-700 ease-in-out
          opacity-0 translate-y-8 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
        `}>
                    <h3 className="text-[32px] font-light text-brand-olive leading-tight font-display">
                        {title}
                    </h3>

                    <p className="text-[17px] font-light text-brand-olive/80 leading-relaxed max-w-[340px]">
                        {description}
                    </p>

                    <div className="pt-6 mt-auto border-t border-brand-olive/10">
                        <a
                            href={`/sectors/${title.toLowerCase().split(' ')[0]}`}
                            className="flex items-center justify-between group/link"
                        >
                            <span className="text-[12px] uppercase tracking-widest font-bold text-brand-olive transition-transform group-hover/link:translate-x-1 duration-300">
                                Tell me more
                            </span>
                            <div className="w-10 h-10 rounded-full border border-brand-olive/20 flex items-center justify-center group-hover/link:bg-brand-olive group-hover/link:border-brand-olive transition-all duration-300">
                                <ArrowRight className="w-4 h-4 text-brand-olive group-hover/link:text-brand-green transition-colors duration-300" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
