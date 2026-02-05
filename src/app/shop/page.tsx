import React from 'react';
import Header from '@/components/sections/header';
import Footer from '@/components/sections/footer';
import ShopGrid from '@/components/sections/shop/shop-grid';

export const metadata = {
    title: 'Shop | Yucca Packaging',
    description: 'Explore our wide range of premium food and produce packaging solutions.',
};

const ShopPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <ShopGrid />
            </main>
            <Footer />
        </div>
    );
};

export default ShopPage;
