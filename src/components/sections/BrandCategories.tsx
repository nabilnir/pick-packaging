import React from 'react';
import Image from 'next/image';

/**
 * BrandCategories Component
 * Clones the bottom navigation category section with the Yucca 'Y' logo and interactive cards.
 * Features:
 * - Large Yucca 'Y' logo on the left.
 * - Three interactive cards: Food Service, Food Processing, Agriculture.
 * - Subtle background imagery for each card on hover.
 */
const BrandCategories: React.FC = () => {
    const categories = [
        {
            title: 'Food Service',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/service-22.jpg',
            href: '/shop?industry=food-service',
        },
        {
            title: 'Food Processing',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/processing-23.jpg',
            href: '/shop?industry=food-processing',
        },
        {
            title: 'Agriculture',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/Agriculture-24.jpg',
            href: '/shop?industry=agriculture',
        },
    ];

    return (
        <section className="bg-[#2a2a28] py-[60px] md:py-[100px]">
            <div className="container mx-auto max-w-[1440px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Logo Section */}
                    <div className="flex items-center justify-center md:justify-start p-8">
                        <div className="relative w-full aspect-square max-w-[280px]">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/logo-icon-4.svg"
                                alt="Yucca Logo Icon"
                                fill
                                className="object-contain opacity-20"
                                priority
                            />
                        </div>
                    </div>

                    {/* Interactive Cards */}
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={category.href}
                            className="group relative h-[380px] md:h-[450px] overflow-hidden rounded-[12px] border border-[#444441] bg-[#333330] transition-all duration-500 hover:border-[#ebf3ce]/30"
                        >
                            {/* Background Image Container */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover opacity-10 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-30"
                                />
                            </div>

                            {/* Overlay / Content */}
                            <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                                <h3 className="text-[24px] md:text-[28px] font-light tracking-wide text-[#999996] transition-colors duration-300 group-hover:text-[#ebf3ce]">
                                    {category.title}
                                </h3>

                                {/* Subtle underline effect */}
                                <span className="mt-4 h-[1px] w-0 bg-[#ebf3ce] transition-all duration-500 group-hover:w-16" />
                            </div>

                            {/* Interaction Hint (Optional visual flair) */}
                            <div className="absolute bottom-6 right-6 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#ebf3ce"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandCategories;
