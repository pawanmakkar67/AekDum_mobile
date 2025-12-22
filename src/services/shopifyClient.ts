// Shopify Storefront API GraphQL Client

import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { SHOPIFY_CONFIG, MOCK_MODE } from '../config/shopify.config';
import type {
    ShopifyGraphQLResponse,
    ShopifyProduct,
    ShopifyCart,
    ShopifyCustomer,
    ShopifyCollection,
} from '../types/shopify.types';

// Initialize Shopify Storefront API client
const client = MOCK_MODE
    ? null
    : createStorefrontApiClient({
        storeDomain: SHOPIFY_CONFIG.storeDomain,
        apiVersion: SHOPIFY_CONFIG.apiVersion,
        publicAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
    });

// GraphQL Queries
export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    description
    handle
    vendor
    productType
    tags
    createdAt
    updatedAt
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          sku
          weight
          weightUnit
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          ...ProductFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_BY_ID_QUERY = `
  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_COLLECTION_QUERY = `
  query GetCollection($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      description
      handle
      image {
        id
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// Cart Queries and Mutations
export const CREATE_CART_MUTATION = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                        }
                      }
                    }
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_LINES_MUTATION = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Customer Queries
export const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const GET_CUSTOMER_QUERY = `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
      phone
      acceptsMarketing
      createdAt
      updatedAt
    }
  }
`;

// Helper function to execute GraphQL queries
export async function executeQuery<T>(
    query: string,
    variables?: Record<string, any>
): Promise<ShopifyGraphQLResponse<T>> {
    if (MOCK_MODE || !client) {
        console.warn('Shopify client is in MOCK_MODE. Returning mock data.');
        return { data: {} as T };
    }

    try {
        const response = await client.request(query, { variables });
        return response as ShopifyGraphQLResponse<T>;
    } catch (error) {
        console.error('Shopify GraphQL Error:', error);
        return {
            errors: [
                {
                    message: error instanceof Error ? error.message : 'Unknown error',
                },
            ],
        };
    }
}

// Transform Shopify GraphQL response to our types
export function transformProduct(node: any): ShopifyProduct {
    return {
        id: node.id,
        title: node.title,
        description: node.description || '',
        handle: node.handle,
        vendor: node.vendor,
        productType: node.productType,
        tags: node.tags || [],
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        availableForSale: node.availableForSale,
        priceRange: node.priceRange,
        images: node.images?.edges?.map((edge: any) => edge.node) || [],
        variants: node.variants?.edges?.map((edge: any) => edge.node) || [],
    };
}

export function transformCart(cart: any): ShopifyCart {
    return {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        totalQuantity: cart.totalQuantity || 0,
        cost: cart.cost,
        lines: cart.lines?.edges?.map((edge: any) => edge.node) || [],
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
}

export default client;
