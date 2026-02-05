"use client";

import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductInfoAccordionProps {
    description?: string;
    additionalInfo?: string;
    dimensions?: string;
    storage?: string;
}

const ProductInfoAccordion = ({ description, additionalInfo, dimensions, storage }: ProductInfoAccordionProps) => {
    return (
        <div className="mt-16 pt-16 border-t border-foreground/5">
            <h3 className="text-[1.5rem] font-light mb-8">Details</h3>
            <Accordion type="single" collapsible className="w-full">
                {description && (
                    <AccordionItem value="item-1" className="border-b border-foreground/5 py-2">
                        <AccordionTrigger className="text-[14px] font-medium uppercase tracking-widest hover:no-underline hover:text-brand-green transition-colors">
                            Description
                        </AccordionTrigger>
                        <AccordionContent className="text-[15px] font-light leading-relaxed opacity-70 py-4">
                            {description}
                        </AccordionContent>
                    </AccordionItem>
                )}
                {additionalInfo && (
                    <AccordionItem value="item-2" className="border-b border-foreground/5 py-2">
                        <AccordionTrigger className="text-[14px] font-medium uppercase tracking-widest hover:no-underline hover:text-brand-green transition-colors">
                            Additional Information
                        </AccordionTrigger>
                        <AccordionContent className="text-[15px] font-light leading-relaxed opacity-70 py-4">
                            {additionalInfo}
                        </AccordionContent>
                    </AccordionItem>
                )}
                {dimensions && (
                    <AccordionItem value="item-3" className="border-b border-foreground/5 py-2">
                        <AccordionTrigger className="text-[14px] font-medium uppercase tracking-widest hover:no-underline hover:text-brand-green transition-colors">
                            Details and Dimensions
                        </AccordionTrigger>
                        <AccordionContent className="text-[15px] font-light leading-relaxed opacity-70 py-4">
                            {dimensions}
                        </AccordionContent>
                    </AccordionItem>
                )}
                {storage && (
                    <AccordionItem value="item-4" className="border-b border-foreground/5 py-2">
                        <AccordionTrigger className="text-[14px] font-medium uppercase tracking-widest hover:no-underline hover:text-brand-green transition-colors">
                            Storage
                        </AccordionTrigger>
                        <AccordionContent className="text-[15px] font-light leading-relaxed opacity-70 py-4">
                            {storage}
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
};

export default ProductInfoAccordion;
