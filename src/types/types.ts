export interface Notification {
    id: string;
    type: 'bid' | 'outbid' | 'won' | 'order' | 'follow' | 'stream' | 'message';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    relatedId?: string; // ID of related item (order, product, user, etc.)
    imageUrl?: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    items: OrderItem[];
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    date: string;
    estimatedDelivery?: string;
    trackingNumber?: string;
    shippingAddress: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    seller: {
        id: string;
        name: string;
        avatar: string;
    };
}

export interface BidData {
    productId: string;
    currentBid: number;
    buyNowPrice?: number;
    bidIncrement: number;
    totalBids: number;
    timeLeft: number; // in seconds
    isActive: boolean;
    highestBidder?: string;
    bidHistory: BidHistoryItem[];
}

export interface BidHistoryItem {
    id: string;
    user: string;
    amount: number;
    timestamp: string;
    isYou?: boolean;
}

export interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio?: string;
    verified: boolean;
    rating: number;
    totalSales: number;
    totalPurchases: number;
    followers: number;
    following: number;
    joinDate: string;
    responseTime: string; // e.g., "Usually responds in 2 hours"
    badges: string[];
    socialLinks?: {
        instagram?: string;
        twitter?: string;
        youtube?: string;
    };
    stats: {
        itemsSold: number;
        activeListings: number;
        completedStreams: number;
        totalRevenue?: number;
    };
}

export interface StreamStatus {
    isLive: boolean;
    isBroadcaster: boolean;
    viewerCount: number;
    duration: number; // in seconds
    quality: 'auto' | 'high' | 'medium' | 'low';
}
