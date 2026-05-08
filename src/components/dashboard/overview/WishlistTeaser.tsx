import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { WishlistPreview } from '@/types/dashboard';

export type { WishlistPreview };

export interface WishlistTeaserProps {
  count: number;
  previews: WishlistPreview[];
  isLoading: boolean;
}

export function WishlistTeaser({ count, previews, isLoading }: WishlistTeaserProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-border rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-[60px] w-[60px] rounded shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-3xl font-semibold text-[#1c3a2a]">{count}</p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
            Saved {count === 1 ? 'Item' : 'Items'}
          </p>
        </div>
        <Link
          href="/dashboard/wishlist"
          className="text-sm font-medium text-[#1c3a2a] hover:underline"
        >
          View wishlist →
        </Link>
      </div>

      {count === 0 ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span className="text-sm">Nothing saved yet</span>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {previews.slice(0, 4).map(preview => (
            <div
              key={preview.id}
              title={preview.name}
              className="relative w-[60px] h-[60px] rounded border border-border shrink-0 bg-gray-50 overflow-hidden"
            >
              <Image
                src={preview.image}
                alt={preview.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
