import mongoose from 'mongoose';

const PackingTypeSchema = new mongoose.Schema({
    name: String,
    units: Number,
    priceMultiplier: Number,
});

const ProductSchema = new mongoose.Schema({
    id: String, // Matching the JSON id
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: Number,
    currency: { type: String, default: '£' },
    category: String,
    subCategory: String,
    material: String,
    image: String,
    isNew: Boolean,
    inStock: Boolean,
    description: String,
    volumes: [String],
    packingTypes: [PackingTypeSchema],
    additionalInfo: String,
    dimensions: String,
    storage: String,
    createdAt: { type: Date, default: Date.now },
});

// Prevent overwrite warning in dev & allow schema updates
if (mongoose.models.Product) delete mongoose.models.Product;
const Product = mongoose.model('Product', ProductSchema);

export default Product;
