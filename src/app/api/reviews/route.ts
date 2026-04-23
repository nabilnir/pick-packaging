import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        
        const { productId, rating, comment, user } = body;

        if (!productId || !rating || !comment || !user) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newReview = await Review.create({
            productId,
            rating,
            comment,
            user,
            verified: true // In a real app, this would be checked against orders
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
