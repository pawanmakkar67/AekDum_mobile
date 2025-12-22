// Live Commerce and Real-time Feature Types

import { ShopifyProduct, ShopifyVariant, ShopifyMoney } from './shopify.types';

// Flash Deal Types
export interface FlashDeal {
    id: string;
    productId: string;
    variantId?: string;
    streamId: string;
    originalPrice: ShopifyMoney;
    dealPrice: ShopifyMoney;
    discountPercentage: number;
    startTime: string;
    endTime: string;
    quantity: number;
    quantitySold: number;
    isActive: boolean;
    createdBy: string;
}

export interface CountdownDeal extends FlashDeal {
    timeRemaining: number; // in seconds
    urgencyLevel: 'low' | 'medium' | 'high';
}

// Product Tagging
export interface ProductTag {
    id: string;
    productId: string;
    variantId?: string;
    streamId: string;
    timestamp: number;
    position?: TagPosition;
    isPinned: boolean;
    pinnedAt?: string;
    pinnedBy?: string;
    metadata?: Record<string, any>;
}

export interface TagPosition {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
}

// Live Product Display
export interface LiveProductDisplay {
    product: ShopifyProduct;
    selectedVariant?: ShopifyVariant;
    tag: ProductTag;
    isPinned: boolean;
    isFlashDeal: boolean;
    flashDeal?: FlashDeal;
    inventory: {
        available: number;
        reserved: number;
        sold: number;
    };
    engagement: {
        views: number;
        clicks: number;
        addedToCart: number;
        purchased: number;
    };
}

// Real-time Inventory
export interface InventoryUpdate {
    productId: string;
    variantId: string;
    quantityAvailable: number;
    quantityReserved: number;
    lastUpdated: string;
    source: 'shopify' | 'stream' | 'manual';
}

export interface InventoryAlert {
    type: 'low_stock' | 'out_of_stock' | 'back_in_stock';
    productId: string;
    variantId: string;
    quantity: number;
    threshold?: number;
    timestamp: string;
}

// Chat Types
export interface ChatMessage {
    id: string;
    streamId: string;
    userId: string;
    username: string;
    userAvatar?: string;
    message: string;
    timestamp: number;
    type: 'text' | 'system' | 'product' | 'gift';
    badges?: UserBadge[];
    metadata?: Record<string, any>;
    isDeleted?: boolean;
    isPinned?: boolean;
}

export interface UserBadge {
    type: 'verified' | 'moderator' | 'vip' | 'subscriber' | 'top_buyer';
    label: string;
    color: string;
    icon?: string;
}

export interface ChatReaction {
    id: string;
    messageId: string;
    userId: string;
    emoji: string;
    timestamp: number;
}

// Gift/Tip System
export interface Gift {
    id: string;
    name: string;
    icon: string;
    animation?: string;
    value: number; // in cents
    currency: string;
}

export interface GiftSent {
    id: string;
    giftId: string;
    streamId: string;
    fromUserId: string;
    fromUsername: string;
    toUserId: string;
    toUsername: string;
    quantity: number;
    totalValue: number;
    timestamp: number;
    message?: string;
}

// Engagement Features
export interface Reaction {
    id: string;
    streamId: string;
    userId: string;
    type: 'heart' | 'fire' | 'clap' | 'wow' | 'laugh';
    timestamp: number;
    position?: { x: number; y: number };
}

export interface Poll {
    id: string;
    streamId: string;
    question: string;
    options: PollOption[];
    startTime: string;
    endTime?: string;
    isActive: boolean;
    totalVotes: number;
    createdBy: string;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
    percentage: number;
}

export interface PollVote {
    pollId: string;
    optionId: string;
    userId: string;
    timestamp: number;
}

// Live Shopping Session
export interface LiveShoppingSession {
    id: string;
    streamId: string;
    hostId: string;
    startTime: string;
    endTime?: string;
    status: 'scheduled' | 'live' | 'ended';
    products: LiveProductDisplay[];
    pinnedProduct?: LiveProductDisplay;
    activeDeals: FlashDeal[];
    stats: SessionStats;
    settings: SessionSettings;
}

export interface SessionStats {
    viewerCount: number;
    peakViewers: number;
    totalViews: number;
    chatMessages: number;
    reactions: number;
    productsShown: number;
    productsSold: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
}

export interface SessionSettings {
    chatEnabled: boolean;
    reactionsEnabled: boolean;
    giftsEnabled: boolean;
    purchaseEnabled: boolean;
    moderationMode: 'off' | 'auto' | 'manual';
    slowMode: boolean;
    slowModeDelay: number; // seconds
    subscriberOnly: boolean;
}

// Real-time Events
export type RealtimeEventType =
    | 'chat_message'
    | 'reaction'
    | 'gift_sent'
    | 'product_tagged'
    | 'product_pinned'
    | 'product_unpinned'
    | 'flash_deal_started'
    | 'flash_deal_ended'
    | 'inventory_updated'
    | 'viewer_joined'
    | 'viewer_left'
    | 'purchase_made'
    | 'poll_created'
    | 'poll_ended';

export interface RealtimeEvent {
    type: RealtimeEventType;
    streamId: string;
    timestamp: number;
    data: any;
    userId?: string;
}

// WebSocket Message Types
export interface WebSocketMessage {
    event: RealtimeEventType;
    data: any;
    timestamp: number;
    streamId?: string;
}

// User Presence
export interface UserPresence {
    userId: string;
    username: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
    lastSeen: string;
    currentStream?: string;
}

// Moderation
export interface ModerationAction {
    id: string;
    streamId: string;
    moderatorId: string;
    targetUserId: string;
    action: 'timeout' | 'ban' | 'delete_message' | 'warn';
    reason?: string;
    duration?: number; // in seconds, for timeout
    timestamp: number;
}

export interface BannedUser {
    userId: string;
    streamId?: string; // if null, banned globally
    bannedBy: string;
    reason?: string;
    bannedAt: string;
    expiresAt?: string;
    isPermanent: boolean;
}
