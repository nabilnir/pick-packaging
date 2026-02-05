"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SubpageHeroProps {
    title: string;
    description?: string;
    image?: string;
    className?: string;
}

const SubpageHero = ({ title, description, image = "/images/hero_bg.png", className }: SubpageHeroProps) => {
    return (
        <section className={cn("relative h-[45vh] min-h-[450px] w-full bg-background overflow-hidden flex items-center transition-colors duration-500", className)}>
            <div className="absolute inset-0 z-0 opacity-20 grayscale">
                <Image
                    src={image}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                />
            </div>
            <div className="container mx-auto relative z-10 pt-24">
                <div className="max-w-4xl animate-fade-in-up">
                    <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-light text-foreground mb-8 uppercase tracking-widest leading-[1.1] font-display">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-[1.25rem] text-foreground/70 font-light max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SubpageHero;
