"use client";

import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';

export default function CancelPage() {
    return (
        <div className="min-h-screen bg-[#FFFDF8]">
            <Header />
            <main className="pt-32 pb-20 container mx-auto px-6 text-center">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="flex justify-center">
                        <XCircle size={64} className="text-red-500" />
                    </div>
                    <h1 className="text-3xl font-display">Payment Cancelled</h1>
                    <p className="text-foreground/70">
                        Your payment was cancelled and you have not been charged.
                    </p>
                    <div className="pt-6 flex gap-4 justify-center">
                        <Link
                            href="/cart"
                            className="px-8 py-3 bg-foreground text-background font-medium uppercase tracking-widest rounded-md hover:bg-brand-green transition-colors"
                        >
                            Return to Cart
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-3 border border-foreground/20 font-medium uppercase tracking-widest rounded-md hover:bg-foreground/5 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
