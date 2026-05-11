// ─── Wishlist Types ───────────────────────────────────────────────────────────

export type WishlistSort =
    | 'recently-saved'
    | 'price-asc'
    | 'price-desc'
    | 'alphabetical';

export interface WishlistItem {
    /** Wishlist entry ID (unique per saved item) */
    id: string;
    /** The product's own ID */
    productId: string;
    productName: string;
    sku: string;
    vendorName: string;
    /** Live/current price in ZAR (cents or rands — stay consistent) */
    currentPrice: number;
    /** Price at the time the item was saved — used for change detection */
    savedPrice: number;
    imageUrl: string;
    inStock: boolean;
    savedAt: string; // ISO-8601
    quantity: number;
}

// Derived helpers
export type PriceChangeDirection = 'dropped' | 'risen' | 'unchanged';

export function getPriceDirection(item: WishlistItem): PriceChangeDirection {
    if (item.currentPrice < item.savedPrice) return 'dropped';
    if (item.currentPrice > item.savedPrice) return 'risen';
    return 'unchanged';
}
