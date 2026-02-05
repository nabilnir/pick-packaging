"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

const faqs = [
    {
        question: "What types of packaging do you offer?",
        answer:
            "We supply a wide range of food, produce, and custom packaging from ready-to-order items to fully bespoke branded solutions and custom moulds.",
    },
    {
        question: "Do you deliver nationwide?",
        answer: "Yes. We offer reliable nationwide delivery across South Africa.",
    },
    {
        question: "Do you deliver globally?",
        answer:
            "Yes. We have a reliable global delivery system in place, contact us to discuss your requirements.",
    },
    {
        question: "How do I place an order?",
        answer:
            "For bulk, multi-branch, or custom packaging, contact our team. For quick local Food Service orders, shop directly on our online store.",
    },
    {
        question: "Do you offer sustainable packaging options?",
        answer:
            "Yes. We have recyclable, compostable, FSC-certified and post-consumer recycled material options.",
    },
];

const FAQSection = () => {
    return (
        <section className="bg-background py-32 md:py-48 transition-colors duration-500">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-24">
                    {/* Left Column: Heading and CTA */}
                    <div className="lg:col-span-5">
                        <h2 className="text-foreground text-[clamp(2.5rem,5vw,4.5rem)] mb-12 max-w-md leading-[1.1] font-light font-display">
                            Frequently asked questions
                        </h2>
                        <a
                            href="/faq"
                            className="inline-flex items-center justify-center px-10 py-4 bg-foreground text-background text-[13px] font-semibold rounded-[4px] transition-all duration-500 hover:bg-brand-green hover:text-white uppercase tracking-widest"
                        >
                            View all
                        </a>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="lg:col-span-7">
                        <AccordionPrimitive.Root
                            type="single"
                            collapsible
                            className="w-full space-y-0"
                        >
                            {faqs.map((faq, index) => (
                                <AccordionPrimitive.Item
                                    key={index}
                                    value={`item-${index}`}
                                    className="border-t border-foreground/10 last:border-b"
                                >
                                    <AccordionPrimitive.Header className="flex font-display">
                                        <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between py-10 text-left transition-all group outline-none">
                                            <span className="text-[20px] md:text-[24px] font-light text-foreground leading-[1.3] group-hover:text-brand-green transition-colors duration-300">
                                                {faq.question}
                                            </span>
                                            <div className="ml-6 transition-transform duration-500 group-data-[state=open]:rotate-45 group-data-[state=open]:text-brand-green">
                                                <Plus size={28} className="stroke-[1.5]" />
                                            </div>
                                        </AccordionPrimitive.Trigger>
                                    </AccordionPrimitive.Header>
                                    <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                        <div className="pb-10 pt-0 text-foreground/70 text-[18px] font-light leading-relaxed max-w-2xl">
                                            {faq.answer}
                                        </div>
                                    </AccordionPrimitive.Content>
                                </AccordionPrimitive.Item>
                            ))}
                        </AccordionPrimitive.Root>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;