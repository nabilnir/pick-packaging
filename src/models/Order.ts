import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, default: 'Product' },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    packingType: {
        name: { type: String, default: 'Standard' },
        units: { type: Number, default: 1 }
    },
    volume: { type: String, default: '' }
});

const OrderSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'R' },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Packing', 'Dispatched', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    shippingAddress: {
        fullName: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        postalCode: String,
        country: String,
        phone: String
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Refunded'],
        default: 'Unpaid'
    },
    trackingNumber: String,
    estimatedDelivery: Date,
}, { timestamps: true });

if (mongoose.models.Order) delete mongoose.models.Order;
const Order = mongoose.model('Order', OrderSchema);

export default Order;
