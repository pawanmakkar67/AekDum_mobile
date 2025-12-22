// Product Cache Service
// Implements offline product browsing with AsyncStorage caching

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShopifyProduct, ShopifyCollection } from '../types/shopify.types';

const CACHE_KEYS = {
    PRODUCTS: '@cached_products',
    COLLECTIONS: '@cached_collections',
    FEATURED_PRODUCTS: '@cached_featured_products',
    SEARCH_RESULTS: '@cached_search_',
    PRODUCT_DETAIL: '@cached_product_',
    CACHE_TIMESTAMP: '@cache_timestamp_',
};

const CACHE_DURATION = {
    PRODUCTS: 30 * 60 * 1000, // 30 minutes
    COLLECTIONS: 60 * 60 * 1000, // 1 hour
    SEARCH: 15 * 60 * 1000, // 15 minutes
    PRODUCT_DETAIL: 60 * 60 * 1000, // 1 hour
};

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class ProductCacheService {
    // Cache products list
    async cacheProducts(products: ShopifyProduct[]): Promise<void> {
        try {
            const entry: CacheEntry<ShopifyProduct[]> = {
                data: products,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(CACHE_KEYS.PRODUCTS, JSON.stringify(entry));
        } catch (error) {
            console.error('Error caching products:', error);
        }
    }

    // Get cached products
    async getCachedProducts(): Promise<ShopifyProduct[] | null> {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEYS.PRODUCTS);
            if (!cached) return null;

            const entry: CacheEntry<ShopifyProduct[]> = JSON.parse(cached);

            // Check if cache is still valid
            if (Date.now() - entry.timestamp > CACHE_DURATION.PRODUCTS) {
                await AsyncStorage.removeItem(CACHE_KEYS.PRODUCTS);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Error getting cached products:', error);
            return null;
        }
    }

    // Cache single product detail
    async cacheProductDetail(productId: string, product: ShopifyProduct): Promise<void> {
        try {
            const entry: CacheEntry<ShopifyProduct> = {
                data: product,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(
                `${CACHE_KEYS.PRODUCT_DETAIL}${productId}`,
                JSON.stringify(entry)
            );
        } catch (error) {
            console.error('Error caching product detail:', error);
        }
    }

    // Get cached product detail
    async getCachedProductDetail(productId: string): Promise<ShopifyProduct | null> {
        try {
            const cached = await AsyncStorage.getItem(`${CACHE_KEYS.PRODUCT_DETAIL}${productId}`);
            if (!cached) return null;

            const entry: CacheEntry<ShopifyProduct> = JSON.parse(cached);

            // Check if cache is still valid
            if (Date.now() - entry.timestamp > CACHE_DURATION.PRODUCT_DETAIL) {
                await AsyncStorage.removeItem(`${CACHE_KEYS.PRODUCT_DETAIL}${productId}`);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Error getting cached product detail:', error);
            return null;
        }
    }

    // Cache search results
    async cacheSearchResults(query: string, products: ShopifyProduct[]): Promise<void> {
        try {
            const entry: CacheEntry<ShopifyProduct[]> = {
                data: products,
                timestamp: Date.now(),
            };
            const key = `${CACHE_KEYS.SEARCH_RESULTS}${query.toLowerCase()}`;
            await AsyncStorage.setItem(key, JSON.stringify(entry));
        } catch (error) {
            console.error('Error caching search results:', error);
        }
    }

    // Get cached search results
    async getCachedSearchResults(query: string): Promise<ShopifyProduct[] | null> {
        try {
            const key = `${CACHE_KEYS.SEARCH_RESULTS}${query.toLowerCase()}`;
            const cached = await AsyncStorage.getItem(key);
            if (!cached) return null;

            const entry: CacheEntry<ShopifyProduct[]> = JSON.parse(cached);

            // Check if cache is still valid
            if (Date.now() - entry.timestamp > CACHE_DURATION.SEARCH) {
                await AsyncStorage.removeItem(key);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Error getting cached search results:', error);
            return null;
        }
    }

    // Cache collections
    async cacheCollections(collections: ShopifyCollection[]): Promise<void> {
        try {
            const entry: CacheEntry<ShopifyCollection[]> = {
                data: collections,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(CACHE_KEYS.COLLECTIONS, JSON.stringify(entry));
        } catch (error) {
            console.error('Error caching collections:', error);
        }
    }

    // Get cached collections
    async getCachedCollections(): Promise<ShopifyCollection[] | null> {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEYS.COLLECTIONS);
            if (!cached) return null;

            const entry: CacheEntry<ShopifyCollection[]> = JSON.parse(cached);

            // Check if cache is still valid
            if (Date.now() - entry.timestamp > CACHE_DURATION.COLLECTIONS) {
                await AsyncStorage.removeItem(CACHE_KEYS.COLLECTIONS);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Error getting cached collections:', error);
            return null;
        }
    }

    // Cache featured products
    async cacheFeaturedProducts(products: ShopifyProduct[]): Promise<void> {
        try {
            const entry: CacheEntry<ShopifyProduct[]> = {
                data: products,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(CACHE_KEYS.FEATURED_PRODUCTS, JSON.stringify(entry));
        } catch (error) {
            console.error('Error caching featured products:', error);
        }
    }

    // Get cached featured products
    async getCachedFeaturedProducts(): Promise<ShopifyProduct[] | null> {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEYS.FEATURED_PRODUCTS);
            if (!cached) return null;

            const entry: CacheEntry<ShopifyProduct[]> = JSON.parse(cached);

            // Check if cache is still valid
            if (Date.now() - entry.timestamp > CACHE_DURATION.PRODUCTS) {
                await AsyncStorage.removeItem(CACHE_KEYS.FEATURED_PRODUCTS);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Error getting cached featured products:', error);
            return null;
        }
    }

    // Clear all product caches
    async clearAllCaches(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key =>
                key.startsWith('@cached_')
            );
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Error clearing caches:', error);
        }
    }

    // Clear specific cache
    async clearCache(cacheKey: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(cacheKey);
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    // Get cache size (approximate)
    async getCacheSize(): Promise<number> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('@cached_'));

            let totalSize = 0;
            for (const key of cacheKeys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    totalSize += value.length;
                }
            }

            return totalSize;
        } catch (error) {
            console.error('Error getting cache size:', error);
            return 0;
        }
    }

    // Prune expired caches
    async pruneExpiredCaches(): Promise<void> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const cacheKeys = keys.filter(key => key.startsWith('@cached_'));

            for (const key of cacheKeys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    try {
                        const entry = JSON.parse(value);
                        // Check if it has timestamp and is expired (older than 24 hours)
                        if (entry.timestamp && Date.now() - entry.timestamp > 24 * 60 * 60 * 1000) {
                            await AsyncStorage.removeItem(key);
                        }
                    } catch {
                        // Invalid JSON, remove it
                        await AsyncStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.error('Error pruning expired caches:', error);
        }
    }
}

export const productCacheService = new ProductCacheService();
