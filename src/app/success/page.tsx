"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export default function SuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-[#FFFDF8]">
            <Header />
            <main className="pt-32 pb-20 container mx-auto px-6 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle size={64} className="text-brand-green" />
                    </div>
                    <h1 className="text-3xl font-display">Payment Successful!</h1>
                    <p className="text-foreground/70">
                        Thank you for your order. We have received your payment and will begin processing your order immediately.
                    </p>
                    <div className="pt-6">
                        <Link
                            href="/shop"
                            className="inline-block px-8 py-3 bg-foreground text-background font-medium uppercase tracking-widest rounded-md hover:bg-brand-green transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
