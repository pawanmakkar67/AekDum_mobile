// Socket.io Client for Real-time Features
// Handles WebSocket connections for chat, inventory updates, and live events

import { io, Socket } from 'socket.io-client';
import { REALTIME_CONFIG } from '../config/shopify.config';
import type {
    ChatMessage,
    RealtimeEvent,
    InventoryUpdate,
    FlashDeal,
    Reaction,
} from '../types/liveCommerce.types';

class SocketClient {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = REALTIME_CONFIG.reconnectionAttempts;
    private listeners: Map<string, Set<Function>> = new Map();

    // Initialize connection
    connect(userId?: string): void {
        if (this.socket?.connected) {
            console.log('Socket already connected');
            return;
        }

        console.log('Connecting to socket server:', REALTIME_CONFIG.socketUrl);

        this.socket = io(REALTIME_CONFIG.socketUrl, {
            reconnection: REALTIME_CONFIG.reconnection,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: REALTIME_CONFIG.reconnectionDelay,
            auth: {
                userId,
            },
        });

        this.setupEventHandlers();
    }

    // Disconnect
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    // Join a stream room
    joinStream(streamId: string, userId?: string): void {
        this.emit('join_stream', { streamId, userId });
    }

    // Leave a stream room
    leaveStream(streamId: string): void {
        this.emit('leave_stream', { streamId });
    }

    // Start a stream
    startStream(stream: any): void {
        this.emit('stream_started', stream);
    }

    // End a stream
    endStream(streamId: string): void {
        this.emit('stream_ended', { streamId });
    }

    // Send chat message
    sendChatMessage(streamId: string, message: string, userId: string, username: string): void {
        const chatMessage: Partial<ChatMessage> = {
            streamId,
            message,
            userId,
            username,
            timestamp: Date.now(),
            type: 'text',
        };
        this.emit('chat_message', chatMessage);
    }

    // Send reaction
    sendReaction(streamId: string, type: Reaction['type'], userId: string): void {
        const reaction: Partial<Reaction> = {
            streamId,
            type,
            userId,
            timestamp: Date.now(),
        };
        this.emit('reaction', reaction);
    }

    // Tag product
    tagProduct(streamId: string, productId: string, variantId?: string): void {
        this.emit('tag_product', { streamId, productId, variantId, timestamp: Date.now() });
    }

    // Pin product
    pinProduct(streamId: string, productId: string): void {
        this.emit('pin_product', { streamId, productId });
    }

    // Unpin product
    unpinProduct(streamId: string): void {
        this.emit('unpin_product', { streamId });
    }

    // Start flash deal
    startFlashDeal(streamId: string, deal: Partial<FlashDeal>): void {
        this.emit('start_flash_deal', { streamId, deal });
    }

    // Update inventory
    updateInventory(update: InventoryUpdate): void {
        this.emit('inventory_update', update);
    }

    // ==================== BIDDING METHODS ====================

    // Place a bid
    placeBid(productId: string, amount: number, userId: string, username: string, streamId?: string): void {
        this.emit('place_bid', {
            productId,
            amount,
            userId,
            username,
            streamId,
            timestamp: Date.now(),
        });
    }

    // Subscribe to auction updates
    subscribeToAuction(productId: string): void {
        this.emit('subscribe_to_auction', { productId });
    }

    // Unsubscribe from auction updates
    unsubscribeFromAuction(productId: string): void {
        this.emit('unsubscribe_from_auction', { productId });
    }

    // Buy now (end auction immediately)
    buyNowAuction(productId: string, userId: string, amount: number): void {
        this.emit('buy_now_auction', { productId, userId, amount, timestamp: Date.now() });
    }


    // Event listeners
    on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Also register with socket
        if (this.socket) {
            this.socket.on(event, (...args: any[]) => {
                callback(...args);
            });
        }
    }

    // Remove event listener
    off(event: string, callback?: Function): void {
        if (callback) {
            this.listeners.get(event)?.delete(callback);
            if (this.socket) {
                this.socket.off(event, callback as any);
            }
        } else {
            this.listeners.delete(event);
            if (this.socket) {
                this.socket.off(event);
            }
        }
    }

    // Emit event
    private emit(event: string, data: any): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected. Cannot emit:', event);
        }
    }

    // Setup default event handlers
    private setupEventHandlers(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.reconnectAttempts++;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                this.disconnect();
            }
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        // Real-time events
        this.socket.on('chat_message', (message: ChatMessage) => {
            this.notifyListeners('chat_message', message);
        });

        this.socket.on('reaction', (reaction: Reaction) => {
            this.notifyListeners('reaction', reaction);
        });

        this.socket.on('product_tagged', (data: any) => {
            this.notifyListeners('product_tagged', data);
        });

        this.socket.on('product_pinned', (data: any) => {
            this.notifyListeners('product_pinned', data);
        });

        this.socket.on('product_unpinned', (data: any) => {
            this.notifyListeners('product_unpinned', data);
        });

        this.socket.on('flash_deal_started', (deal: FlashDeal) => {
            this.notifyListeners('flash_deal_started', deal);
        });

        this.socket.on('flash_deal_ended', (dealId: string) => {
            this.notifyListeners('flash_deal_ended', dealId);
        });

        this.socket.on('inventory_updated', (update: InventoryUpdate) => {
            this.notifyListeners('inventory_updated', update);
        });

        this.socket.on('viewer_count', (count: number) => {
            this.notifyListeners('viewer_count', count);
        });

        this.socket.on('stream_ended', (streamId: string) => {
            this.notifyListeners('stream_ended', streamId);
        });
    }

    // Notify all listeners for an event
    private notifyListeners(event: string, data: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }

    // Get connection status
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Get socket ID
    getSocketId(): string | undefined {
        return this.socket?.id;
    }
}

// Export singleton instance
export const socketClient = new SocketClient();

// Mock mode: Simulate real-time events for development
export function enableMockMode(): void {
    console.log('Socket client running in MOCK MODE');

    // Simulate connection
    setTimeout(() => {
        socketClient['notifyListeners']('connect', null);
    }, 500);
}

// Initialize mock mode if real-time is disabled
if (!REALTIME_CONFIG.enabled) {
    enableMockMode();
}
