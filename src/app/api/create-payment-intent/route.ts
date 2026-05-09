import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use the latest stable API version supported by the installed stripe package
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        // Guard: key must be present
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY is missing from environment variables');
            return NextResponse.json(
                { error: 'Stripe secret key is not configured.' },
                { status: 500 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            console.error('JSON_PARSE_ERROR:', e);
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        console.log('PAYMENT_INTENT_REQUEST_BODY:', body);
        const { amount, currency = 'zar' } = body;

        if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
            console.error('Invalid amount received:', amount);
            return NextResponse.json(
                { error: 'A valid positive amount is required.' },
                { status: 400 }
            );
        }

        // Stripe expects the amount in the smallest currency unit (cents for ZAR)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    } catch (error: any) {
        console.error('STRIPE_PAYMENT_INTENT_ERROR:', error?.message ?? error);
        return NextResponse.json(
            { error: error?.message ?? 'Failed to create payment intent.' },
            { status: 500 }
        );
    }
}
