"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    currency: string;
    packingType: {
        name: string;
        units: number;
        priceMultiplier: number;
    };
    volume?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    addToCart: (item: Omit<CartItem, 'id'>) => boolean;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    showToast: boolean;
    toastItem: CartItem | null;
    hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'pickpacking-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastItem, setToastItem] = useState<CartItem | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    // Load cart from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (saved) {
                try {
                    setItems(JSON.parse(saved));
                } catch (e) {
                    console.error('Error loading cart:', e);
                }
            }
        }
    }, []);

    // Save cart to localStorage when items change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items]);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => {
        const itemTotal = item.price * item.packingType.units * item.packingType.priceMultiplier * item.quantity;
        return sum + itemTotal;
    }, 0);

    const addToCart = useCallback((item: Omit<CartItem, 'id'>): boolean => {
        // Check if user is logged in
        if (!user) {
            router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
            return false;
        }

        const id = `${item.productId}-${item.packingType.name}-${item.volume || 'default'}`;

        setItems(prevItems => {
            const existingIndex = prevItems.findIndex(i => i.id === id);

            if (existingIndex >= 0) {
                // Update quantity of existing item
                const updated = [...prevItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + item.quantity
                };
                return updated;
            } else {
                // Add new item
                return [...prevItems, { ...item, id }];
            }
        });

        // Show toast
        setToastItem({ ...item, id });
        setShowToast(true);

        // Auto-hide toast after 5 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 5000);

        return true;
    }, [user, router]);

    const removeFromCart = useCallback((id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const hideToast = useCallback(() => {
        setShowToast(false);
    }, []);

    return (
        <CartContext.Provider value={{
            items,
            itemCount,
            subtotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            showToast,
            toastItem,
            hideToast
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
