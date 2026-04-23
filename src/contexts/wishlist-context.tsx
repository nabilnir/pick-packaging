"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────
export interface WishlistItem {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    currency: string;
    isNew?: boolean;
}

interface WishlistContextType {
    items: WishlistItem[];
    itemCount: number;
    isWishlisted: (id: string) => boolean;
    toggleWishlist: (item: WishlistItem) => 'added' | 'removed';
    removeFromWishlist: (id: string) => void;
    clearWishlist: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = 'pickpacking-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    // Persist on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const isWishlisted = useCallback((id: string) => items.some(i => i.id === id), [items]);

    const toggleWishlist = useCallback((item: WishlistItem): 'added' | 'removed' => {
        let result: 'added' | 'removed' = 'added';
        setItems(prev => {
            if (prev.some(i => i.id === item.id)) {
                result = 'removed';
                return prev.filter(i => i.id !== item.id);
            }
            return [item, ...prev];
        });
        return result;
    }, []);

    const removeFromWishlist = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const clearWishlist = useCallback(() => setItems([]), []);

    return (
        <WishlistContext.Provider value={{
            items,
            itemCount: items.length,
            isWishlisted,
            toggleWishlist,
            removeFromWishlist,
            clearWishlist,
            isOpen,
            setIsOpen,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
