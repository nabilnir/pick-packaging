import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        
        let product;
        
        // Try to find by custom 'id' first
        product = await Product.findOne({ id });
        
        // If not found and it looks like a MongoDB ObjectId, try find by _id
        if (!product && mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        }

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}
