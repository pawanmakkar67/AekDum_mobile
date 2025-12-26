// Bidding Service - Handles bid operations and Shopify integration
// Currently in mock mode - ready for backend integration

import { socketClient } from './socketClient';

export interface BidData {
    productId: string;
    currentBid: number;
    highestBidder: string;
    totalBids: number;
    bidIncrement: number;
    buyNowPrice?: number;
    timeLeft: number; // seconds
    isActive: boolean;
    bidHistory: BidHistoryItem[];
}

export interface BidHistoryItem {
    id: string;
    user: string;
    amount: number;
    timestamp: string;
    isYou: boolean;
}

export interface PlaceBidRequest {
    productId: string;
    amount: number;
    userId: string;
    username: string;
    streamId?: string;
}

export interface PlaceBidResponse {
    success: boolean;
    bidData?: BidData;
    error?: string;
}

class BiddingService {
    private mockMode = true; // Toggle for backend integration

    /**
     * Place a bid on an auction product
     */
    async placeBid(request: PlaceBidRequest): Promise<PlaceBidResponse> {
        try {
            if (this.mockMode) {
                return this.placeBidMock(request);
            }

            // TODO: Real backend implementation
            // const response = await fetch('/api/bids/place', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(request),
            // });
            // return await response.json();

            return { success: false, error: 'Backend not configured' };
        } catch (error) {
            console.error('Error placing bid:', error);
            return { success: false, error: 'Failed to place bid' };
        }
    }

    /**
     * Get current bid data for a product
     */
    async getBidData(productId: string): Promise<BidData | null> {
        try {
            if (this.mockMode) {
                return this.getBidDataMock(productId);
            }

            // TODO: Real backend implementation
            // const response = await fetch(`/api/bids/${productId}`);
            // return await response.json();

            return null;
        } catch (error) {
            console.error('Error getting bid data:', error);
            return null;
        }
    }

    /**
     * Subscribe to real-time bid updates via socket
     */
    subscribeToBidUpdates(productId: string, callback: (bidData: BidData) => void) {
        socketClient.on('bid_placed', (data: any) => {
            if (data.productId === productId) {
                callback(data.bidData);
            }
        });

        socketClient.on('auction_ending_soon', (data: any) => {
            if (data.productId === productId) {
                console.log(`Auction ending in ${data.secondsLeft} seconds!`);
            }
        });

        socketClient.on('auction_ended', (data: any) => {
            if (data.productId === productId) {
                console.log('Auction ended!', data);
            }
        });

        // Subscribe to product-specific room
        socketClient.subscribeToAuction(productId);
    }

    /**
     * Unsubscribe from bid updates
     */
    unsubscribeFromBidUpdates(productId: string) {
        socketClient.unsubscribeFromAuction(productId);
        socketClient.off('bid_placed');
        socketClient.off('auction_ending_soon');
        socketClient.off('auction_ended');
    }

    /**
     * Emit bid event via socket (for real-time updates)
     */
    emitBidPlaced(request: PlaceBidRequest) {
        socketClient.placeBid(
            request.productId,
            request.amount,
            request.userId,
            request.username,
            request.streamId
        );
    }

    // ==================== MOCK MODE METHODS ====================

    private placeBidMock(request: PlaceBidRequest): Promise<PlaceBidResponse> {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Emit socket event for real-time simulation
                this.emitBidPlaced(request);

                resolve({
                    success: true,
                    bidData: {
                        productId: request.productId,
                        currentBid: request.amount,
                        highestBidder: request.username,
                        totalBids: 0, // Will be updated by context
                        bidIncrement: 10,
                        timeLeft: 300,
                        isActive: true,
                        bidHistory: [],
                    },
                });
            }, 300);
        });
    }

    private getBidDataMock(productId: string): BidData | null {
        // Return null - data will be managed by BiddingContext
        return null;
    }

    /**
     * Initialize auction for a product (mock mode)
     */
    initializeAuction(productId: string, initialBid: number, buyNowPrice?: number, duration: number = 60): BidData {
        return {
            productId,
            currentBid: initialBid,
            highestBidder: '',
            totalBids: 0,
            bidIncrement: 10,
            buyNowPrice,
            timeLeft: duration,
            isActive: true,
            bidHistory: [],
        };
    }
}

export const biddingService = new BiddingService();
