"use client";

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    max?: number;
    size?: number;
    className?: string;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
    rating, 
    max = 5, 
    size = 16, 
    className,
    interactive = false,
    onRatingChange
}: StarRatingProps) {
    const [hover, setHover] = React.useState(0);

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                const active = interactive ? (hover || rating) >= starValue : rating >= starValue;
                
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onMouseEnter={() => interactive && setHover(starValue)}
                        onMouseLeave={() => interactive && setHover(0)}
                        onClick={() => interactive && onRatingChange?.(starValue)}
                        className={cn(
                            "transition-all duration-200",
                            interactive && "hover:scale-120 active:scale-90 cursor-pointer",
                            !interactive && "cursor-default"
                        )}
                    >
                        <Star 
                            size={size}
                            className={cn(
                                "transition-colors",
                                active 
                                    ? "fill-amber-400 stroke-amber-400" 
                                    : "fill-transparent stroke-foreground/20"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
