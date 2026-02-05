"use client";

import React from 'react';
import Image from 'next/image';

const MeetUsInfo = () => {
    return (
        <section className="bg-background py-[120px] md:py-[160px] text-foreground transition-colors duration-500">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[10%] items-start">
                    {/* Left Column: Contact Details */}
                    <div className="flex flex-col space-y-12">
                        <div>
                            <h2 className="text-[2rem] md:text-[3rem] font-light leading-[1.2] text-foreground mb-6 font-display">
                                Meet Us
                            </h2>
                            <p className="text-[1rem] leading-[1.6] text-foreground/80 font-sans">
                                Would you like to talk to us or come and see us?
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* Address */}
                            <div>
                                <h5 className="text-[0.875rem] font-medium leading-[1.2] text-foreground/60 mb-4 font-sans uppercase tracking-wider">
                                    Our Address
                                </h5>
                                <p className="text-[1.125rem] leading-[1.6] text-foreground font-sans">
                                    Unit 1, Reserve 5, Capricorn Way, Brackenfell, <br />
                                    7560, SA
                                </p>
                            </div>

                            {/* Phone */}
                            <div>
                                <h5 className="text-[0.875rem] font-medium leading-[1.2] text-foreground/60 mb-4 font-sans uppercase tracking-wider">
                                    Phone
                                </h5>
                                <a
                                    href="tel:+27219492296"
                                    className="text-[1.125rem] leading-[1.6] text-foreground font-sans border-b border-foreground/20 hover:border-brand-green hover:text-brand-green transition-all duration-300"
                                >
                                    +27 21 949 2296
                                </a>
                            </div>

                            {/* Operating Times */}
                            <div>
                                <h5 className="text-[0.875rem] font-medium leading-[1.2] text-foreground/60 mb-4 font-sans uppercase tracking-wider">
                                    Operating Times
                                </h5>
                                <div className="text-[1rem] leading-[1.6] text-foreground/80 font-sans space-y-1">
                                    <p>Monday – Thursday: 8:00 am – 4:30 pm</p>
                                    <p>Friday: 08:00 am – 4:00 pm</p>
                                    <p>Weekends & Public Holidays: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Embedded Map */}
                    <div className="relative w-full aspect-[4/3] md:aspect-square overflow-hidden rounded-[8px] border border-foreground/10 group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.34567!2d18.6834567!3d-33.8824567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc53f0e0eddd33%3A0xb36b537555e!2sYucca%20Food%20%26%20Produce%20Packaging!5e0!3m2!1sen!2sza!4v1715691234567!5m2!1sen!2sza"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(1) contrast(1.1) opacity(0.7) brightness(1.1)' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Yucca Packaging Location"
                            className="transition-all duration-700 group-hover:opacity-100 group-hover:filter-none"
                        ></iframe>

                        {/* Custom Marker Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="relative w-14 h-14 animate-bounce-subtle">
                                <Image
                                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/map-marker-5.svg"
                                    alt="Map Marker"
                                    fill
                                    className="object-contain drop-shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Google Logo attribution match */}
                        <div className="absolute bottom-4 left-4 pointer-events-none opacity-30">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/google_gray-6.svg"
                                alt="Google"
                                width={60}
                                height={20}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default MeetUsInfo;
