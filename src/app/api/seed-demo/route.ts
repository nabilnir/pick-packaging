import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();

        const demoProduct = {
            id: "demo-1",
            name: "Demo Product",
            slug: "demo-product",
            price: 0,
            currency: "R",
            category: "Demo",
            subCategory: "Demo",
            material: "N/A",
            image: "https://via.placeholder.com/600",
            isNew: true,
            inStock: true,
            description: "This is a demo product to initialize the collection.",
            volumes: ["100ml"],
            packingTypes: [
                {
                    name: "Sample",
                    units: 1,
                    priceMultiplier: 1
                }
            ]
        };

        const result = await Product.create(demoProduct);

        return NextResponse.json({
            success: true,
            message: `Collection initialized! Demo product created.`,
            data: result
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
