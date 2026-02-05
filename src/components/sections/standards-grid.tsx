import React from 'react';
import FadeIn from '../ui/fade-in';

const StandardsGrid = () => {
    const leftColumnStandards = [
        'FDA',
        'BRCGS',
        'GRS',
        'DIN CERTCO',
        'TÜV OK Compost Industrial',
        'ISO 14001',
        'ISO 45001',
    ];

    const rightColumnStandards = [
        'EU 10/2011',
        'FSC',
        'BPI',
        'TÜV OK Compost Home',
        'ISO 9001',
        'ISO 22000',
        'FSSC 22000',
    ];

    return (
        <section className="bg-background pt-0 pb-4 md:pb-8 overflow-hidden font-sans transition-colors duration-500">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 items-start mb-24 lg:mb-32">
                    <div className="max-w-[600px]">
                        <FadeIn direction="up">
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] tracking-tight text-foreground font-display">
                                Factory & Product Standards
                            </h2>
                        </FadeIn>
                    </div>
                    <div className="max-w-[540px] lg:pt-6">
                        <FadeIn direction="up" delay={0.2}>
                            <p className="text-[20px] font-light leading-relaxed text-foreground/70">
                                Our partners share our commitment to responsible practices, so you can trust that every product is held to the highest standards.
                            </p>
                        </FadeIn>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-48 font-display">
                    {/* Left Column */}
                    <ul className="space-y-0 text-foreground">
                        {leftColumnStandards.map((item, index) => (
                            <FadeIn key={index} direction="right" delay={index * 0.1}>
                                <li className="flex items-center gap-6 py-6 md:py-8 border-b border-foreground/10 last:border-b-0 md:last:border-b transition-colors duration-300 hover:text-brand-green group">
                                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green shrink-0 transition-transform duration-300 group-hover:scale-125" />
                                    <span className="text-[20px] md:text-[28px] font-light uppercase tracking-widest">
                                        {item}
                                    </span>
                                </li>
                            </FadeIn>
                        ))}
                    </ul>

                    {/* Right Column */}
                    <ul className="space-y-0 text-foreground">
                        {rightColumnStandards.map((item, index) => (
                            <FadeIn key={index} direction="right" delay={(index + leftColumnStandards.length) * 0.1}>
                                <li className="flex items-center gap-6 py-6 md:py-8 border-b border-foreground/10 last:border-b-0 transition-colors duration-300 hover:text-brand-green group">
                                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green shrink-0 transition-transform duration-300 group-hover:scale-125" />
                                    <span className="text-[20px] md:text-[28px] font-light uppercase tracking-widest">
                                        {item}
                                    </span>
                                </li>
                            </FadeIn>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default StandardsGrid;