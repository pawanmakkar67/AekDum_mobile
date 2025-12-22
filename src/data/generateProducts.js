// Helper script to generate additional mock products
// Run this to expand the PRODUCTS array in mockData.ts

const additionalProducts = [
    // Products 7-30 (24 more products)
    {
        id: '7',
        name: 'Nike Dunk Low Panda',
        price: 110,
        priceString: '$110',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        description: 'Nike Dunk Low in classic Panda colorway. Black and white leather. Size 10. Worn once, excellent condition.',
        condition: 'Used - Like New',
        category: 'Sneakers',
        seller: { id: 'seller1', name: 'SneakerHeadNYC', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60', rating: 4.8, totalSales: 342 },
        isAuction: false,
        buyNowPrice: 110,
        shipping: 'Free shipping',
        views: 320,
    },
    {
        id: '8',
        name: 'Charizard VMAX Rainbow Rare',
        price: 280,
        priceString: '$280',
        image: 'https://images.unsplash.com/photo-1613771404721-c5b425876d90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        images: ['https://images.unsplash.com/photo-1613771404721-c5b425876d90?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'],
        description: 'Charizard VMAX Rainbow Rare from Champions Path. Near mint condition, pack fresh.',
        condition: 'Near Mint',
        category: 'TCG',
        seller: { id: 'seller2', name: 'PokeMasterAsh', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60', rating: 4.9, totalSales: 567 },
        isAuction: true,
        currentBid: 280,
        buyNowPrice: 350,
        bids: 15,
        timeLeft: '3h 20m',
        shipping: 'Free shipping',
        views: 567,
    },
    // Add 22 more products following the same pattern...
    // I'll add them to the actual mockData.ts file
];

console.log('Additional products template created');
console.log(`Total products will be: ${6 + additionalProducts.length}`);
