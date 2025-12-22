// Shopify Products Service

import {
    executeQuery,
    transformProduct,
    GET_PRODUCTS_QUERY,
    GET_PRODUCT_BY_ID_QUERY,
    GET_PRODUCT_BY_HANDLE_QUERY,
    SEARCH_PRODUCTS_QUERY,
    GET_COLLECTION_QUERY,
} from './shopifyClient';
import { MOCK_MODE } from '../config/shopify.config';
import { PRODUCTS } from '../data/mockData';
import type {
    ShopifyProduct,
    ShopifyCollection,
    ShopifyVariant,
} from '../types/shopify.types';
import { productCacheService } from './productCacheService';

// Fetch products with pagination
export async function getProducts(
    first: number = 20,
    after?: string
): Promise<{ products: ShopifyProduct[]; hasNextPage: boolean; endCursor?: string }> {
    if (MOCK_MODE) {
        return getMockProducts(first);
    }

    try {
        // Try cache first (only for first page)
        if (!after) {
            const cached = await productCacheService.getCachedProducts();
            if (cached) {
                return { products: cached, hasNextPage: false };
            }
        }

        const response = await executeQuery<{
            products: {
                edges: Array<{ node: any; cursor: string }>;
                pageInfo: { hasNextPage: boolean; endCursor: string };
            };
        }>(GET_PRODUCTS_QUERY, { first, after });

        if (response.errors || !response.data) {
            console.error('Error fetching products:', response.errors);
            // Try to return cached data even if expired
            const cached = await productCacheService.getCachedProducts();
            return cached ? { products: cached, hasNextPage: false } : { products: [], hasNextPage: false };
        }

        const products = response.data.products.edges.map((edge) =>
            transformProduct(edge.node)
        );

        // Cache first page results
        if (!after) {
            await productCacheService.cacheProducts(products);
        }

        return {
            products,
            hasNextPage: response.data.products.pageInfo.hasNextPage,
            endCursor: response.data.products.pageInfo.endCursor,
        };
    } catch (error) {
        console.error('Error in getProducts:', error);
        // Return cached data on error
        const cached = await productCacheService.getCachedProducts();
        return cached ? { products: cached, hasNextPage: false } : { products: [], hasNextPage: false };
    }
}

// Get product by ID
export async function getProductById(
    productId: string
): Promise<ShopifyProduct | null> {
    if (MOCK_MODE) {
        return getMockProductById(productId);
    }

    try {
        // Try cache first
        const cached = await productCacheService.getCachedProductDetail(productId);
        if (cached) {
            return cached;
        }

        const response = await executeQuery<{ product: any }>(
            GET_PRODUCT_BY_ID_QUERY,
            { id: productId }
        );

        if (response.errors || !response.data?.product) {
            console.error('Error fetching product:', response.errors);
            return null;
        }

        const product = transformProduct(response.data.product);

        // Cache the product detail
        await productCacheService.cacheProductDetail(productId, product);

        return product;
    } catch (error) {
        console.error('Error in getProductById:', error);
        // Return cached data on error
        return await productCacheService.getCachedProductDetail(productId);
    }
}

// Get product by handle
export async function getProductByHandle(
    handle: string
): Promise<ShopifyProduct | null> {
    if (MOCK_MODE) {
        return getMockProductByHandle(handle);
    }

    try {
        const response = await executeQuery<{ productByHandle: any }>(
            GET_PRODUCT_BY_HANDLE_QUERY,
            { handle }
        );

        if (response.errors || !response.data?.productByHandle) {
            console.error('Error fetching product:', response.errors);
            return null;
        }

        return transformProduct(response.data.productByHandle);
    } catch (error) {
        console.error('Error in getProductByHandle:', error);
        return null;
    }
}

// Search products
export async function searchProducts(
    query: string,
    first: number = 20
): Promise<ShopifyProduct[]> {
    if (MOCK_MODE) {
        return searchMockProducts(query);
    }

    try {
        // Try cache first
        const cached = await productCacheService.getCachedSearchResults(query);
        if (cached) {
            return cached;
        }

        const response = await executeQuery<{
            products: { edges: Array<{ node: any }> };
        }>(SEARCH_PRODUCTS_QUERY, { query, first });

        if (response.errors || !response.data) {
            console.error('Error searching products:', response.errors);
            return [];
        }

        const products = response.data.products.edges.map((edge) =>
            transformProduct(edge.node)
        );

        // Cache search results
        await productCacheService.cacheSearchResults(query, products);

        return products;
    } catch (error) {
        console.error('Error in searchProducts:', error);
        // Return cached results on error
        const cached = await productCacheService.getCachedSearchResults(query);
        return cached || [];
    }
}

// Get collection with products
export async function getCollection(
    handle: string,
    first: number = 20
): Promise<ShopifyCollection | null> {
    if (MOCK_MODE) {
        return getMockCollection(handle, first);
    }

    try {
        const response = await executeQuery<{ collectionByHandle: any }>(
            GET_COLLECTION_QUERY,
            { handle, first }
        );

        if (response.errors || !response.data?.collectionByHandle) {
            console.error('Error fetching collection:', response.errors);
            return null;
        }

        const collection = response.data.collectionByHandle;
        return {
            id: collection.id,
            title: collection.title,
            description: collection.description || '',
            handle: collection.handle,
            image: collection.image,
            products: collection.products.edges.map((edge: any) =>
                transformProduct(edge.node)
            ),
        };
    } catch (error) {
        console.error('Error in getCollection:', error);
        return null;
    }
}

// Get variant inventory
export async function getVariantInventory(
    variantId: string
): Promise<number | null> {
    if (MOCK_MODE) {
        return Math.floor(Math.random() * 50) + 1;
    }

    // In a real implementation, you might need to use the Admin API
    // or a custom backend endpoint for real-time inventory
    console.warn('Real-time inventory requires Admin API or custom backend');
    return null;
}

// Check product availability
export async function checkProductAvailability(
    productId: string,
    variantId?: string
): Promise<{ available: boolean; quantity?: number }> {
    if (MOCK_MODE) {
        return {
            available: true,
            quantity: Math.floor(Math.random() * 50) + 1,
        };
    }

    const product = await getProductById(productId);

    if (!product) {
        return { available: false };
    }

    if (variantId) {
        const variant = product.variants.find((v) => v.id === variantId);
        return {
            available: variant?.availableForSale || false,
            quantity: variant?.quantityAvailable,
        };
    }

    return {
        available: product.availableForSale,
    };
}

// Mock data helpers
function getMockProducts(first: number): {
    products: ShopifyProduct[];
    hasNextPage: boolean;
} {
    const mockProducts = PRODUCTS.slice(0, first).map(convertMockToShopify);
    return {
        products: mockProducts,
        hasNextPage: PRODUCTS.length > first,
    };
}

function getMockProductById(id: string): ShopifyProduct | null {
    const product = PRODUCTS.find((p) => p.id === id);
    return product ? convertMockToShopify(product) : null;
}

function getMockProductByHandle(handle: string): ShopifyProduct | null {
    const product = PRODUCTS.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, '-') === handle
    );
    return product ? convertMockToShopify(product) : null;
}

function searchMockProducts(query: string): ShopifyProduct[] {
    const lowerQuery = query.toLowerCase();
    return PRODUCTS.filter(
        (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery)
    ).map(convertMockToShopify);
}

function getMockCollection(
    handle: string,
    first: number
): ShopifyCollection | null {
    // Mock collection based on category
    const category = handle.replace(/-/g, ' ');
    const products = PRODUCTS.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
    )
        .slice(0, first)
        .map(convertMockToShopify);

    if (products.length === 0) {
        return null;
    }

    return {
        id: `collection-${handle}`,
        title: category.charAt(0).toUpperCase() + category.slice(1),
        description: `Collection of ${category} products`,
        handle,
        products,
    };
}

// Convert mock product to Shopify format
function convertMockToShopify(mockProduct: any): ShopifyProduct {
    const variant: ShopifyVariant = {
        id: `variant-${mockProduct.id}`,
        title: 'Default',
        price: {
            amount: mockProduct.price.toString(),
            currencyCode: 'USD',
        },
        compareAtPrice: mockProduct.buyNowPrice
            ? {
                amount: mockProduct.buyNowPrice.toString(),
                currencyCode: 'USD',
            }
            : undefined,
        availableForSale: true,
        quantityAvailable: Math.floor(Math.random() * 50) + 1,
        sku: `SKU-${mockProduct.id}`,
        selectedOptions: [],
        image: {
            id: `image-${mockProduct.id}`,
            url: mockProduct.image,
        },
    };

    // Build tags array
    const tags = [mockProduct.category, mockProduct.condition || 'New'];

    // Add auction tags if product is an auction
    if (mockProduct.isAuction) {
        tags.push('auction');
        tags.push(`auction:start_bid:${mockProduct.currentBid || mockProduct.price}`);
        if (mockProduct.buyNowPrice) {
            tags.push(`auction:buy_now:${mockProduct.buyNowPrice}`);
        }
        // Default auction duration: 2 hours (7200 seconds)
        tags.push('auction:duration:7200');
        // Set start time to now
        tags.push(`auction:start_time:${Date.now()}`);
    }

    return {
        id: `product-${mockProduct.id}`,
        title: mockProduct.name,
        description: mockProduct.description || '',
        handle: mockProduct.name.toLowerCase().replace(/\s+/g, '-'),
        vendor: mockProduct.seller?.name || 'Unknown',
        productType: mockProduct.category,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        availableForSale: true,
        priceRange: {
            minVariantPrice: variant.price,
            maxVariantPrice: variant.price,
        },
        images: (mockProduct.images || [mockProduct.image]).map(
            (url: string, index: number) => ({
                id: `image-${mockProduct.id}-${index}`,
                url,
            })
        ),
        variants: [variant],
    };
}
