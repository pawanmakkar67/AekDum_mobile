// Order Service
// Manages order history and tracking with Shopify integration

import { executeQuery } from './shopifyClient';
import { productCacheService } from './productCacheService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShopifyOrder, ShopifyCustomer } from '../types/shopify.types';

const CACHE_KEY = '@cached_orders';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// GraphQL query for customer orders
const GET_CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                    }
                  }
                }
              }
            }
            shippingAddress {
              address1
              address2
              city
              province
              country
              zip
            }
          }
        }
      }
    }
  }
`;

interface CacheEntry {
    data: ShopifyOrder[];
    timestamp: number;
}

class OrderService {
    // Fetch customer orders
    async getOrders(
        customerAccessToken: string,
        limit: number = 20
    ): Promise<ShopifyOrder[]> {
        try {
            // Try cache first
            const cached = await this.getCachedOrders();
            if (cached) {
                return cached;
            }

            // Fetch from API
            const response = await executeQuery<{
                customer: {
                    orders: {
                        edges: Array<{ node: any }>;
                    };
                };
            }>(GET_CUSTOMER_ORDERS_QUERY, {
                customerAccessToken,
                first: limit,
            });

            if (response.errors || !response.data?.customer?.orders) {
                console.error('Error fetching orders:', response.errors);
                return [];
            }

            const orders = response.data.customer.orders.edges.map(
                (edge) => this.transformOrder(edge.node)
            );

            // Cache the orders
            await this.cacheOrders(orders);

            return orders;
        } catch (error) {
            console.error('Error in getOrders:', error);
            // Return cached data if available, even if expired
            const cached = await this.getCachedOrders(true);
            return cached || [];
        }
    }

    // Get single order by ID
    async getOrderById(
        customerAccessToken: string,
        orderId: string
    ): Promise<ShopifyOrder | null> {
        try {
            const orders = await this.getOrders(customerAccessToken);
            return orders.find((order) => order.id === orderId) || null;
        } catch (error) {
            console.error('Error getting order by ID:', error);
            return null;
        }
    }

    // Transform Shopify order to our format
    private transformOrder(node: any): ShopifyOrder {
        return {
            id: node.id,
            name: node.name,
            orderNumber: node.orderNumber,
            processedAt: node.processedAt,
            financialStatus: node.financialStatus,
            fulfillmentStatus: node.fulfillmentStatus,
            totalPrice: node.totalPrice,
            subtotalPrice: node.subtotalPrice,
            totalShippingPrice: node.totalShippingPrice,
            totalTax: node.totalTax,
            lineItems: node.lineItems.edges.map((edge: any) => ({
                title: edge.node.title,
                quantity: edge.node.quantity,
                variant: edge.node.variant,
            })),
            shippingAddress: node.shippingAddress,
        };
    }

    // Cache orders
    private async cacheOrders(orders: ShopifyOrder[]): Promise<void> {
        try {
            const entry: CacheEntry = {
                data: orders,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
        } catch (error) {
            console.error('Error caching orders:', error);
        }
    }

    // Get cached orders
    private async getCachedOrders(ignoreExpiry: boolean = false): Promise<ShopifyOrder[] | null> {
        try {
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const entry: CacheEntry = JSON.parse(cached);

            // Check if cache is still valid
            if (!ignoreExpiry && Date.now() - entry.timestamp > CACHE_DURATION) {
                await AsyncStorage.removeItem(CACHE_KEY);
                return null;
            }

            return entry.data;
        } catch (error) {
            console.error('Error getting cached orders:', error);
            return null;
        }
    }

    // Clear orders cache
    async clearOrdersCache(): Promise<void> {
        try {
            await AsyncStorage.removeItem(CACHE_KEY);
        } catch (error) {
            console.error('Error clearing orders cache:', error);
        }
    }

    // Track order (for push notifications)
    async trackOrder(orderId: string, userId: string): Promise<void> {
        try {
            // In a real app, you would call your backend to set up tracking
            // await fetch('https://your-backend.com/api/track-order', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ orderId, userId }),
            // });

            console.log('Order tracking enabled for:', orderId);
        } catch (error) {
            console.error('Error tracking order:', error);
        }
    }

    // Get order status summary
    getOrderStatusSummary(orders: ShopifyOrder[]): {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    } {
        return {
            pending: orders.filter(
                (o) => o.fulfillmentStatus === 'UNFULFILLED'
            ).length,
            processing: orders.filter(
                (o) => o.fulfillmentStatus === 'PARTIALLY_FULFILLED'
            ).length,
            shipped: orders.filter(
                (o) => o.fulfillmentStatus === 'FULFILLED'
            ).length,
            delivered: orders.filter(
                (o) => o.fulfillmentStatus === 'FULFILLED' &&
                    this.isDelivered(o)
            ).length,
            cancelled: orders.filter(
                (o) => o.financialStatus === 'VOIDED'
            ).length,
        };
    }

    // Check if order is delivered (simplified logic)
    private isDelivered(order: ShopifyOrder): boolean {
        // In a real app, you would check tracking information
        // For now, assume fulfilled orders older than 7 days are delivered
        const processedDate = new Date(order.processedAt);
        const daysSinceProcessed = (Date.now() - processedDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceProcessed > 7;
    }
}

export const orderService = new OrderService();
