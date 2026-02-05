import React from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import productsData from '@/data/products.json';
import ProductDetailsContent from '@/components/sections/shop/product-details-content';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const product = productsData.find(p => p.slug === params.slug);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} | Yucca Packaging`,
        description: product.description,
    };
}

const ProductPage = ({ params }: { params: { slug: string } }) => {
    const product = productsData.find(p => p.slug === params.slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <ProductDetailsContent product={product} />
            </main>
            <Footer />
        </div>
    );
};

export default ProductPage;
