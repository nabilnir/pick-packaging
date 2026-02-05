"use client";

import React from 'react';
import Image from 'next/image';

/**
 * MeetUs Component
 * 
 * Clones the "Meet Us" section with contact details and a dark-themed Google Maps embed.
 * Adheres to the "Minimalist Industrial Premium" aesthetic with dark tones and thin typography.
 */
export default function MeetUs() {
    const mapMarkerUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/map-marker-5.svg";

    return (
        <section className="bg-[#333330] py-[120px] px-8 md:px-16 border-t border-[#444441]">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px]">

                {/* Left Column: Contact Details */}
                <div className="flex flex-col space-y-12">
                    <div>
                        <h2 className="text-[clamp(2rem,5vw,3rem)] font-light leading-[1.2] tracking-[-0.01em] text-[#999996] mb-4">
                            Meet Us
                        </h2>
                        <p className="text-[18px] text-[#999996] font-normal leading-relaxed">
                            Would you like to talk to us or come and see us?
                        </p>
                    </div>

                    <div className="space-y-10">
                        {/* Address */}
                        <div className="space-y-3">
                            <h5 className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] uppercase text-[#999996]">
                                Our Address
                            </h5>
                            <address className="not-italic text-[18px] text-[#999996] font-normal leading-relaxed max-w-[320px]">
                                Unit 1, Reserve 5, Capricorn Way, Brackenfell, 7560, SA
                            </address>
                        </div>

                        {/* Phone */}
                        <div className="space-y-3">
                            <h5 className="text-[14px] font-medium leading-[1.1] tracking-[0.05em] uppercase text-[#999996]">
                                Phone
                            </h5>
                            <a
                                href="tel:+27219492296"
                                className="text-[18px] text-[#999996] font-normal leading-relaxed border-b border-[#444441] transition-colors hover:text-[#ebf3ce] hover:border-[#ebf3ce]"
                            >
                                +27 21 949 2296
                            </a>
                        </div>

                        {/* Operating Times */}
                        <div className="space-y-3">
                            <h5 className="text-[14px] font-medium leading-[1.4] tracking-[0.05em] uppercase text-[#999996]">
                                Operating Times
                            </h5>
                            <div className="text-[18px] text-[#999996] font-normal leading-relaxed space-y-1">
                                <p>Monday – Thursday: 8:00 am – 4:30 pm</p>
                                <p>Friday: 08:00 am – 4:00 pm</p>
                                <p>Weekends & Public Holidays: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Map */}
                <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full min-h-[450px] rounded-[12px] overflow-hidden group">
                    {/* Custom Google Map Embed with grayscale/dark filtering */}
                    <div className="absolute inset-0 grayscale invert opacity-80 brightness-[0.4] contrast-[1.2] pointer-events-none">
                        {/* Using a standard iframe as a base, styled to match the dark industrial look */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.836480579738!2d18.694666376878345!3d-33.86872581965908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ece9993952f9f17%3A0xc0fb1955fb8435d8!2s1%20Capricorn%20Way%2C%20Brackenfell%20South%2C%20Cape%20Town%2C%207560!5e0!3m2!1sen!2sza!4v1714561234567!5m2!1sen!2sza"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>

                    {/* Overlay to further darken and match site colors */}
                    <div className="absolute inset-0 bg-[#2a2a28]/40 pointer-events-none"></div>

                    {/* Central Custom Map Marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <div className="relative w-[48px] h-[48px] animate-bounce-subtle">
                            <Image
                                src={mapMarkerUrl}
                                alt="Map Marker"
                                width={48}
                                height={48}
                                className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Google Logo Fallback (matches screenshot aesthetics) */}
                    <div className="absolute bottom-4 left-4 z-20">
                        <Image
                            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/google_gray-6.svg"
                            alt="Google"
                            width={60}
                            height={20}
                            className="opacity-40"
                        />
                    </div>

                    {/* Border overlay for consistency */}
                    <div className="absolute inset-0 border border-[#444441] rounded-[12px] pointer-events-none"></div>
                </div>

            </div>

            <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
}
