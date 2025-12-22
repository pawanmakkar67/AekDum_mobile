// Shopify Auction Integration Service
// Provides helper functions to detect and extract auction data from Shopify products

import type { ShopifyProduct } from '../types/shopify.types';

/**
 * Check if a Shopify product is configured as an auction
 * Uses tag-based detection: products tagged with 'auction' or 'auction:*'
 */
export function isAuctionProduct(product: ShopifyProduct): boolean {
    return product.tags.some(tag =>
        tag.toLowerCase() === 'auction' ||
        tag.toLowerCase().startsWith('auction:')
    );
}

/**
 * Extract auction configuration from product tags
 * Tag format:
 * - auction:start_bid:180
 * - auction:buy_now:220
 * - auction:duration:3600
 * - auction:start_time:1733318400000
 */
export function getAuctionDataFromTags(product: ShopifyProduct) {
    if (!isAuctionProduct(product)) {
        return null;
    }

    const tags = product.tags;

    // Extract auction parameters from tags
    const startBidTag = tags.find(t => t.toLowerCase().startsWith('auction:start_bid:'));
    const buyNowTag = tags.find(t => t.toLowerCase().startsWith('auction:buy_now:'));
    const durationTag = tags.find(t => t.toLowerCase().startsWith('auction:duration:'));
    const startTimeTag = tags.find(t => t.toLowerCase().startsWith('auction:start_time:'));

    // Parse start time (default to now if not specified)
    const startTime = startTimeTag
        ? parseInt(startTimeTag.split(':')[2])
        : Date.now();

    // Parse duration (default to 1 hour)
    const duration = durationTag
        ? parseInt(durationTag.split(':')[2])
        : 3600;

    // Calculate time remaining
    const endTime = startTime + (duration * 1000);
    const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

    // Parse starting bid (default to product price)
    const currentBid = startBidTag
        ? parseFloat(startBidTag.split(':')[2])
        : parseFloat(product.priceRange.minVariantPrice.amount);

    // Parse buy now price (optional)
    const buyNowPrice = buyNowTag
        ? parseFloat(buyNowTag.split(':')[2])
        : undefined;

    return {
        isAuction: true,
        currentBid,
        buyNowPrice,
        timeLeft,
        isActive: timeLeft > 0,
        startTime,
        endTime,
        duration,
    };
}

/**
 * Helper to get auction status text
 */
export function getAuctionStatus(timeLeft: number): string {
    if (timeLeft <= 0) return 'Ended';

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Check if auction is ending soon (less than 5 minutes)
 */
export function isAuctionEndingSoon(timeLeft: number): boolean {
    return timeLeft > 0 && timeLeft < 300;
}

/**
 * Check if auction is in critical time (less than 30 seconds)
 */
export function isAuctionCritical(timeLeft: number): boolean {
    return timeLeft > 0 && timeLeft < 30;
}
