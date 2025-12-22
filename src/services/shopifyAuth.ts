// Shopify Authentication Service
// Supports both Multipass (Shopify Plus) and Storefront API Customer Access Tokens

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHOPIFY_CONFIG } from '../config/shopify.config';
import { executeQuery, CUSTOMER_ACCESS_TOKEN_CREATE, GET_CUSTOMER_QUERY } from './shopifyClient';
import type {
    ShopifyCustomer,
    ShopifyCustomerAccessToken,
    CustomerCredentials,
    MultipassToken,
} from '../types/shopify.types';

const STORAGE_KEYS = {
    ACCESS_TOKEN: '@shopify_access_token',
    CUSTOMER_DATA: '@shopify_customer_data',
    TOKEN_EXPIRY: '@shopify_token_expiry',
};

// Multipass Authentication (Shopify Plus only)
export async function generateMultipassToken(
    email: string,
    returnTo?: string
): Promise<string | null> {
    if (!SHOPIFY_CONFIG.enableMultipass || !SHOPIFY_CONFIG.multipassSecret) {
        console.warn('Multipass is not enabled or configured');
        return null;
    }

    try {
        // In a real implementation, this would be done on your backend server
        // to keep the Multipass secret secure
        const multipassData: MultipassToken = {
            email,
            created_at: new Date().toISOString(),
            return_to: returnTo,
        };

        // This is a placeholder - actual Multipass token generation should happen server-side
        console.warn('Multipass token generation should be implemented on your backend');

        // The token would be used to create a URL like:
        // https://your-store.myshopify.com/account/login/multipass/{token}

        return null;
    } catch (error) {
        console.error('Error generating Multipass token:', error);
        return null;
    }
}

// Storefront API Customer Authentication
export async function loginWithCredentials(
    credentials: CustomerCredentials
): Promise<ShopifyCustomerAccessToken | null> {
    try {
        const response = await executeQuery<{
            customerAccessTokenCreate: {
                customerAccessToken: ShopifyCustomerAccessToken;
                customerUserErrors: Array<{ message: string }>;
            };
        }>(CUSTOMER_ACCESS_TOKEN_CREATE, {
            input: {
                email: credentials.email,
                password: credentials.password,
            },
        });

        if (response.errors || !response.data) {
            console.error('Login error:', response.errors);
            return null;
        }

        const { customerAccessToken, customerUserErrors } =
            response.data.customerAccessTokenCreate;

        if (customerUserErrors && customerUserErrors.length > 0) {
            console.error('Customer errors:', customerUserErrors);
            return null;
        }

        // Store the access token
        await storeAccessToken(customerAccessToken);

        return customerAccessToken;
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    }
}

// Get current customer data
export async function getCurrentCustomer(): Promise<ShopifyCustomer | null> {
    try {
        const accessToken = await getStoredAccessToken();

        if (!accessToken) {
            return null;
        }

        // Check if token is expired
        if (await isTokenExpired()) {
            await clearAuthData();
            return null;
        }

        // Try to get cached customer data first
        const cachedCustomer = await getCachedCustomer();
        if (cachedCustomer) {
            return cachedCustomer;
        }

        // Fetch fresh customer data
        const response = await executeQuery<{ customer: ShopifyCustomer }>(
            GET_CUSTOMER_QUERY,
            { customerAccessToken: accessToken }
        );

        if (response.errors || !response.data?.customer) {
            return null;
        }

        // Cache the customer data
        await cacheCustomer(response.data.customer);

        return response.data.customer;
    } catch (error) {
        console.error('Error getting customer:', error);
        return null;
    }
}

// Logout
export async function logout(): Promise<void> {
    await clearAuthData();
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const accessToken = await getStoredAccessToken();
    if (!accessToken) {
        return false;
    }

    const expired = await isTokenExpired();
    if (expired) {
        await clearAuthData();
        return false;
    }

    return true;
}

// Storage helpers
async function storeAccessToken(
    tokenData: ShopifyCustomerAccessToken
): Promise<void> {
    try {
        await AsyncStorage.multiSet([
            [STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken],
            [STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt],
        ]);
    } catch (error) {
        console.error('Error storing access token:', error);
    }
}

async function getStoredAccessToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

async function isTokenExpired(): Promise<boolean> {
    try {
        const expiryDate = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
        if (!expiryDate) {
            return true;
        }

        return new Date(expiryDate) <= new Date();
    } catch (error) {
        console.error('Error checking token expiry:', error);
        return true;
    }
}

async function cacheCustomer(customer: ShopifyCustomer): Promise<void> {
    try {
        await AsyncStorage.setItem(
            STORAGE_KEYS.CUSTOMER_DATA,
            JSON.stringify(customer)
        );
    } catch (error) {
        console.error('Error caching customer:', error);
    }
}

async function getCachedCustomer(): Promise<ShopifyCustomer | null> {
    try {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_DATA);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Error getting cached customer:', error);
        return null;
    }
}

async function clearAuthData(): Promise<void> {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.CUSTOMER_DATA,
            STORAGE_KEYS.TOKEN_EXPIRY,
        ]);
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
}

// Mock authentication for development
export async function mockLogin(email: string): Promise<ShopifyCustomer> {
    const mockCustomer: ShopifyCustomer = {
        id: 'mock-customer-id',
        email,
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        acceptsMarketing: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await cacheCustomer(mockCustomer);

    // Store a mock token that expires in 24 hours
    await storeAccessToken({
        accessToken: 'mock-access-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    return mockCustomer;
}
