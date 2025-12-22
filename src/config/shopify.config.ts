// Shopify Storefront API Configuration
// Replace these values with your actual Shopify store credentials

export const SHOPIFY_CONFIG = {
    // Your Shopify store domain (e.g., 'your-store.myshopify.com')
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'makkarestates.myshopify.com',

    // Storefront API access token
    // Get this from: Shopify Admin > Apps > Develop apps > Create an app > Configure Storefront API
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN || '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',

    // Storefront API version
    apiVersion: '2025-01',

    // Multipass secret (only for Shopify Plus)
    // Get this from: Shopify Admin > Settings > Customer accounts > Multipass
    multipassSecret: process.env.SHOPIFY_MULTIPASS_SECRET || '',

    // Enable Multipass authentication (requires Shopify Plus)
    enableMultipass: false,

    // GraphQL endpoint
    get graphqlEndpoint() {
        return `https://${this.storeDomain}/api/${this.apiVersion}/graphql.json`;
    },

    // Checkout domain
    get checkoutDomain() {
        return `https://${this.storeDomain}`;
    },
};

// Mock mode for development without Shopify credentials
export const MOCK_MODE = !process.env.SHOPIFY_STORE_DOMAIN || SHOPIFY_CONFIG.storefrontAccessToken === 'demo-token-replace-with-real';

// Streaming provider configuration
export const STREAMING_CONFIG = {
    provider: 'agora', // 'agora' | 'aws-ivs' | 'mux'

    // Agora configuration
    agora: {
        appId: process.env.AGORA_APP_ID || '',
        appCertificate: process.env.AGORA_APP_CERTIFICATE || '',
    },

    // AWS IVS configuration
    awsIvs: {
        region: process.env.AWS_REGION || 'us-east-1',
        channelArn: process.env.AWS_IVS_CHANNEL_ARN || '',
    },

    // Mux configuration
    mux: {
        tokenId: process.env.MUX_TOKEN_ID || '',
        tokenSecret: process.env.MUX_TOKEN_SECRET || '',
    },
};

// WebSocket/Real-time configuration
export const REALTIME_CONFIG = {
    // Socket.io server URL
    socketUrl: process.env.SOCKET_SERVER_URL || 'http://localhost:3001',

    // Enable real-time features
    enabled: true,

    // Reconnection settings
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
};
