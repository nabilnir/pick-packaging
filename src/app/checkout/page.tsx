"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ChevronRight, ShieldCheck, Truck, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '@/components/checkout/stripe-checkout-form';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const { success, error } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        email: user?.email || '',
        address: '',
        city: '',
        postalCode: '',
        phone: ''
    });

    // Create Payment Intent as soon as the page loads or subtotal changes
    useEffect(() => {
        if (subtotal > 0 && items.length > 0) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: subtotal, currency: 'zar' }),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    error('Failed to initialize payment system');
                }
            })
            .catch(() => error('Network error initializing payment'));
        }
    }, [subtotal, items.length]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        setIsLoading(true);
        try {
            // Create order in MongoDB after successful payment
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: formData.email,
                    items: items.map(item => ({
                        productId: item.productId,
                        name: item.name,
                        image: item.image,
                        price: item.price * item.packingType.units * item.packingType.priceMultiplier,
                        quantity: item.quantity,
                        packingType: item.packingType,
                        volume: item.volume
                    })),
                    totalAmount: subtotal,
                    shippingAddress: {
                        fullName: formData.fullName,
                        addressLine1: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: 'South Africa',
                        phone: formData.phone
                    },
                    paymentStatus: 'Paid',
                    paymentId: paymentIntentId,
                    status: 'Processing'
                })
            });

            if (res.ok) {
                success('Order placed successfully! Redirecting...');
                clearCart();
                setTimeout(() => router.push('/dashboard/orders'), 1500);
            } else {
                throw new Error('Failed to save order record');
            }
        } catch (err: any) {
            error(err.message || "Payment was successful but we couldn't record your order. Please contact support.");
            console.error('FINAL_ORDER_CREATION_ERROR:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-[90px]">
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
                            <Truck size={32} className="opacity-20" />
                        </div>
                        <h2 className="text-[2rem] font-light font-display">Your cart is empty</h2>
                        <Link href="/shop" className="inline-flex items-center gap-2 py-4 px-8 bg-foreground text-background rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-brand-green transition-all">
                            Back to Shop
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
            <Header />
            
            <main className="flex-grow pt-[120px] pb-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex items-center gap-2 mb-8 text-[12px] uppercase tracking-widest font-bold opacity-30">
                        <Link href="/cart" className="hover:text-foreground">Cart</Link>
                        <ChevronRight size={14} />
                        <span className="text-foreground">Checkout</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left: Information */}
                        <div className="lg:col-span-7 space-y-8">
                            <section className="bg-background rounded-2xl p-8 border border-foreground/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                                        <Truck size={20} />
                                    </div>
                                    <h3 className="text-[1.5rem] font-light font-display">Shipping Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Full Name</label>
                                        <input 
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="w-full px-5 py-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Email Address</label>
                                        <input 
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className="w-full px-5 py-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Street Address</label>
                                        <input 
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Street Name"
                                            className="w-full px-5 py-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">City</label>
                                        <input 
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Cape Town"
                                            className="w-full px-5 py-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Postal Code</label>
                                        <input 
                                            name="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            placeholder="8001"
                                            className="w-full px-5 py-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] uppercase tracking-widest font-bold opacity-30">Phone Number</label>
                                        <input 
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+27 (0) 12 345 6789"
                                            className="w-full px-5 py-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 focus:border-brand-green transition-all focus:outline-none text-[14px]"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-background rounded-2xl p-8 border border-foreground/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                                        <CreditCard size={20} />
                                    </div>
                                    <h3 className="text-[1.5rem] font-light font-display">Secure Payment</h3>
                                </div>
                                
                                {clientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                                        <StripeCheckoutForm 
                                            totalAmount={subtotal} 
                                            onSuccess={handlePaymentSuccess}
                                            isLoading={isLoading}
                                            setIsLoading={setIsLoading}
                                        />
                                    </Elements>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <Loader2 className="animate-spin text-brand-green" size={32} />
                                        <p className="text-[13px] opacity-40 italic">Initalizing secure gateway...</p>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right: Summary */}
                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-[120px] space-y-8">
                                <section className="bg-background rounded-2xl p-8 border border-foreground/5 shadow-sm">
                                    <h3 className="text-[1.25rem] font-light font-display mb-8">Order Summary</h3>
                                    
                                    <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item) => {
                                            const itemDisplayTotal = item.price * item.packingType.units * item.packingType.priceMultiplier * item.quantity;
                                            return (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="relative w-16 h-16 rounded-xl bg-foreground/5 p-2 shrink-0">
                                                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[14px] font-medium truncate">{item.name}</h4>
                                                        <p className="text-[12px] opacity-40">Qty: {item.quantity} • {item.volume}</p>
                                                    </div>
                                                    <p className="text-[14px] font-bold">R{itemDisplayTotal.toFixed(2)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-foreground/5 text-[14px]">
                                        <div className="flex justify-between font-light">
                                            <span className="opacity-40">Subtotal</span>
                                            <span>R{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-light">
                                            <span className="opacity-40">Shipping</span>
                                            <span className="text-brand-green font-bold uppercase tracking-widest text-[11px]">Calculated Next</span>
                                        </div>
                                        <div className="flex justify-between text-[1.25rem] font-display font-light pt-4 border-t border-dashed border-foreground/10">
                                            <span>Total</span>
                                            <span className="font-bold">R{subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </section>

                                <div className="flex items-center gap-3 p-6 rounded-2xl border border-dashed border-foreground/10 justify-center">
                                    <ShieldCheck className="text-brand-green" size={20} />
                                    <p className="text-[12px] opacity-40 font-light">Secure 256-bit SSL Encrypted Payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
