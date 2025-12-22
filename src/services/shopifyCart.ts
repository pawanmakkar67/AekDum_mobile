// Shopify Cart Service

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    executeQuery,
    transformCart,
    CREATE_CART_MUTATION,
    ADD_TO_CART_MUTATION,
    UPDATE_CART_LINES_MUTATION,
    REMOVE_FROM_CART_MUTATION,
} from './shopifyClient';
import { MOCK_MODE } from '../config/shopify.config';
import type { ShopifyCart, ShopifyCartLine } from '../types/shopify.types';

const CART_STORAGE_KEY = '@shopify_cart_id';

// Get or create cart
export async function getCart(): Promise<ShopifyCart | null> {
    const cartId = await getStoredCartId();

    if (!cartId) {
        return await createCart();
    }

    // In a real implementation, you would fetch the cart by ID
    // For now, we'll create a new one if none exists
    if (MOCK_MODE) {
        return getMockCart();
    }

    return null;
}

// Create new cart
export async function createCart(
    lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<ShopifyCart | null> {
    if (MOCK_MODE) {
        const cart = getMockCart();
        await storeCartId(cart.id);
        return cart;
    }

    try {
        const response = await executeQuery<{
            cartCreate: {
                cart: any;
                userErrors: Array<{ field: string[]; message: string }>;
            };
        }>(CREATE_CART_MUTATION, {
            input: {
                lines: lines.map((line) => ({
                    merchandiseId: line.merchandiseId,
                    quantity: line.quantity,
                })),
            },
        });

        if (response.errors || !response.data) {
            console.error('Error creating cart:', response.errors);
            return null;
        }

        const { cart, userErrors } = response.data.cartCreate;

        if (userErrors && userErrors.length > 0) {
            console.error('Cart creation errors:', userErrors);
            return null;
        }

        const transformedCart = transformCart(cart);
        await storeCartId(transformedCart.id);

        return transformedCart;
    } catch (error) {
        console.error('Error in createCart:', error);
        return null;
    }
}

// Add item to cart
export async function addToCart(
    variantId: string,
    quantity: number = 1,
    attributes?: Array<{ key: string; value: string }>
): Promise<ShopifyCart | null> {
    let cartId = await getStoredCartId();

    // Create cart if it doesn't exist
    if (!cartId) {
        return await createCart([{ merchandiseId: variantId, quantity }]);
    }

    if (MOCK_MODE) {
        return getMockCart();
    }

    try {
        const response = await executeQuery<{
            cartLinesAdd: {
                cart: any;
                userErrors: Array<{ field: string[]; message: string }>;
            };
        }>(ADD_TO_CART_MUTATION, {
            cartId,
            lines: [
                {
                    merchandiseId: variantId,
                    quantity,
                    attributes,
                },
            ],
        });

        if (response.errors || !response.data) {
            console.error('Error adding to cart:', response.errors);
            return null;
        }

        const { cart, userErrors } = response.data.cartLinesAdd;

        if (userErrors && userErrors.length > 0) {
            console.error('Add to cart errors:', userErrors);
            return null;
        }

        return transformCart(cart);
    } catch (error) {
        console.error('Error in addToCart:', error);
        return null;
    }
}

// Update cart line quantity
export async function updateCartLine(
    lineId: string,
    quantity: number
): Promise<ShopifyCart | null> {
    const cartId = await getStoredCartId();

    if (!cartId) {
        console.error('No cart found');
        return null;
    }

    if (MOCK_MODE) {
        return getMockCart();
    }

    try {
        const response = await executeQuery<{
            cartLinesUpdate: {
                cart: any;
                userErrors: Array<{ field: string[]; message: string }>;
            };
        }>(UPDATE_CART_LINES_MUTATION, {
            cartId,
            lines: [
                {
                    id: lineId,
                    quantity,
                },
            ],
        });

        if (response.errors || !response.data) {
            console.error('Error updating cart:', response.errors);
            return null;
        }

        const { cart, userErrors } = response.data.cartLinesUpdate;

        if (userErrors && userErrors.length > 0) {
            console.error('Update cart errors:', userErrors);
            return null;
        }

        return transformCart(cart);
    } catch (error) {
        console.error('Error in updateCartLine:', error);
        return null;
    }
}

// Remove item from cart
export async function removeFromCart(lineId: string): Promise<ShopifyCart | null> {
    const cartId = await getStoredCartId();

    if (!cartId) {
        console.error('No cart found');
        return null;
    }

    if (MOCK_MODE) {
        return getMockCart();
    }

    try {
        const response = await executeQuery<{
            cartLinesRemove: {
                cart: any;
                userErrors: Array<{ field: string[]; message: string }>;
            };
        }>(REMOVE_FROM_CART_MUTATION, {
            cartId,
            lineIds: [lineId],
        });

        if (response.errors || !response.data) {
            console.error('Error removing from cart:', response.errors);
            return null;
        }

        const { cart, userErrors } = response.data.cartLinesRemove;

        if (userErrors && userErrors.length > 0) {
            console.error('Remove from cart errors:', userErrors);
            return null;
        }

        return transformCart(cart);
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        return null;
    }
}

// Clear cart
export async function clearCart(): Promise<void> {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
}

// Get cart checkout URL
export async function getCheckoutUrl(): Promise<string | null> {
    const cart = await getCart();
    return cart?.checkoutUrl || null;
}

// Storage helpers
async function storeCartId(cartId: string): Promise<void> {
    try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, cartId);
    } catch (error) {
        console.error('Error storing cart ID:', error);
    }
}

async function getStoredCartId(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error('Error getting cart ID:', error);
        return null;
    }
}

// Mock cart for development
function getMockCart(): ShopifyCart {
    return {
        id: 'mock-cart-id',
        checkoutUrl: 'https://demo-store.myshopify.com/checkout/mock',
        totalQuantity: 0,
        cost: {
            totalAmount: {
                amount: '0.00',
                currencyCode: 'USD',
            },
            subtotalAmount: {
                amount: '0.00',
                currencyCode: 'USD',
            },
        },
        lines: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// Quick add to cart with product tagging during live stream
export async function quickAddFromLiveStream(
    variantId: string,
    streamId: string,
    productId: string
): Promise<ShopifyCart | null> {
    // Add stream context as cart attributes
    return await addToCart(variantId, 1, [
        { key: '_stream_id', value: streamId },
        { key: '_product_id', value: productId },
        { key: '_source', value: 'live_stream' },
    ]);
}

// Buy now - creates cart and returns checkout URL
export async function buyNow(
    variantId: string,
    quantity: number = 1
): Promise<string | null> {
    // Clear existing cart
    await clearCart();

    // Create new cart with single item
    const cart = await createCart([{ merchandiseId: variantId, quantity }]);

    return cart?.checkoutUrl || null;
}
