import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import mongoose from 'mongoose';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        await dbConnect();
        const { productId } = await params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
        }

        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        
        // Calculate summary
        const total = reviews.length;
        const average = total > 0 
            ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / total 
            : 0;

        return NextResponse.json({
            reviews,
            summary: {
                total,
                average: Number(average.toFixed(1))
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
