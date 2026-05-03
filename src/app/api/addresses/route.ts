import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Address from '@/models/Address';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();
        const addresses = await Address.find({ userEmail: email }).sort({ isPrimary: -1, createdAt: -1 });

        return NextResponse.json({ success: true, data: addresses });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        
        // If this new address is primary, unset others for this user
        if (body.isPrimary) {
            await Address.updateMany({ userEmail: body.userEmail }, { isPrimary: false });
        }

        const newAddress = await Address.create(body);
        return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { _id, userEmail, ...updateData } = body;

        if (!_id || !userEmail) {
            return NextResponse.json({ success: false, error: 'Missing ID or email' }, { status: 400 });
        }

        // If updating to primary, unset others
        if (updateData.isPrimary) {
            await Address.updateMany({ userEmail }, { isPrimary: false });
        }

        const updatedAddress = await Address.findByIdAndUpdate(_id, { ...updateData, userEmail }, { new: true });
        
        return NextResponse.json({ success: true, data: updatedAddress });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 });
        }

        await dbConnect();
        await Address.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Address deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
