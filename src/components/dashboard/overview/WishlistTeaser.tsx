import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export interface WishlistPreview {
  id: string;
  image: string;
  name: string;
}

export interface WishlistTeaserProps {
  count: number;
  previews: WishlistPreview[];
  isLoading: boolean;
}

export function WishlistTeaser({ count, previews, isLoading }: WishlistTeaserProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col justify-between min-h-[180px]">
        <div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[60px] w-[60px] rounded bg-gray-200 animate-pulse shrink-0"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full min-h-[180px]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-3xl font-semibold text-[#1c3a2a]">
            {count}
          </div>
          <h3 className="text-sm font-medium text-gray-500">
            saved {count === 1 ? 'item' : 'items'}
          </h3>
        </div>
        <Link 
          href="/dashboard/wishlist"
          className="text-sm font-medium text-[#1c3a2a] hover:underline"
        >
          View wishlist &rarr;
        </Link>
      </div>

      <div className="mt-auto">
        {count === 0 ? (
          <div className="flex items-center gap-3 text-gray-400">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Nothing saved yet</span>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {previews.slice(0, 4).map((preview) => (
              <div 
                key={preview.id} 
                className="relative w-[60px] h-[60px] rounded overflow-hidden border border-gray-100 shrink-0 bg-gray-50"
                title={preview.name}
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
    </div>
  );
}
