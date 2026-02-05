"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem = ({ question, answer, isOpen, onClick }: AccordionItemProps) => {
    return (
        <div className="border-b border-foreground/10">
            <button
                onClick={onClick}
                className="w-full py-[24px] flex justify-between items-center text-left transition-colors duration-300 hover:text-brand-green"
                aria-expanded={isOpen}
            >
                <span className="text-[18px] md:text-[20px] font-light leading-[1.5] text-foreground">
                    {question}
                </span>
                <Plus
                    className={cn(
                        "w-[20px] h-[20px] text-foreground/40 transition-transform duration-500",
                        isOpen && "rotate-45 text-brand-green"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isOpen ? "max-h-[500px] pb-[32px] opacity-100" : "max-h-0 pb-0 opacity-0"
                )}
            >
                <p className="text-[1.125rem] font-light leading-[1.6] text-foreground/70 max-w-[95%]">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What types of packaging do you offer?",
            answer: "We supply a wide range of food, produce, and custom packaging from ready-to-order items to fully bespoke branded solutions and custom moulds.",
        },
        {
            question: "Do you deliver nationwide?",
            answer: "Yes. We offer reliable nationwide delivery across South Africa.",
        },
        {
            question: "Do you deliver globally?",
            answer: "Yes. We have a reliable global delivery system in place, contact us to discuss your requirements.",
        },
        {
            question: "How do I place an order?",
            answer: "For bulk, multi-branch, or custom packaging, contact our team. For quick local Food Service orders, shop directly on our online store.",
        },
        {
            question: "Do you offer sustainable packaging options?",
            answer: "Yes. We have recyclable, compostable, FSC-certified and post-consumer recycled material options.",
        },
    ];

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-background py-[120px] md:py-[160px] border-t border-foreground/5 transition-colors duration-500">
            <div className="container mx-auto px-[6%]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-[40px] md:gap-x-[40px]">
                    {/* Left Column: Heading & Button */}
                    <div className="md:col-span-5 flex flex-col items-start">
                        <h2 className="text-[32px] md:text-[56px] font-light leading-[1.1] text-foreground mb-[48px] tracking-tight">
                            Frequently asked<br />questions
                        </h2>
                        <a
                            href="/faqs"
                            className="inline-flex items-center justify-center px-[32px] py-[14px] bg-foreground text-background text-[14px] font-medium rounded-[4px] border border-transparent transition-all duration-300 hover:bg-brand-green hover:text-white active:scale-[0.98] uppercase tracking-widest"
                        >
                            View all
                        </a>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="md:col-span-7 flex flex-col">
                        <div className="border-t border-foreground/10">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openIndex === index}
                                    onClick={() => handleToggle(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
