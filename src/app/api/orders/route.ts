import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { auth } from '@/lib/firebase'; // We might need this for server-side auth check

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const status = searchParams.get('status');

        let query: any = {};
        if (email) query.userEmail = email;
        if (status) query.status = status;

        const orders = await Order.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id, status, trackingNumber } = body;

        if (!id) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status, trackingNumber },
            { new: true }
        );

        if (!updatedOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: updatedOrder });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }
        
        // Basic validation
        if (!body.userEmail || !body.items || body.items.length === 0) {
            console.error("VALIDATION_FAILED:", body);
            return NextResponse.json({ error: 'Incomplete order data - missing email or items' }, { status: 400 });
        }

        if (!body.totalAmount) {
             return NextResponse.json({ error: 'Incomplete order data - missing totalAmount' }, { status: 400 });
        }

        const newOrder = await Order.create(body);

        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
    } catch (error: any) {
        console.error("ORDER_CREATION_ERROR_COMPLETE:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            details: error.errors ? Object.keys(error.errors) : undefined
        }, { status: 500 });
    }
}
