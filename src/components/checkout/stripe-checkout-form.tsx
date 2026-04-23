"use client";

import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useToast } from '@/components/ui/toast-provider';
import { Loader2, ShieldCheck } from 'lucide-react';

interface StripeCheckoutFormProps {
    totalAmount: number;
    onSuccess: (paymentIntentId: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export default function StripeCheckoutForm({ totalAmount, onSuccess, isLoading, setIsLoading }: StripeCheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const { success, error } = useToast();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message || 'Validation error');
            setIsLoading(false);
            return;
        }

        // The PaymentElement handles the payment flow
        // We trigger the confirmation which will redirect if successful (if redirected back here)
        // OR we can handle it manually if we use confirmation: 'manual'
        
        // Since we want to stay on the page and then create the order, we can use a different approach
        // But the easiest/safest is to let Stripe handle it and return to a return_url
        
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: 'if_required', // This avoids redirect for cards that don't need 3D Secure
        });

        if (confirmError) {
            setErrorMessage(confirmError.message || 'Payment failed');
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            
            {errorMessage && (
                <div className="p-4 bg-red-50 text-red-500 text-[13px] rounded-xl border border-red-100 italic">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !stripe || !elements}
                className="w-full mt-6 py-5 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest text-[13px] hover:bg-brand-green transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                {isLoading ? 'Processing...' : `Confirm & Pay R${totalAmount.toFixed(2)}`}
            </button>
        </form>
    );
}
