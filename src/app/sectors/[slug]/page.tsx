"use client";

import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SECTOR_DATA } from '@/data/sectors';
import Parallax from '@/components/ui/parallax';
import FadeIn from '@/components/ui/fade-in';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

interface PageProps {
    params: {
        slug: string;
    }
}

export default function SectorPage({ params }: PageProps) {
    const sector = SECTOR_DATA.find(s => s.ctaLink.includes(params.slug));

    if (!sector) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 z-0 h-[120%]">
                        <Parallax offset={50} className="w-full h-full">
                            <Image
                                src={sector.image}
                                alt={sector.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </Parallax>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <FadeIn direction="up">
                            <h1 className="text-white font-display text-5xl md:text-7xl mb-6">
                                {sector.title}
                            </h1>
                        </FadeIn>
                        <FadeIn direction="up" delay={0.2}>
                            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light">
                                {sector.description}
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-24 px-4">
                    <div className="container mx-auto max-w-4xl">
                        <FadeIn direction="up">
                            <div className="prose prose-lg max-w-none">
                                <h3 className="text-3xl font-display mb-8 text-foreground">
                                    Specialized Solutions for {sector.shortTitle}
                                </h3>
                                <p className="text-foreground/80 leading-relaxed text-xl font-light">
                                    At PickPacking, we understand the unique challenges of the {sector.title.toLowerCase()} industry.
                                    Our packaging solutions are designed to not only protect your products but also enhance their preservation
                                    and display.
                                </p>
                                {/* Placeholder for specific sector content expansion */}
                                <div className="my-12 p-8 bg-brand-green/5 rounded-2xl border border-brand-green/10">
                                    <h4 className="text-xl font-semibold mb-4 text-brand-green">Why Choose Us?</h4>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-brand-green" />
                                            <span>Industry-compliant materials (FDA, EU 10/2011)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-brand-green" />
                                            <span>Sustainable and recyclable options available</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="w-2 h-2 mt-2 rounded-full bg-brand-green" />
                                            <span>Custom branding and design services</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
