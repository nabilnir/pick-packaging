import React, { useState } from 'react';
import Image from 'next/image';
import { Paperclip, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * HeroContact Component
 * 
 * Clones the "Let's Chat" hero section with a minimalist heading, 
 * background wireframe packaging illustration, and the main contact form.
 * 
 * Theme: Dark (#333330)
 * Typography: Helvetica Neue / Inter (Light weights)
 */

const HeroContact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        industryType: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        needs: [] as string[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (need: string) => {
        setFormData(prev => ({
            ...prev,
            needs: prev.needs.includes(need)
                ? prev.needs.filter(n => n !== need)
                : [...prev.needs, need]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Enquiry sent successfully! We will get back to you soon.');
                setFormData({
                    industryType: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: '',
                    needs: []
                });
            } else {
                toast.error(result.error || 'Failed to send enquiry. Please try again.');
            }
        } catch (error) {
            toast.error('An error occurred. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative w-full bg-[#333330] overflow-hidden pt-[120px] pb-[120px]">
            <div className="container mx-auto max-w-[1440px]">

                {/* Top Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 md:mb-24">
                    <h1 className="text-[clamp(3.5rem,8vw,5rem)] font-light leading-[1.1] tracking-[-0.02em] text-[#999996]">
                        Let&apos;s Chat
                    </h1>

                    {/* Subtle top right wireframe decoration */}
                    <div className="hidden lg:block absolute top-[60px] right-0 w-[400px] h-[300px] opacity-[0.05] pointer-events-none rotate-[15deg]">
                        <Image
                            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/wireframe-9.png"
                            alt="Wireframe pattern"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">

                    {/* Left Column: Background Wireframe Illustration */}
                    <div className="relative min-h-[400px] lg:min-h-[500px]">
                        {/* Large centered wireframe bowl/packaging */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.15]">
                            <Image
                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/wireframe-9.png"
                                alt="Minimalist packaging wireframe"
                                width={600}
                                height={600}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="relative z-10 w-full max-w-[640px] ml-auto">
                        <h2 className="text-[32px] md:text-[40px] font-light text-[#999996] mb-4 tracking-tight leading-tight">
                            We&apos;re here to help
                        </h2>
                        <p className="text-[#999996] text-[18px] mb-12 font-light max-w-lg leading-relaxed">
                            Have a packaging question? That&apos;s our favourite topic. Get support directly from our team below.
                        </p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Industry Type Select */}
                            <div className="relative group">
                                <select
                                    name="industryType"
                                    value={formData.industryType}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#333330] border-t-0 border-x-0 border-b border-[#444441] py-4 pr-10 text-[#999996] focus:outline-none focus:border-[#ebf3ce] appearance-none transition-colors duration-200"
                                    required
                                >
                                    <option value="" disabled>Industry Type</option>
                                    <option value="food-service">Food Service</option>
                                    <option value="food-processing">Food Processing</option>
                                    <option value="agriculture">Agriculture</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666663]" />
                            </div>

                            {/* Name Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First Name*"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#444441] py-4 text-[#999996] placeholder-[#666663] focus:outline-none focus:border-[#ebf3ce] transition-colors duration-200"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last Name*"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#444441] py-4 text-[#999996] placeholder-[#666663] focus:outline-none focus:border-[#ebf3ce] transition-colors duration-200"
                                    required
                                />
                            </div>

                            {/* Contact Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email*"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#444441] py-4 text-[#999996] placeholder-[#666663] focus:outline-none focus:border-[#ebf3ce] transition-colors duration-200"
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Contact Number"
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#444441] py-4 text-[#999996] placeholder-[#666663] focus:outline-none focus:border-[#ebf3ce] transition-colors duration-200"
                                />
                            </div>

                            {/* Needs Checkboxes */}
                            <div className="pt-4">
                                <span className="block text-[14px] text-[#666663] mb-4">Tell us a bit about your needs</span>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                                    {['Customisation', 'Branding', 'Other'].map((need) => (
                                        <label key={need} className="flex items-center space-x-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.needs.includes(need)}
                                                onChange={() => handleCheckboxChange(need)}
                                            />
                                            <div className={`w-[18px] h-[18px] border border-[#444441] transition-colors ${formData.needs.includes(need) ? 'bg-[#ebf3ce] border-[#ebf3ce]' : 'bg-transparent group-hover:border-[#ebf3ce]'}`}></div>
                                            <span className="text-[14px] text-[#999996]">{need}</span>
                                        </label>
                                    ))}

                                    {/* Attach File Button */}
                                    <label className="ml-auto inline-flex items-center space-x-2 border border-[#444441] rounded-[4px] px-4 py-2 text-[13px] text-[#999996] cursor-pointer hover:bg-[#3b3b38] transition-colors">
                                        <input type="file" className="hidden" />
                                        <Paperclip className="w-3.5 h-3.5 rotate-[-45deg]" />
                                        <span>Attach a file</span>
                                    </label>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="pt-4">
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Message goes here"
                                    rows={4}
                                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-[#444441] py-4 text-[#999996] placeholder-[#666663] focus:outline-none focus:border-[#ebf3ce] transition-colors duration-200 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-[#2a2a28] border border-[#444441] text-[#999996] text-[14px] font-normal tracking-wide rounded-[4px] hover:border-[#ebf3ce] hover:text-[#ebf3ce] transition-all duration-300 flex items-center gap-2 "
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Submit enquiry"
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

export default HeroContact;

