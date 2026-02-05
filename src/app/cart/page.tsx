"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { useCart } from '@/contexts/cart-context';
import { cn } from '@/lib/utils';

import { useAuth } from '@/contexts/auth-context';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

export default function CartPage() {
    const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const [removedItem, setRemovedItem] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState('');

    const vatRate = 0.15; // 15% VAT
    const vatAmount = subtotal * vatRate;
    const total = subtotal;

    const handleRemove = (id: string, name: string) => {
        removeFromCart(id);
        setRemovedItem(name);
        setTimeout(() => setRemovedItem(null), 5000);
    };

    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            if (!stripe) return;

            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, email: user?.email }),
            });

            if (!response.ok) {
                console.error('Checkout failed with status:', response.status);
                const errorData = await response.json();
                console.error('Checkout error details:', errorData);
                alert(`Checkout failed: ${errorData.error || 'Unknown error'}`); // Simple user feedback
                return;
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                console.error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Checkout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF8]">
            <Header />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <h1 className="text-[3rem] font-display font-light mb-8">Cart</h1>

                    {/* Removed Item Notification */}
                    {removedItem && (
                        <div className="mb-6 p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-lg animate-in slide-in-from-top duration-300">
                            <p className="text-[14px]">
                                &quot;{removedItem}&quot; removed.
                            </p>
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-[#e3f2fd] border border-[#bbdefb] rounded-lg">
                                <p className="text-[14px]">Your cart is currently empty.</p>
                            </div>
                            <Link
                                href="/shop"
                                className="inline-block bg-foreground text-background px-6 py-3 text-[13px] font-medium uppercase tracking-widest hover:bg-brand-green transition-colors rounded-md"
                            >
                                Browse products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-0">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-4 py-6 border-b border-foreground/10"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.productId}`}
                                                className="text-[15px] font-medium text-brand-green hover:underline"
                                            >
                                                {item.name}{item.volume && ` - ${item.volume}`}
                                            </Link>
                                            <p className="text-[13px] text-foreground/60 mt-1">
                                                Packing: {item.packingType.name} ({item.packingType.units} units)
                                            </p>
                                            <button
                                                onClick={() => handleRemove(item.id, item.name)}
                                                className="text-[12px] text-foreground/40 hover:text-red-500 underline mt-1 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-foreground/10 rounded-md h-fit">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-foreground/5 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-[14px]">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-foreground/5 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right w-24">
                                            <p className="text-[15px] font-medium">
                                                £{(item.price * item.packingType.units * item.packingType.priceMultiplier * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Update Cart Button */}
                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => { }}
                                        className="px-6 py-2 border border-foreground/20 text-[13px] font-medium hover:bg-foreground/5 transition-colors rounded-md"
                                    >
                                        Update cart
                                    </button>
                                    <Link
                                        href="/shop"
                                        className="px-6 py-2 border border-foreground/20 text-[13px] font-medium hover:bg-foreground/5 transition-colors rounded-md flex items-center"
                                    >
                                        Go to shop
                                    </Link>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="border border-foreground/10 rounded-lg p-6 space-y-4">
                                    {/* Rewards Banner */}
                                    <div className="flex items-start gap-3 p-4 bg-[#fffde7] border border-[#fff9c4] rounded-lg">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d-yucca-co-za/assets/svgs/logo-icon-4.svg"
                                                alt="Yucca Rewards"
                                                width={32}
                                                height={32}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[12px] text-foreground/80">
                                                You qualify to earn <span className="font-semibold">£{(subtotal * 0.043).toFixed(2)}</span> cash back on this order.
                                            </p>
                                            <p className="text-[12px] text-foreground/60">
                                                <Link href="/login" className="underline hover:text-brand-green">Login</Link> or{' '}
                                                <Link href="/register" className="underline hover:text-brand-green">Sign Up</Link> to claim your reward
                                            </p>
                                        </div>
                                    </div>

                                    {/* Coupon Code */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Coupon code"
                                            className="flex-1 px-4 py-2 border border-foreground/20 rounded-md text-[14px] focus:outline-none focus:border-foreground/40"
                                        />
                                        <button className="px-4 py-2 border border-foreground/20 text-[13px] font-medium hover:bg-foreground/5 transition-colors rounded-md">
                                            Apply coupon
                                        </button>
                                    </div>

                                    {/* Summary */}
                                    <div className="space-y-3 pt-4 border-t border-foreground/10">
                                        <div className="flex justify-between text-[14px]">
                                            <span className="font-medium">Subtotal</span>
                                            <span>£{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[14px] text-foreground/60">
                                            <span>Shipping</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        <div className="flex justify-between text-[16px] font-medium pt-2 border-t border-foreground/10">
                                            <span>Total</span>
                                            <div className="text-right">
                                                <span>£{total.toFixed(2)}</span>
                                                <p className="text-[12px] text-foreground/50 font-normal">
                                                    (includes £{vatAmount.toFixed(2)} VAT)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-foreground text-background py-4 px-6 rounded-md font-medium text-[14px] uppercase tracking-widest hover:bg-brand-green transition-all duration-300"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
