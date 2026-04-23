"use client";

import React, { useState, useEffect } from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ProductStripSection from './product-strip-section';

export default function RecentlyViewedShop() {
    const { getRecentItems } = useRecentlyViewed();
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        // Read from localStorage on mount (client only)
        setItems(getRecentItems());
    }, []);

    if (items.length === 0) return null;

    return (
        <ProductStripSection
            title="Recently Viewed"
            subtitle="Products you've looked at"
            products={items}
        />
    );
}
