"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface PackingType {
    name: string;
    units: number;
    priceMultiplier: number;
}

interface ProductOptionsProps {
    basePrice: number;
    currency: string;
    volumes: string[];
    packingTypes: PackingType[];
}

const ProductOptions = ({ basePrice, currency, volumes, packingTypes }: ProductOptionsProps) => {
    const [selectedVolume, setSelectedVolume] = useState(volumes[0]);
    const [selectedPacking, setSelectedPacking] = useState(packingTypes[0]);
    const [quantity, setQuantity] = useState(1);

    const totalPrice = (basePrice * selectedPacking.priceMultiplier * selectedPacking.units * quantity);

    return (
        <div className="space-y-10">
            {/* Volume Selection */}
            {volumes.length > 0 && (
                <div>
                    <h5 className="text-[14px] font-medium mb-4 uppercase tracking-widest opacity-60">Volume:</h5>
                    <div className="flex flex-wrap gap-4">
                        {volumes.map((v) => (
                            <button
                                key={v}
                                onClick={() => setSelectedVolume(v)}
                                className={cn(
                                    "px-6 py-3 rounded-[4px] border text-[14px] transition-all",
                                    selectedVolume === v
                                        ? "bg-[#F5F5F0] border-foreground/20 text-foreground"
                                        : "border-foreground/5 text-foreground/40 hover:border-foreground/20"
                                )}
                            >
                                <div className="font-medium">{v}</div>
                                <div className="text-[12px] opacity-40">{currency}{basePrice.toFixed(2)}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Packing Type Selection */}
            {packingTypes.length > 0 && (
                <div>
                    <h5 className="text-[14px] font-medium mb-4 uppercase tracking-widest opacity-60">Packing type:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packingTypes.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => setSelectedPacking(p)}
                                className={cn(
                                    "px-6 py-5 rounded-[4px] border text-[14px] transition-all flex justify-between items-center",
                                    selectedPacking.name === p.name
                                        ? "bg-[#F5F5F0] border-foreground/20 text-foreground"
                                        : "border-foreground/5 text-foreground/40 hover:border-foreground/20"
                                )}
                            >
                                <span className="font-medium">{p.name} ({p.units} units)</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity and Total */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-6 border-t border-foreground/5">
                <div className="space-y-4">
                    <h5 className="text-[14px] font-medium uppercase tracking-widest opacity-60">Quantity</h5>
                    <div className="flex items-center border border-foreground/20 rounded-[4px] w-fit">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-3 hover:text-brand-green transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="bg-transparent w-12 text-center focus:outline-none font-medium"
                        />
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-3 hover:text-brand-green transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[12px] opacity-40 uppercase tracking-widest mb-1">Total</div>
                    <div className="text-[2rem] font-light">
                        {currency}{totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                        <span className="text-[14px] opacity-40 ml-2">incl. vat</span>
                    </div>
                </div>
            </div>

            {/* Add to Cart */}
            <button className="w-full bg-foreground text-background py-6 rounded-[4px] font-medium uppercase tracking-[0.2em] hover:bg-brand-green transition-all duration-500 shadow-xl shadow-foreground/5">
                Add to cart
            </button>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 text-[13px]">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                        <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/yucca-packaging-for-food-service-takeout-catering--8.jpg" alt="Arrival" width={20} height={20} className="opacity-40" />
                    </div>
                    <div>
                        <div className="font-semibold mb-1">Estimated Arrival</div>
                        <div className="opacity-60">Tracked delivery: 1 - 3 business days</div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                        <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/images/yucca-packaging-for-food-service-takeout-catering--8.jpg" alt="Collection" width={20} height={20} className="opacity-40" />
                    </div>
                    <div>
                        <div className="font-semibold mb-1">Prefer to collect?</div>
                        <div className="opacity-60">Select at checkout to collect from Cape Town office (Mon-Fri 08:00–16:00)</div>
                    </div>
                </div>
            </div>

            <p className="text-[12px] opacity-40 mt-8 italic">
                Please note: delivery fees will be calculated at checkout. Free delivery for orders over R2000 incl. VAT.
            </p>
        </div>
    );
};

export default ProductOptions;
