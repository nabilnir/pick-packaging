"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronDown, ChevronUp, Minus, Plus, ZoomIn, X, ShoppingCart } from 'lucide-react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';

interface PackingType {
    _id?: string;
    name: string;
    units: number;
    priceMultiplier: number;
}

interface Product {
    _id: string;
    id: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    category: string;
    material: string;
    description?: string;
    features?: string[];
    details?: {
        colour?: string;
        material?: string;
        productCode?: string;
        weight?: string;
        dimensions?: string;
        cartonWeight?: string;
        cartonDimensions?: string;
    };
    storage?: string[];
    packingTypes: PackingType[];
    volumes?: string[];
}

const ProductDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedPacking, setSelectedPacking] = useState<PackingType | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>('details');
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current || !isZoomed) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    const handleAddToCart = () => {
        if (!product || !selectedPacking) return;

        setIsAddingToCart(true);

        // Simulate network delay for animation
        setTimeout(() => {
            const success = addToCart({
                productId: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                currency: product.currency,
                packingType: {
                    name: selectedPacking.name,
                    units: selectedPacking.units,
                    priceMultiplier: selectedPacking.priceMultiplier
                },
                volume: product.volumes && product.volumes.length > 0 ? product.volumes[0] : undefined,
                quantity: quantity
            });

            if (success) {
                // Keep "Added!" state for a moment before resetting
                setTimeout(() => setIsAddingToCart(false), 2000);
            } else {
                // If failed (e.g. not logged in), reset immediately
                setIsAddingToCart(false);
            }
        }, 600);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
                if (data.packingTypes && data.packingTypes.length > 0) {
                    setSelectedPacking(data.packingTypes[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-[90px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
                        <p className="text-foreground/60">Loading product...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-[90px]">
                    <div className="text-center">
                        <h1 className="text-2xl font-display mb-4">Product Not Found</h1>
                        <Link href="/shop" className="text-brand-green hover:underline">
                            Return to Shop
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Calculate total: price per unit × units in pack × priceMultiplier × quantity of packs
    const unitPrice = product.price;
    const packUnits = selectedPacking?.units || 1;
    const multiplier = selectedPacking?.priceMultiplier || 1;
    const totalPrice = unitPrice * packUnits * multiplier * quantity;

    const features = [
        { icon: 'https://yucca.co.za/wp-content/uploads/2025/06/Biodegradable.svg', label: 'Biodegradable' },
        { icon: 'https://yucca.co.za/wp-content/uploads/2025/06/Branding-Compatible.svg', label: 'Branding Compatible' },
        { icon: 'https://yucca.co.za/wp-content/uploads/2025/06/Compostable.svg', label: 'Compostable' },
        { icon: 'https://yucca.co.za/wp-content/uploads/2025/06/Freezer-Friendly.svg', label: 'Freezer Friendly' },
        { icon: 'https://yucca.co.za/wp-content/uploads/2025/06/Grease-Resistant.svg', label: 'Grease Resistant' },
        { icon: 'https://yucca.co.za/wp-content/uploads/2025/06/Microwave-Safe.svg', label: 'Microwave Safe' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFDF7]">
            <Header />

            <main className="flex-grow pt-[120px] pb-20">
                <div className="container mx-auto px-8 md:px-16">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[14px] text-foreground/60 mb-8">
                        <Link href="/shop" className="hover:text-foreground transition-colors">
                            Shop
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-foreground">{product.name}</span>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Left - Image */}
                        <div
                            ref={imageContainerRef}
                            className="relative aspect-square rounded-lg overflow-hidden group"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setIsZoomed(false)}
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className={cn(
                                    "object-contain transition-transform duration-200",
                                    isZoomed && "scale-[2.5]"
                                )}
                                style={isZoomed ? {
                                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                                } : undefined}
                                priority
                            />
                            <button
                                onClick={() => setIsZoomed(!isZoomed)}
                                className={cn(
                                    "absolute top-4 right-4 p-2 rounded-md transition-all cursor-pointer z-10",
                                    isZoomed
                                        ? "bg-brand-green text-white opacity-100"
                                        : "bg-white/90 opacity-0 group-hover:opacity-100"
                                )}
                            >
                                <ZoomIn size={20} className={isZoomed ? "text-white" : "text-foreground/60"} />
                            </button>
                            {isZoomed && (
                                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                                    Move mouse to zoom • Click button to exit
                                </div>
                            )}
                        </div>

                        {/* Right - Details */}
                        <div className="flex flex-col">
                            <h1 className="text-[2.5rem] md:text-[3rem] font-light font-display leading-tight mb-6">
                                {product.name}
                            </h1>

                            {/* Volume Selector */}
                            {product.volumes && product.volumes.length > 0 && (
                                <div className="mb-6">
                                    <label className="text-[14px] text-foreground/60 mb-2 block">
                                        Volume:
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {product.volumes.map((vol, index) => (
                                            <button
                                                key={index}
                                                className="px-6 py-3 bg-foreground/5 border border-foreground/20 rounded-md text-[14px] flex flex-col items-center"
                                            >
                                                <span className="font-medium">{vol}</span>
                                                <span className="text-[12px] text-foreground/40">
                                                    £{product.price.toFixed(2)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Packing Type Selector */}
                            {product.packingTypes && product.packingTypes.length > 0 && (
                                <div className="mb-6">
                                    <label className="text-[14px] text-foreground/60 mb-2 block">
                                        Packing type:
                                    </label>
                                    <div className="flex gap-3">
                                        {product.packingTypes.map((packing, index) => (
                                            <button
                                                key={packing._id || index}
                                                onClick={() => setSelectedPacking(packing)}
                                                className={cn(
                                                    "flex-1 px-6 py-3 border rounded-md text-[14px] transition-all",
                                                    selectedPacking?.name === packing.name
                                                        ? "bg-foreground/5 border-foreground/30"
                                                        : "bg-transparent border-foreground/10 hover:border-foreground/20"
                                                )}
                                            >
                                                {packing.name} ({packing.units} units)
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="text-[14px] text-foreground/60 mb-2 block">
                                    Quantity
                                </label>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center border border-foreground/10 rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="p-3 hover:bg-foreground/5 transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-20 text-center border-x border-foreground/10 py-3 focus:outline-none bg-transparent"
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="p-3 hover:bg-foreground/5 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[12px] text-foreground/40 mb-1">Total</div>
                                        <div className="text-[24px] font-medium">
                                            £{totalPrice.toFixed(2)}{' '}<span className="text-[14px] text-foreground/40 font-light">incl. vat</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={cn(
                                    "w-full bg-foreground text-background py-4 px-6 rounded-md font-medium text-[14px] uppercase tracking-widest transition-all duration-300 mb-6 flex items-center justify-center gap-2",
                                    isAddingToCart ? "bg-brand-green" : "hover:bg-brand-green"
                                )}
                            >
                                <ShoppingCart size={18} className={cn(isAddingToCart && "animate-bounce")} />
                                {isAddingToCart ? 'Added!' : 'Add to cart'}
                            </button>

                            {/* Delivery Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-foreground/10">
                                <div className="flex gap-3">
                                    <div className="text-foreground/60">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="1" y="3" width="15" height="13"></rect>
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-medium mb-1">Estimated Arrival</div>
                                        <div className="text-[13px] text-foreground/60">Tracked delivery: 1 - 3 business days</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-foreground/60">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-medium mb-1">Prefer to collect?</div>
                                        <div className="text-[13px] text-foreground/60">
                                            Select at checkout to collect from Cape Town office (Mon-Fri 08:00-16:00)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[13px] text-foreground/60 mb-2">
                                Please note: delivery fees will be calculated at checkout.
                            </p>
                            <p className="text-[13px] text-foreground/60">
                                Free delivery for orders over £100 (incl. VAT).
                            </p>
                        </div>
                    </div>

                    {/* Collapsible Sections */}
                    <div className="mt-16 max-w-[900px]">
                        {/* Details Section */}
                        <div className="border-b border-foreground/10">
                            <button
                                onClick={() => toggleSection('details')}
                                className="w-full py-6 flex items-center justify-between text-left"
                            >
                                <span className="text-[20px] font-light font-display">Details</span>
                                {expandedSection === 'details' ? (
                                    <ChevronUp size={20} className="text-foreground/40" />
                                ) : (
                                    <ChevronDown size={20} className="text-foreground/40" />
                                )}
                            </button>
                            {expandedSection === 'details' && (
                                <div className="pb-8">
                                    <h3 className="text-[16px] font-medium mb-4">Description</h3>
                                    {product.description ? (
                                        <p className="text-[15px] text-foreground/70 leading-relaxed mb-8">
                                            {product.description}
                                        </p>
                                    ) : (
                                        <p className="text-[15px] text-foreground/40 leading-relaxed mb-8 italic">
                                            No description available for this product.
                                        </p>
                                    )}

                                    {/* Feature Icons */}
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 rounded-full border border-foreground/10 flex items-center justify-center mb-3 p-3">
                                                    <img
                                                        src={feature.icon}
                                                        alt={feature.label}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <span className="text-[12px] text-foreground/70">{feature.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details and Dimensions */}
                        <div className="border-b border-foreground/10">
                            <button
                                onClick={() => toggleSection('dimensions')}
                                className="w-full py-6 flex items-center justify-between text-left"
                            >
                                <span className="text-[20px] font-light font-display">Details and Dimensions</span>
                                {expandedSection === 'dimensions' ? (
                                    <ChevronUp size={20} className="text-foreground/40" />
                                ) : (
                                    <ChevronDown size={20} className="text-foreground/40" />
                                )}
                            </button>
                            {expandedSection === 'dimensions' && product.details && (
                                <div className="pb-8">
                                    <div className="space-y-3">
                                        {product.details.colour && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Colour</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.colour}</span>
                                            </div>
                                        )}
                                        {product.details.material && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Material</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.material}</span>
                                            </div>
                                        )}
                                        {product.details.productCode && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Product Code</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.productCode}</span>
                                            </div>
                                        )}
                                        {product.details.weight && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Weight</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.weight}</span>
                                            </div>
                                        )}
                                        {product.details.dimensions && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Dimensions</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.dimensions}</span>
                                            </div>
                                        )}
                                        {product.details.cartonWeight && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Carton Weight</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.cartonWeight}</span>
                                            </div>
                                        )}
                                        {product.details.cartonDimensions && (
                                            <div className="flex justify-between py-2">
                                                <span className="text-[14px] font-medium">Carton Dimensions</span>
                                                <span className="text-[14px] text-foreground/60">{product.details.cartonDimensions}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Storage */}
                        <div className="border-b border-foreground/10">
                            <button
                                onClick={() => toggleSection('storage')}
                                className="w-full py-6 flex items-center justify-between text-left"
                            >
                                <span className="text-[20px] font-light font-display">Storage</span>
                                {expandedSection === 'storage' ? (
                                    <ChevronUp size={20} className="text-foreground/40" />
                                ) : (
                                    <ChevronDown size={20} className="text-foreground/40" />
                                )}
                            </button>
                            {expandedSection === 'storage' && (
                                <div className="pb-8">
                                    <ul className="space-y-2">
                                        {(product.storage || [
                                            'Store in a cool, dry place (15–30°C, humidity <60%).',
                                            'Keep cartons off the floor on pallets.',
                                            'Protect from sunlight, heat, and moisture.',
                                            'Ensure good ventilation.',
                                            'Follow FIFO (First In, First Out) stock rotation.'
                                        ]).map((instruction, index) => (
                                            <li key={index} className="text-[15px] text-foreground/70 leading-relaxed">
                                                {instruction}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
