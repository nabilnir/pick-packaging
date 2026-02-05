import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

/**
 * FooterNavigation Component
 * 
 * Clones the footer area with the large Yucca brand logo, category grid cards,
 * and the small legal/social footer bar at the bottom.
 */

const categories = [
    {
        title: "Food Service",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg",
        link: "/food-service"
    },
    {
        title: "Food Processing",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/processing-23.jpg",
        link: "/food-processing"
    },
    {
        title: "Agriculture",
        image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/Agriculture-24.jpg",
        link: "/agriculture"
    }
];

const FooterNavigation = () => {
    return (
        <footer className="w-full bg-[#44433E] pt-20">
            <div className="container px-[6%] mx-auto">
                {/* Large Footer Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-r border-[#9B9B97]/20">

                    {/* Logo Column */}
                    <div className="flex items-center justify-center p-12 border-b border-r border-[#9B9B97]/20 aspect-square">
                        <div className="relative w-full h-full max-w-[200px] flex items-center justify-center">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/logo-icon-4.svg"
                                alt="Yucca Logo"
                                width={180}
                                height={180}
                                className="opacity-80"
                            />
                        </div>
                    </div>

                    {/* Category Columns */}
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={category.link}
                            className="group relative flex items-center justify-center p-12 border-b border-[#9B9B97]/20 border-r last:md:border-r-0 lg:border-r border-[#9B9B97]/20 overflow-hidden aspect-square"
                        >
                            <div className="z-10 text-center">
                                <h5 className="text-[#9B9B97] text-xl md:text-2xl font-light tracking-wide transition-colors group-hover:text-white">
                                    {category.title}
                                </h5>
                            </div>

                            {/* Image Overlay on Hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-black">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover grayscale"
                                />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Small Bottom Footer Bar */}
                <div className="mt-8 mb-12 py-4 px-6 border border-[#9B9B97]/20 flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[#9B9B97] text-[12px] uppercase tracking-widest font-medium">
                            <span className="flex items-center justify-center w-5 h-5 border border-[#9B9B97]/40 rounded-full text-[10px]">C</span>
                            <span>Yucca 2026. All Rights Reserved</span>
                        </div>

                        <div className="flex items-center gap-4 text-[#9B9B97]">
                            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                                <Facebook size={16} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                                <Instagram size={16} strokeWidth={1.5} />
                            </a>
                            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                                <Linkedin size={16} strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 text-[#9B9B97] text-[12px] font-medium">
                        <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
                        <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</a>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default FooterNavigation;
