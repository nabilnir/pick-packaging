
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover', // Use latest API version or match installed version
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, email } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Map cart items to Stripe line items
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: item.currency ? item.currency.replace('£', 'gbp').replace('R', 'zar').toLowerCase() : 'gbp',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                    description: `Packing: ${item.packingType.name} (${item.packingType.units} units)`,
                },
                unit_amount: Math.round(item.price * item.packingType.units * item.packingType.priceMultiplier * 100), // Stripe expects cents
            },
            quantity: item.quantity,
        }));

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/cancel`,
            customer_email: email, // Pre-fill email if available
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
