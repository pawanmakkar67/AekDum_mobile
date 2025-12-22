import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BidData, BidHistoryItem } from '../types/types';
import { biddingService } from '../services/biddingService';
import { socketClient } from '../services/socketClient';
import { notificationService } from '../services/NotificationService';

export interface PendingPayment {
    id: string;
    productName: string;
    amount: number;
    dueDate: number; // timestamp
}

interface BiddingContextType {
    activeBids: Map<string, BidData>;
    placeBid: (productId: string, amount: number) => Promise<boolean>;
    getBidData: (productId: string) => BidData | undefined;
    initializeBid: (productId: string, initialData: BidData) => void;
    walletBalance: number;
    blockedAmount: number;
    pendingPayments: PendingPayment[];
    addPendingPayment: (productName: string, amount: number) => void;
    payForProduct: (paymentId: string) => boolean;
}

const BiddingContext = createContext<BiddingContextType | undefined>(undefined);

export const BiddingProvider = ({ children }: { children: ReactNode }) => {
    const [activeBids, setActiveBids] = useState<Map<string, BidData>>(new Map());
    const [walletBalance, setWalletBalance] = useState(10000); // Mock starting balance
    const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

    // Calculate blocked amount based on active bids where we are the highest bidder
    const blockedAmount = Array.from(activeBids.values()).reduce((total, bid) => {
        if (bid.highestBidder === 'You' && bid.isActive) {
            return total + bid.currentBid;
        }
        return total;
    }, 0);

    const initializeBid = (productId: string, initialData: BidData) => {
        setActiveBids(prev => {
            const newMap = new Map(prev);
            newMap.set(productId, initialData);
            return newMap;
        });

        // Subscribe to real-time updates for this auction
        biddingService.subscribeToBidUpdates(productId, (updatedBidData) => {
            setActiveBids(prev => {
                const newMap = new Map(prev);
                newMap.set(productId, updatedBidData);
                return newMap;
            });
        });
    };

    const placeBid = async (productId: string, amount: number): Promise<boolean> => {
        // Check for overdue payments
        const now = Date.now();
        const hasOverdue = pendingPayments.some(p => p.dueDate < now);
        if (hasOverdue) {
            alert('🚫 Action Required: You have overdue payments! Please settle them to continue bidding.');
            return false;
        }

        const bidData = activeBids.get(productId);
        if (!bidData) return false;

        if (amount <= bidData.currentBid) {
            return false; // Bid must be higher than current bid
        }

        // Wallet Check
        // If we are already the highest bidder, we only need to cover the difference
        const currentMyBid = bidData.highestBidder === 'You' ? bidData.currentBid : 0;
        const additionalAmountNeeded = amount - currentMyBid;

        if (blockedAmount + additionalAmountNeeded > walletBalance) {
            alert(`Insufficient funds! Blocked: ₹${blockedAmount}, Wallet: ₹${walletBalance}`);
            return false;
        }

        try {
            // Call bidding service (which handles socket emission)
            const response = await biddingService.placeBid({
                productId,
                amount,
                userId: 'user123', // TODO: Get from auth context
                username: 'You',
                streamId: undefined, // TODO: Get from stream context if in live stream
            });

            if (!response.success) {
                return false;
            }

            // Update local state
            const newBidHistory: BidHistoryItem = {
                id: Date.now().toString(),
                user: 'You',
                amount,
                timestamp: 'Just now',
                isYou: true,
            };

            const updatedBidData: BidData = {
                ...bidData,
                currentBid: amount,
                totalBids: bidData.totalBids + 1,
                highestBidder: 'You',
                bidHistory: [newBidHistory, ...bidData.bidHistory],
            };

            setActiveBids(prev => {
                const newMap = new Map(prev);
                newMap.set(productId, updatedBidData);
                return newMap;
            });



            // Notify user
            notificationService.sendBidPlaced(productId, amount); // Ideally pass product name

            return true;
        } catch (error) {
            console.error('Error placing bid:', error);
            return false;
        }
    };

    const getBidData = (productId: string): BidData | undefined => {
        return activeBids.get(productId);
    };

    // Simulate real-time bid updates from other users
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBids(prev => {
                const newMap = new Map(prev);

                // Randomly update bids for active auctions
                newMap.forEach((bidData, productId) => {
                    if (bidData.isActive && Math.random() > 0.8) {
                        const increment = bidData.bidIncrement;
                        const newAmount = bidData.currentBid + increment;

                        const newBidHistory: BidHistoryItem = {
                            id: Date.now().toString(),
                            user: `user${Math.floor(Math.random() * 1000)}`,
                            amount: newAmount,
                            timestamp: 'Just now',
                            isYou: false,
                        };

                        const updatedBidData: BidData = {
                            ...bidData,
                            currentBid: newAmount,
                            totalBids: bidData.totalBids + 1,
                            highestBidder: newBidHistory.user,
                            bidHistory: [newBidHistory, ...bidData.bidHistory.slice(0, 9)], // Keep last 10
                        };

                        newMap.set(productId, updatedBidData);

                        // If we were the previous highest bidder and now we are outbid
                        if (bidData.highestBidder === 'You' && newBidHistory.user !== 'You') {
                            notificationService.sendOutbid(productId, newAmount);
                        }
                    }
                });

                return newMap;
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Countdown timer for auctions
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBids(prev => {
                const newMap = new Map(prev);

                newMap.forEach((bidData, productId) => {
                    if (bidData.isActive && bidData.timeLeft > 0) {
                        const updatedBidData: BidData = {
                            ...bidData,
                            timeLeft: Math.max(0, bidData.timeLeft - 1),
                            isActive: bidData.timeLeft - 1 > 0,
                        };
                        newMap.set(productId, updatedBidData);
                    }
                });

                return newMap;
            });
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    const addPendingPayment = (productName: string, amount: number) => {
        const newPayment: PendingPayment = {
            id: Date.now().toString(),
            productName,
            amount,
            dueDate: Date.now() + 5 * 60 * 1000 // 5 minutes from now
        };
        setPendingPayments(prev => [...prev, newPayment]);
    };

    const payForProduct = (paymentId: string) => {
        const payment = pendingPayments.find(p => p.id === paymentId);
        if (!payment) return false;

        if (walletBalance >= payment.amount) {
            setWalletBalance(prev => prev - payment.amount);
            setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
            return true;
        }
        return false;
    };

    return (
        <BiddingContext.Provider
            value={{
                activeBids,
                placeBid,
                getBidData,
                initializeBid,
                walletBalance,
                blockedAmount,
                pendingPayments,
                addPendingPayment,
                payForProduct,
            }}
        >
            {children}
        </BiddingContext.Provider>
    );
};

export const useBidding = () => {
    const context = useContext(BiddingContext);
    if (!context) {
        throw new Error('useBidding must be used within BiddingProvider');
    }
    return context;
};
