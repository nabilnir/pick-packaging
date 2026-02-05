import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all products from MongoDB
        const products = await Product.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: products
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 200 });
    }
}
