import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        // Get a sample product to see its actual structure
        const sampleProduct = await Product.findOne({});

        return NextResponse.json({
            success: true,
            sample: sampleProduct,
            hasId: !!sampleProduct?.id,
            idValue: sampleProduct?.id,
            allKeys: sampleProduct ? Object.keys(sampleProduct.toObject()) : []
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }
}
