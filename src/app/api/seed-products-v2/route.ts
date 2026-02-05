import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import productsData from '@/data/products-all.json';

export async function GET() {
    try {
        await dbConnect();

        // Optional: Clear existing products to avoid duplicates during testing
        // await Product.deleteMany({});

        // Insert products from JSON (strip custom _id from packingTypes to let Mongoose gen ObjectIds)
        const productsToInsert = productsData.map((product: any) => ({
            ...product,
            packingTypes: product.packingTypes.map(({ _id, ...rest }: any) => rest)
        }));

        const result = await Product.insertMany(productsToInsert);

        return NextResponse.json({
            success: true,
            message: `${result.length} products imported successfully!`,
            data: result
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 200 });
    }
}
