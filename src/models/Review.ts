import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        image: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    images: [String],
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Avoid model recompilation in Next.js HMR
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review;
