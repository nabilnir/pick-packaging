import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();

        // 1. Create Demo Product
        const demoProduct = await Product.findOneAndUpdate(
            { id: "demo-1" },
            {
                id: "demo-1",
                name: "Demo Product",
                slug: "demo-product",
                price: 15.00,
                currency: "R",
                category: "Demo",
                subCategory: "Demo",
                material: "N/A",
                image: "https://via.placeholder.com/600",
                isNew: true,
                inStock: true,
                description: "This is a demo product to initialize the collection.",
                volumes: ["100ml"],
                packingTypes: [{ name: "Sample", units: 1, priceMultiplier: 1 }]
            },
            { upsert: true, new: true }
        );

        // 2. Create Mock Orders
        await Order.deleteMany({ userEmail: "demo@user.com" }); // Clean up old mock orders

        const statuses = ['Processing', 'Packing', 'Dispatched', 'Delivered', 'Pending'];
        const mockOrders = [];

        for (let i = 0; i < 6; i++) {
            mockOrders.push({
                userEmail: "demo@user.com",
                items: [{
                    productId: demoProduct._id,
                    name: demoProduct.name,
                    image: demoProduct.image,
                    price: demoProduct.price || 0,
                    quantity: Math.floor(Math.random() * 5) + 1,
                    packingType: demoProduct.packingTypes[0],
                    volume: "100ml"
                }],
                totalAmount: (demoProduct.price || 0) * 2,
                status: statuses[i % statuses.length],
                paymentStatus: i % 2 === 0 ? 'Paid' : 'Unpaid',
                shippingAddress: {
                    fullName: "Demo User",
                    addressLine1: "123 Packaging Way",
                    city: "Cape Town",
                    postalCode: "8001",
                    country: "South Africa"
                },
                createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) // Spread across days
            });
        }

        await Order.insertMany(mockOrders);

        return NextResponse.json({
            success: true,
            message: `Database seeded with 1 product and 6 mock orders.`,
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
