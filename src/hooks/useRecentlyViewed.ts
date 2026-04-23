"use client";

import { useEffect, useCallback } from 'react';

export interface RecentProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    image: string;
    isNew?: boolean;
    inStock?: boolean;
}

const STORAGE_KEY = 'pickpacking-recently-viewed';
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
    const getItems = useCallback((): RecentProduct[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }, []);

    const trackProduct = useCallback((product: RecentProduct) => {
        try {
            const current = getItems().filter(p => p.id !== product.id);
            const updated = [product, ...current].slice(0, MAX_ITEMS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch { /* ignore */ }
    }, [getItems]);

    const getRecentItems = useCallback((excludeId?: string): RecentProduct[] => {
        return getItems().filter(p => p.id !== excludeId);
    }, [getItems]);

    return { trackProduct, getRecentItems };
}
