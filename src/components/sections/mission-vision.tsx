import React from 'react';

/**
 * MissionVisionSection
 * 
 * Clones the "Committed to Excellence" section featuring mission and vision statements 
 * in a clean grid layout with bullet point indicators and an "About us" button.
 * 
 * Theme: Dark (#4A4843)
 * Font: Inter (Light/300)
 */
export default function MissionVisionSection() {
    return (
        <section className="bg-background text-foreground py-32 md:py-48 px-8 md:px-16 overflow-hidden transition-colors duration-500">
            <div className="max-w-[1440px] mx-auto">

                {/* Header Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-start mb-32">
                    <div className="max-w-2xl">
                        <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-light leading-[1] tracking-tight text-foreground font-display">
                            Committed to Excellence,<br />always Innovating
                        </h2>
                    </div>
                    <div className="flex flex-col items-start gap-10">
                        <p className="text-foreground/70 text-[20px] font-light leading-relaxed max-w-sm">
                            Remarkable packaging is our promise to you. What doesn’t meet PickPacking standards is refined until it does.
                        </p>
                        <a
                            href="/about"
                            className="px-10 py-3.5 bg-foreground text-background text-[13px] font-semibold rounded-[4px] hover:bg-brand-green hover:text-white transition-all duration-500 tracking-widest uppercase"
                        >
                            About us
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-foreground/10 mb-24"></div>

                {/* Mission/Vision Grid */}
                <div className="space-y-32">

                    {/* Mission Item */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-32 items-start">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                            <h3 className="text-3xl font-light tracking-tight text-foreground font-display">Our Mission</h3>
                        </div>
                        <div>
                            <p className="text-foreground/80 text-[20px] font-light leading-relaxed max-w-[600px]">
                                We provide world-class, compliant packaging from trusted global partners to food service, food processing, and agricultural businesses across the globe.
                            </p>
                        </div>
                    </div>

                    {/* Vision Item */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-32 items-start">
                        <div className="flex items-center gap-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                            <h3 className="text-3xl font-light tracking-tight text-foreground font-display">Our Vision</h3>
                        </div>
                        <div>
                            <p className="text-foreground/80 text-[20px] font-light leading-relaxed max-w-[600px]">
                                To be the trusted, industry-leading packaging supplier, known for ethical practices, reliable supply and dedication to sustainable innovation.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
