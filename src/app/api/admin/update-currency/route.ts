import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await connectDB();

        // Update all products to use GBP symbol
        const result = await Product.updateMany(
            {},
            { $set: { currency: "£" } }
        );

        return NextResponse.json({
            success: true,
            message: `Updated currency for ${result.modifiedCount} products`,
            result
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
