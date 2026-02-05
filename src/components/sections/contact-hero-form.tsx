"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Paperclip, ChevronDown, Loader2 } from 'lucide-react';
import { submitContactForm } from '@/app/contact/actions';
import { toast } from 'sonner';

/**
 * ContactHeroForm Section
 *
 * This component clones the hero section of the contact page.
 * It features a large "Let's Chat" headline, wireframe illustrations,
 * and a detailed contact form.
 */

const ContactHeroForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await submitContactForm(formData);
            if (result.success) {
                toast.success("Enquiry submitted successfully!");
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error("Failed to submit enquiry. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative w-full bg-background pt-[180px] pb-[160px] overflow-hidden text-foreground">
            <div className="container relative z-10">
                {/* Headline Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
                    <div className="flex flex-col">
                        <h1 className="text-foreground font-light leading-[0.9] tracking-[-0.04em] text-[clamp(5rem,15vw,10rem)] font-display -ml-1">
                            Let's Chat
                        </h1>
                    </div>
                </div>

                {/* Main Content: Wireframe and Form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left: Large Wireframe */}
                    <div className="flex flex-col">
                        <div className="relative w-full max-w-[600px] opacity-100">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/wireframe-9.png"
                                alt="Packaging Wireframe illustration"
                                width={800}
                                height={800}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Right: Form Area */}
                    <div className="flex flex-col relative text-left lg:pt-12">
                        {/* Specific Box Graphic (From Shop Mega Menu) */}
                        <div className="relative w-full max-w-[500px] aspect-video mb-8 ml-auto lg:-mr-12 pointer-events-none z-10 opacity-90 overflow-hidden">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/menu-1.png"
                                alt="Packaging Graphic"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                priority
                            />
                        </div>

                        <div className="mb-10 max-w-[520px] relative z-20">
                            <h2 className="text-foreground text-[3.5rem] font-light mb-4 leading-tight font-display tracking-tight">
                                We're here to help
                            </h2>
                            <p className="text-foreground/70 text-[1.125rem] font-light leading-relaxed">
                                Have a packaging question? That’s our favourite topic. Get support
                                directly from our team below.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Industry Type Select */}
                            <div className="relative group">
                                <select
                                    name="industryType"
                                    defaultValue=""
                                    className="appearance-none w-full bg-transparent border border-foreground/20 rounded-[4px] py-[0.875rem] px-5 text-foreground focus:outline-none focus:border-brand-green transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Industry Type</option>
                                    <option value="food-service">Food Service</option>
                                    <option value="processing">Food Processing</option>
                                    <option value="agriculture">Agriculture</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
                                    <ChevronDown size={18} strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Name Fields Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name*"
                                    required
                                    className="bg-transparent border border-foreground/20 rounded-[4px] py-[0.875rem] px-5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-green transition-all"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name*"
                                    required
                                    className="bg-transparent border border-foreground/20 rounded-[4px] py-[0.875rem] px-5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-green transition-all"
                                />
                            </div>

                            {/* Contact Details Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email*"
                                    required
                                    className="bg-transparent border border-foreground/20 rounded-[4px] py-[0.875rem] px-5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-green transition-all"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Contact Number"
                                    className="bg-transparent border border-foreground/20 rounded-[4px] py-[0.875rem] px-5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-green transition-all"
                                />
                            </div>

                            {/* Checkboxes Area */}
                            <div className="pt-2">
                                <label className="text-[0.875rem] font-medium text-foreground mb-4 block">
                                    Tell us a bit about your needs
                                </label>
                                <div className="flex flex-wrap items-center gap-6">
                                    {['Customisation', 'Branding', 'Other'].map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative w-[18px] h-[18px] border border-foreground/30 rounded-[2px] group-hover:border-brand-green transition-colors">
                                                <input
                                                    type="checkbox"
                                                    name="needs"
                                                    value={item}
                                                    className="absolute inset-0 opacity-0 cursor-pointer peer"
                                                />
                                                <div className="absolute inset-0 bg-brand-green opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-[0.875rem] text-foreground/80">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Message Area */}
                            <div className="relative pt-2">
                                <textarea
                                    name="message"
                                    placeholder="Message goes here"
                                    rows={5}
                                    className="bg-transparent border border-foreground/20 rounded-[4px] py-[0.875rem] px-5 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-green transition-all w-full resize-none"
                                ></textarea>

                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-[0.8125rem] text-foreground/60 bg-foreground/5 hover:bg-foreground/10 px-3 py-1.5 rounded-[4px] transition-all group"
                                    >
                                        <Paperclip size={14} className="group-hover:text-brand-green" />
                                        <span>Attach a file</span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-foreground text-background text-[0.875rem] font-medium px-10 py-4 rounded-[4px] hover:bg-brand-green hover:text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-semibold"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit enquiry'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactHeroForm;
