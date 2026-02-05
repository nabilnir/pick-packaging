import React from 'react';
import Image from 'next/image';

const CustomSolutionsBanner = () => {
    return (
        <section
            className="relative w-full overflow-hidden"
            style={{
                backgroundColor: '#2a2a28',
                paddingTop: '120px',
                paddingBottom: '120px',
                borderTop: '1px solid #444441'
            }}
        >
            <div className="container mx-auto max-w-[1440px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
                    {/* Text Content */}
                    <div className="lg:col-span-7 flex flex-col items-start z-10">
                        <span
                            className="text-label-caps mb-8"
                            style={{
                                color: '#999996',
                                fontSize: '14px',
                                fontWeight: 500,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}
                        >
                            Custom Solutions
                        </span>
                        <h2
                            className="text-h2"
                            style={{
                                color: '#999996',
                                fontSize: 'clamp(2rem, 5vw, 3rem)',
                                lineHeight: '1.2',
                                fontWeight: 300,
                                letterSpacing: '-0.01em',
                                maxWidth: '850px'
                            }}
                        >
                            Brands that thrive invest in custom-designed packaging. Let us help bring your vision to life.
                        </h2>
                    </div>

                    {/* 3D Packaging Rendering */}
                    <div className="lg:col-span-5 relative flex justify-end">
                        <div className="relative w-full max-w-[500px] aspect-square lg:aspect-video flex items-center justify-center">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/yucca-packaging-for-cold-warm-hot-food-card-2.jpg"
                                alt="High-fidelity 3D packaging rendering"
                                width={800}
                                height={800}
                                className="object-contain opacity-80"
                                priority
                            />
                            {/* Optional overlay to match the dark aesthetic of the original screenshot */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle, transparent 40%, #2a2a28 95%)',
                                    mixBlendMode: 'multiply'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Subtle Grid or Texture (Optional preservation of brand art direction) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.03,
                    backgroundImage: 'linear-gradient(#999996 1px, transparent 1px), linear-gradient(90deg, #999996 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}
            />
        </section>
    );
};

export default CustomSolutionsBanner;
