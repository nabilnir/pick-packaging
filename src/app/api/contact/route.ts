import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// Define a simple Schema for Enquiries
const EnquirySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    industryType: String,
    needs: [String],
    message: String,
    createdAt: { type: Date, default: Date.now },
});

// Create the model if it doesn't exist
const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const enquiry = await Enquiry.create(body);

        return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
