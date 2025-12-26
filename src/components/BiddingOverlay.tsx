import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useBidding } from '../context/BiddingContext';
import { SwipeButton } from './SwipeButton';
import { useTranslation } from '../hooks/useTranslation';

interface InlineBiddingProps {
    productId: string;
    productName: string;
    compact?: boolean;
}

export const InlineBidding: React.FC<InlineBiddingProps> = ({
    productId,
    productName,
    compact = true,
}) => {
    const { t } = useTranslation();
    const { getBidData, placeBid } = useBidding();
    const bidData = getBidData(productId);
    const [selectedIncrement, setSelectedIncrement] = useState(10);
    const [showHistory, setShowHistory] = useState(false);
    const [bidSuccess, setBidSuccess] = useState(false);
    const pulseAnim = new Animated.Value(1);

    if (!bidData) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleQuickBid = async (increment: number) => {
        const newBid = bidData.currentBid + increment;
        const success = await placeBid(productId, newBid);

        if (success) {
            // Show success feedback
            setBidSuccess(true);
            setTimeout(() => setBidSuccess(false), 1500);
        }
    };

    // Pulse animation for urgent time
    useEffect(() => {
        if (bidData.timeLeft < 30 && bidData.isActive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [bidData.timeLeft]);

    // Color coding for time urgency
    const getTimeColor = () => {
        if (!bidData.isActive) return '#9CA3AF';
        if (bidData.timeLeft < 30) return '#EF4444'; // Red - urgent!
        if (bidData.timeLeft < 60) return '#F59E0B'; // Orange - warning
        return '#FFFFFF'; // White - normal
    };

    const timeColor = getTimeColor();
    const isWinning = bidData.highestBidder === 'You';

    return (
        <View style={styles.container}>
            <View style={[styles.bidCard, bidSuccess && styles.bidCardSuccess]}>
                {/* Timer - Top Right */}
                <View style={styles.topBar}>
                    <Text style={styles.productName} numberOfLines={1}>{productName}</Text>
                    <Animated.View
                        style={[
                            styles.timerContainer,
                            { transform: [{ scale: bidData.timeLeft < 30 ? pulseAnim : 1 }] }
                        ]}
                    >
                        <Clock color={timeColor} size={16} />
                        <Text style={[styles.timerText, { color: timeColor }]}>
                            {bidData.isActive ? formatTime(bidData.timeLeft) : t('live.bidding.ended')}
                        </Text>
                    </Animated.View>
                </View>

                {/* Current Bid - Large and Centered */}
                <View style={styles.bidDisplay}>
                    <Text style={styles.bidLabel}>{t('live.bidding.currentBid')}</Text>
                    <Text style={[styles.bidAmount, bidSuccess && styles.bidAmountSuccess]}>
                        {t('common.currency')}{bidData.currentBid}
                    </Text>
                    {isWinning ? (
                        <View style={styles.winningBadge}>
                            <TrendingUp color="#10B981" size={16} />
                            <Text style={styles.winningText}>{t('live.bidding.winning')}</Text>
                        </View>
                    ) : bidData.totalBids > 0 && (
                        <Text style={styles.bidsCount}>{bidData.totalBids} {t('live.bidding.bids')}</Text>
                    )}
                </View>

                {/* Quick Bid Controls */}
                {bidData.isActive && (
                    <View style={styles.bidControls}>
                        {/* Increment Selector */}
                        <View style={styles.incrementRow}>
                            {[10, 25, 50].map((amount) => (
                                <TouchableOpacity
                                    key={amount}
                                    onPress={() => setSelectedIncrement(amount)}
                                    style={[
                                        styles.incrementButton,
                                        selectedIncrement === amount && styles.incrementButtonActive
                                    ]}
                                >
                                    <Text style={[
                                        styles.incrementText,
                                        selectedIncrement === amount && styles.incrementTextActive
                                    ]}>
                                        +{t('common.currency')}{amount}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Yellow Swipe-to-Bid (WhatNot Style) */}
                        <SwipeButton
                            onSwipeSuccess={() => handleQuickBid(selectedIncrement)}
                            label={`${t('live.bidding.swipeToBid')} ${t('common.currency')}${bidData.currentBid + selectedIncrement}`}
                            backgroundColor="rgba(255, 193, 7, 0.2)" // Yellow/gold background
                            thumbColor="#FFC107" // Yellow/gold thumb (WhatNot signature)
                            successColor="#10B981" // Green success
                        />
                    </View>
                )}

                {/* Expandable Bid History */}
                {bidData.totalBids > 0 && (
                    <TouchableOpacity
                        onPress={() => setShowHistory(!showHistory)}
                        style={styles.historyToggle}
                    >
                        <Text style={styles.historyToggleText}>
                            {showHistory ? t('common.hide') : t('common.view')} {t('live.bidding.history')}
                        </Text>
                        {showHistory ? (
                            <ChevronUp color="rgba(255,255,255,0.6)" size={16} />
                        ) : (
                            <ChevronDown color="rgba(255,255,255,0.6)" size={16} />
                        )}
                    </TouchableOpacity>
                )}

                {/* Bid History (Expandable) */}
                {showHistory && (
                    <View style={styles.historyContainer}>
                        {bidData.bidHistory.length === 0 ? (
                            <Text style={styles.noBidsText}>{t('live.bidding.noBids')}</Text>
                        ) : (
                            bidData.bidHistory.slice(0, 3).map((bid, index) => (
                                <View
                                    key={bid.id}
                                    style={[
                                        styles.historyItem,
                                        index !== Math.min(2, bidData.bidHistory.length - 1) && styles.historyItemBorder
                                    ]}
                                >
                                    <View>
                                        <Text style={[
                                            styles.historyUser,
                                            bid.isYou && styles.historyUserYou
                                        ]}>
                                            {bid.user}
                                        </Text>
                                        <Text style={styles.historyTime}>{bid.timestamp}</Text>
                                    </View>
                                    <Text style={styles.historyAmount}>{t('common.currency')}{bid.amount}</Text>
                                </View>
                            ))
                        )}
                    </View>
                )}
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    bidCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(255, 193, 7, 0.4)', // Yellow border
    },
    bidCardSuccess: {
        borderColor: '#10B981', // Green border on success
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    productName: {
        flex: 1,
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
        fontWeight: '500',
        marginRight: 12,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    timerText: {
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    bidDisplay: {
        alignItems: 'center',
        paddingVertical: 16,
        marginBottom: 16,
    },
    bidLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    bidAmount: {
        color: '#FFFFFF',
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    bidAmountSuccess: {
        color: '#10B981', // Green on success
    },
    winningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    winningText: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bidsCount: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 13,
        marginTop: 6,
    },
    bidControls: {
        gap: 12,
    },
    incrementRow: {
        flexDirection: 'row',
        gap: 10,
    },
    incrementButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
    },
    incrementButtonActive: {
        backgroundColor: 'rgba(255, 193, 7, 0.25)', // Yellow background
        borderColor: '#FFC107', // Yellow border
    },
    incrementText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 15,
        fontWeight: 'bold',
    },
    incrementTextActive: {
        color: '#FFC107', // Yellow text
    },
    historyToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        marginTop: 8,
    },
    historyToggleText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontWeight: '600',
    },
    historyContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    noBidsText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: 12,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    historyItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    },
    historyUser: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    historyUserYou: {
        color: '#FFC107', // Yellow for user's bids
    },
    historyTime: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
        marginTop: 2,
    },
    historyAmount: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
