// Shopify Storefront API Types

export interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    handle: string;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
    priceRange: {
        minVariantPrice: ShopifyMoney;
        maxVariantPrice: ShopifyMoney;
    };
    availableForSale: boolean;
    tags: string[];
    vendor: string;
    productType: string;
    createdAt: string;
    updatedAt: string;
}

export interface ShopifyVariant {
    id: string;
    title: string;
    price: ShopifyMoney;
    compareAtPrice?: ShopifyMoney;
    availableForSale: boolean;
    quantityAvailable: number;
    sku?: string;
    weight?: number;
    weightUnit?: string;
    image?: ShopifyImage;
    selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyImage {
    id: string;
    url: string;
    altText?: string;
    width?: number;
    height?: number;
}

export interface ShopifyMoney {
    amount: string;
    currencyCode: string;
}

export interface ShopifySelectedOption {
    name: string;
    value: string;
}

// Cart Types
export interface ShopifyCart {
    id: string;
    checkoutUrl: string;
    lines: ShopifyCartLine[];
    cost: {
        totalAmount: ShopifyMoney;
        subtotalAmount: ShopifyMoney;
        totalTaxAmount?: ShopifyMoney;
        totalDutyAmount?: ShopifyMoney;
    };
    totalQuantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ShopifyCartLine {
    id: string;
    quantity: number;
    merchandise: ShopifyVariant;
    cost: {
        totalAmount: ShopifyMoney;
        amountPerQuantity: ShopifyMoney;
    };
    attributes: ShopifyAttribute[];
}

export interface ShopifyAttribute {
    key: string;
    value: string;
}

// Customer Types
export interface ShopifyCustomer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName: string;
    phone?: string;
    acceptsMarketing: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ShopifyCustomerAccessToken {
    accessToken: string;
    expiresAt: string;
}

// Checkout Types
export interface ShopifyCheckout {
    id: string;
    webUrl: string;
    lineItems: ShopifyCheckoutLineItem[];
    subtotalPrice: ShopifyMoney;
    totalPrice: ShopifyMoney;
    totalTax: ShopifyMoney;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ShopifyCheckoutLineItem {
    id: string;
    title: string;
    variant: ShopifyVariant;
    quantity: number;
}

// Collection Types
export interface ShopifyCollection {
    id: string;
    title: string;
    description: string;
    handle: string;
    image?: ShopifyImage;
    products: ShopifyProduct[];
}

// GraphQL Response Types
export interface ShopifyGraphQLResponse<T> {
    data?: T;
    errors?: ShopifyGraphQLError[];
}

export interface ShopifyGraphQLError {
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, any>;
}

// Authentication Types
export interface MultipassToken {
    email: string;
    created_at: string;
    return_to?: string;
    identifier?: string;
    remote_ip?: string;
    tag_string?: string;
}

export interface CustomerCredentials {
    email: string;
    password: string;
}

// Inventory Types
export interface InventoryUpdate {
    variantId: string;
    quantityAvailable: number;
    timestamp: string;
}

// Live Shopping Types
export interface LiveProduct {
    shopifyProduct: ShopifyProduct;
    selectedVariant?: ShopifyVariant;
    isPinned: boolean;
    isFlashDeal: boolean;
    flashDealPrice?: ShopifyMoney;
    flashDealEndsAt?: string;
    taggedAt: string;
    position?: { x: number; y: number };
}

export interface ProductTag {
    id: string;
    productId: string;
    variantId?: string;
    streamId: string;
    timestamp: number;
    position?: { x: number; y: number };
    isPinned: boolean;
}

// Order Types
export interface ShopifyOrder {
    id: string;
    name: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
    totalPrice: ShopifyMoney;
    subtotalPrice: ShopifyMoney;
    totalShippingPrice: ShopifyMoney;
    totalTax: ShopifyMoney;
    lineItems: ShopifyOrderLineItem[];
    shippingAddress?: ShopifyAddress;
}

export interface ShopifyOrderLineItem {
    title: string;
    quantity: number;
    variant: ShopifyVariant;
}

export interface ShopifyAddress {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    country?: string;
    zip?: string;
}
