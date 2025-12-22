// Test script to verify Shopify credentials
// Run this with: node scripts/testShopifyCredentials.js

const { createStorefrontApiClient } = require('@shopify/storefront-api-client');

const SHOPIFY_CONFIG = {
    storeDomain: 'makkarestates.myshopify.com',
    apiVersion: '2025-01',
    storefrontAccessToken: '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',
};

const TEST_QUERY = `
  query TestConnection {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
    products(first: 3) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

async function testShopifyCredentials() {
    console.log('🔍 Testing Shopify Credentials...\n');
    console.log('Configuration:');
    console.log(`  Store Domain: ${SHOPIFY_CONFIG.storeDomain}`);
    console.log(`  API Version: ${SHOPIFY_CONFIG.apiVersion}`);
    console.log(`  Token: ${SHOPIFY_CONFIG.storefrontAccessToken.substring(0, 8)}...`);
    console.log('');

    try {
        // Create client
        const client = createStorefrontApiClient({
            storeDomain: SHOPIFY_CONFIG.storeDomain,
            apiVersion: SHOPIFY_CONFIG.apiVersion,
            publicAccessToken: SHOPIFY_CONFIG.storefrontAccessToken,
        });

        console.log('✅ Client created successfully\n');
        console.log('📡 Sending test query...\n');

        // Execute test query
        const response = await client.request(TEST_QUERY);

        console.log('Response received:', JSON.stringify(response, null, 2));

        if (response.errors && Array.isArray(response.errors)) {
            console.error('❌ GraphQL Errors:');
            response.errors.forEach((error) => {
                console.error(`  - ${error.message}`);
            });
            process.exit(1);
        }

        if (!response.data) {
            console.error('❌ No data returned from API');
            console.error('Full response:', response);
            process.exit(1);
        }

        const data = response.data;

        // Display shop info
        console.log('✅ Connection Successful!\n');
        console.log('📊 Shop Information:');
        console.log(`  Name: ${data.shop.name}`);
        console.log(`  Description: ${data.shop.description || 'N/A'}`);
        console.log(`  URL: ${data.shop.primaryDomain.url}`);
        console.log('');

        // Display products
        const products = data.products.edges;
        console.log(`📦 Products Found: ${products.length}`);

        if (products.length > 0) {
            console.log('\nFirst 3 Products:');
            products.forEach((edge, index) => {
                const product = edge.node;
                console.log(`\n  ${index + 1}. ${product.title}`);
                console.log(`     ID: ${product.id}`);
                console.log(`     Handle: ${product.handle}`);
                console.log(`     Price: ${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`);
                console.log(`     Available: ${product.availableForSale ? 'Yes' : 'No'}`);
            });
        } else {
            console.log('\n⚠️  No products found in store');
            console.log('   This is normal for a new store. Add some products in Shopify Admin.');
        }

        console.log('\n✅ All tests passed! Your Shopify credentials are working correctly.\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Connection Failed!\n');

        console.error('Error Details:');
        console.error(`  Message: ${error.message}`);
        console.error(`  Name: ${error.name}`);

        // Common error scenarios
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.error('\n💡 Possible Issues:');
            console.error('  - Invalid Storefront Access Token');
            console.error('  - Token may have been revoked');
            console.error('  - Check token in Shopify Admin > Apps > Your App > API credentials');
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
            console.error('\n💡 Possible Issues:');
            console.error('  - Invalid store domain');
            console.error('  - Store may not exist or is not accessible');
            console.error('  - Check that domain is: yourstore.myshopify.com (without https://)');
        } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
            console.error('\n💡 Possible Issues:');
            console.error('  - Network connection problem');
            console.error('  - Store domain may be incorrect');
            console.error('  - Check your internet connection');
        }

        console.error('\n');
        process.exit(1);
    }
}

// Run the test
testShopifyCredentials();
