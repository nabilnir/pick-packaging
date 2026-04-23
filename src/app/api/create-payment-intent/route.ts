import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27' as any,
});

export async function POST(request: Request) {
    try {
        const { amount, currency = 'zar' } = await request.json();

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents/cents-equivalent
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.error('STRIPE_PAYMENT_INTENT_ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
