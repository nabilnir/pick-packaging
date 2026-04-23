"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist, WishlistItem } from '@/contexts/wishlist-context';
import { useToast } from '@/components/ui/toast-provider';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    product: WishlistItem;
    className?: string;
    size?: number;
}

export default function WishlistButton({ product, className, size = 16 }: WishlistButtonProps) {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const { success, info } = useToast();
    const wishlisted = isWishlisted(product.id);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const result = toggleWishlist(product);
        if (result === 'added') {
            success('Saved to wishlist', product.name);
        } else {
            info('Removed from wishlist', product.name);
        }
    };

    return (
        <button
            onClick={handleClick}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={cn(
                'group/heart flex items-center justify-center rounded-full transition-all duration-300',
                'w-9 h-9 bg-background/80 backdrop-blur-sm border border-foreground/10 shadow-sm',
                'hover:border-foreground/30 hover:scale-110 active:scale-95',
                wishlisted && 'border-red-200 bg-red-50',
                className
            )}
        >
            <Heart
                size={size}
                strokeWidth={1.5}
                className={cn(
                    'transition-all duration-300',
                    wishlisted
                        ? 'fill-red-500 stroke-red-500 scale-110'
                        : 'stroke-foreground/40 group-hover/heart:stroke-foreground'
                )}
            />
        </button>
    );
}
