// Shopify Context Provider
// Global state management for Shopify cart, customer, and products

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type {
    ShopifyCart,
    ShopifyCustomer,
    ShopifyProduct,
} from '../types/shopify.types';
import * as ShopifyAuth from '../services/shopifyAuth';
import * as ShopifyCartService from '../services/shopifyCart';
import * as ShopifyProducts from '../services/shopifyProducts';

interface ShopifyContextType {
    // Customer
    customer: ShopifyCustomer | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;

    // Cart
    cart: ShopifyCart | null;
    cartLoading: boolean;
    addToCart: (variantId: string, quantity?: number) => Promise<void>;
    removeFromCart: (lineId: string) => Promise<void>;
    updateCartLine: (lineId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCheckoutUrl: () => Promise<string | null>;
    buyNow: (variantId: string, quantity?: number) => Promise<string | null>;

    // Products
    searchProducts: (query: string) => Promise<ShopifyProduct[]>;
    getProduct: (productId: string) => Promise<ShopifyProduct | null>;

    // Loading states
    loading: boolean;
    error: string | null;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export function ShopifyProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [cart, setCart] = useState<ShopifyCart | null>(null);
    const [cartLoading, setCartLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize: Check auth and load cart
    useEffect(() => {
        initializeShopify();
    }, []);

    async function initializeShopify() {
        try {
            setLoading(true);

            // Check authentication
            const authenticated = await ShopifyAuth.isAuthenticated();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                const customerData = await ShopifyAuth.getCurrentCustomer();
                setCustomer(customerData);
            }

            // Load cart
            const cartData = await ShopifyCartService.getCart();
            setCart(cartData);
        } catch (err) {
            console.error('Error initializing Shopify:', err);
            setError(err instanceof Error ? err.message : 'Failed to initialize');
        } finally {
            setLoading(false);
        }
    }

    // Authentication
    async function login(email: string, password: string): Promise<boolean> {
        try {
            setError(null);
            const token = await ShopifyAuth.loginWithCredentials({ email, password });

            if (!token) {
                setError('Invalid credentials');
                return false;
            }

            const customerData = await ShopifyAuth.getCurrentCustomer();
            setCustomer(customerData);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
            return false;
        }
    }

    async function logout(): Promise<void> {
        try {
            await ShopifyAuth.logout();
            setCustomer(null);
            setIsAuthenticated(false);
            await clearCart();
        } catch (err) {
            console.error('Logout error:', err);
        }
    }

    // Cart operations
    async function addToCart(variantId: string, quantity: number = 1): Promise<void> {
        try {
            setCartLoading(true);
            setError(null);
            const updatedCart = await ShopifyCartService.addToCart(variantId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Add to cart error:', err);
            setError(err instanceof Error ? err.message : 'Failed to add to cart');
            throw err;
        } finally {
            setCartLoading(false);
        }
    }

    async function removeFromCart(lineId: string): Promise<void> {
        try {
            setCartLoading(true);
            setError(null);
            const updatedCart = await ShopifyCartService.removeFromCart(lineId);
            setCart(updatedCart);
        } catch (err) {
            console.error('Remove from cart error:', err);
            setError(err instanceof Error ? err.message : 'Failed to remove from cart');
            throw err;
        } finally {
            setCartLoading(false);
        }
    }

    async function updateCartLine(lineId: string, quantity: number): Promise<void> {
        try {
            setCartLoading(true);
            setError(null);
            const updatedCart = await ShopifyCartService.updateCartLine(lineId, quantity);
            setCart(updatedCart);
        } catch (err) {
            console.error('Update cart error:', err);
            setError(err instanceof Error ? err.message : 'Failed to update cart');
            throw err;
        } finally {
            setCartLoading(false);
        }
    }

    async function clearCart(): Promise<void> {
        try {
            await ShopifyCartService.clearCart();
            setCart(null);
        } catch (err) {
            console.error('Clear cart error:', err);
        }
    }

    async function getCheckoutUrl(): Promise<string | null> {
        return await ShopifyCartService.getCheckoutUrl();
    }

    async function buyNow(variantId: string, quantity: number = 1): Promise<string | null> {
        try {
            setCartLoading(true);
            const checkoutUrl = await ShopifyCartService.buyNow(variantId, quantity);
            // Refresh cart after buy now
            const updatedCart = await ShopifyCartService.getCart();
            setCart(updatedCart);
            return checkoutUrl;
        } catch (err) {
            console.error('Buy now error:', err);
            setError(err instanceof Error ? err.message : 'Failed to process purchase');
            return null;
        } finally {
            setCartLoading(false);
        }
    }

    // Product operations
    async function searchProducts(query: string): Promise<ShopifyProduct[]> {
        try {
            return await ShopifyProducts.searchProducts(query);
        } catch (err) {
            console.error('Search error:', err);
            return [];
        }
    }

    async function getProduct(productId: string): Promise<ShopifyProduct | null> {
        try {
            return await ShopifyProducts.getProductById(productId);
        } catch (err) {
            console.error('Get product error:', err);
            return null;
        }
    }

    const value: ShopifyContextType = {
        customer,
        isAuthenticated,
        login,
        logout,
        cart,
        cartLoading,
        addToCart,
        removeFromCart,
        updateCartLine,
        clearCart,
        getCheckoutUrl,
        buyNow,
        searchProducts,
        getProduct,
        loading,
        error,
    };

    return (
        <ShopifyContext.Provider value={value}>
            {children}
        </ShopifyContext.Provider>
    );
}

export function useShopify() {
    const context = useContext(ShopifyContext);
    if (context === undefined) {
        throw new Error('useShopify must be used within a ShopifyProvider');
    }
    return context;
}
