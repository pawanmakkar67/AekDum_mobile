import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { Clock, TrendingUp, ChevronDown, ChevronUp, X } from 'lucide-react-native';
import { useBidding } from '../context/BiddingContext';
import { SwipeButton } from './SwipeButton';
import { useTranslation } from '../hooks/useTranslation';

interface BiddingBottomSheetProps {
    productId: string;
    productName: string;
    visible: boolean;
    onClose: () => void;
}

export const BiddingBottomSheet: React.FC<BiddingBottomSheetProps> = ({
    productId,
    productName,
    visible,
    onClose,
}) => {
    const { t } = useTranslation();
    const { getBidData, placeBid, walletBalance, blockedAmount } = useBidding();
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
            setBidSuccess(true);
            setTimeout(() => {
                setBidSuccess(false);
                onClose(); // Close bottom sheet after successful bid
            }, 1500);
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

    const getTimeColor = () => {
        if (!bidData.isActive) return '#9CA3AF';
        if (bidData.timeLeft < 30) return '#EF4444';
        if (bidData.timeLeft < 60) return '#F59E0B';
        return '#FFFFFF';
    };

    const timeColor = getTimeColor();
    const isWinning = bidData.highestBidder === 'You';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bottomSheet}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.title}>Live Auction</Text>
                            <Animated.View
                                style={[
                                    styles.timerContainer,
                                    { transform: [{ scale: bidData.timeLeft < 30 ? pulseAnim : 1 }] }
                                ]}
                            >
                                <Clock color={timeColor} size={14} />
                                <Text style={[styles.timerText, { color: timeColor }]}>
                                    {bidData.isActive ? formatTime(bidData.timeLeft) : 'Ended'}
                                </Text>
                            </Animated.View>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Wallet Info */}
                    <View className="flex-row justify-between items-center mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <View className="flex-row items-center">
                            <Text className="text-xs text-gray-500 font-medium">Wallet Balance:</Text>
                            <Text className="text-sm font-bold ml-1 text-gray-900">₹{walletBalance.toLocaleString()}</Text>
                        </View>
                        {blockedAmount > 0 && (
                            <View className="flex-row items-center">
                                <Text className="text-xs text-red-500 font-medium">Blocked:</Text>
                                <Text className="text-sm font-bold ml-1 text-red-600">₹{blockedAmount.toLocaleString()}</Text>
                            </View>
                        )}
                    </View>

                    {/* Current Bid Display */}
                    <View style={[styles.bidDisplay, bidSuccess && styles.bidDisplaySuccess]}>
                        <Text style={styles.bidLabel}>Current Bid</Text>
                        <Text style={[styles.bidAmount, bidSuccess && styles.bidAmountSuccess]}>
                            {t('common.currency')}{bidData.currentBid}
                        </Text>
                        {isWinning ? (
                            <View style={styles.winningBadge}>
                                <TrendingUp color="#10B981" size={16} />
                                <Text style={styles.winningText}>You're winning!</Text>
                            </View>
                        ) : bidData.totalBids > 0 && (
                            <View style={styles.bidsInfo}>
                                <TrendingUp color="rgba(0,0,0,0.5)" size={14} />
                                <Text style={styles.bidsCount}>{bidData.totalBids} bids</Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Bid Controls */}
                    {bidData.isActive && (
                        <View style={styles.bidControls}>
                            <Text style={styles.sectionLabel}>Quick Bid</Text>

                            {/* Increment Buttons */}
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

                            {/* Yellow Swipe-to-Bid */}
                            <SwipeButton
                                onSwipeSuccess={() => handleQuickBid(selectedIncrement)}
                                label={`Swipe to Bid ${t('common.currency')}${bidData.currentBid + selectedIncrement}`}
                                backgroundColor="rgba(255, 193, 7, 0.2)"
                                thumbColor="#FFC107"
                                successColor="#10B981"
                            />
                        </View>
                    )}

                    {/* Bid History */}
                    {bidData.totalBids > 0 && (
                        <>
                            <TouchableOpacity
                                onPress={() => setShowHistory(!showHistory)}
                                style={styles.historyToggle}
                            >
                                <Text style={styles.historyToggleText}>Bid History</Text>
                                {showHistory ? (
                                    <ChevronUp color="rgba(0,0,0,0.6)" size={20} />
                                ) : (
                                    <ChevronDown color="rgba(0,0,0,0.6)" size={20} />
                                )}
                            </TouchableOpacity>

                            {showHistory && (
                                <View style={styles.historyContainer}>
                                    {bidData.bidHistory.length === 0 ? (
                                        <Text style={styles.noBidsText}>No bids yet</Text>
                                    ) : (
                                        bidData.bidHistory.slice(0, 5).map((bid, index) => (
                                            <View
                                                key={bid.id}
                                                style={[
                                                    styles.historyItem,
                                                    index !== Math.min(4, bidData.bidHistory.length - 1) && styles.historyItemBorder
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
                        </>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    timerText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    bidDisplay: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    bidDisplaySuccess: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10B981',
    },
    bidLabel: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bidAmount: {
        color: '#10B981',
        fontSize: 48,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    bidAmountSuccess: {
        color: '#10B981',
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
    bidsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    bidsCount: {
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: 13,
        fontWeight: '600',
    },
    bidControls: {
        marginBottom: 20,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    incrementRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    incrementButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
    },
    incrementButtonActive: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '#2563EB',
    },
    incrementText: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    incrementTextActive: {
        color: '#2563EB',
    },
    historyToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    historyToggleText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    historyContainer: {
        marginTop: 12,
    },
    noBidsText: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 13,
        textAlign: 'center',
        paddingVertical: 12,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    historyItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    },
    historyUser: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',
    },
    historyUserYou: {
        color: '#2563EB',
    },
    historyTime: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 11,
        marginTop: 2,
    },
    historyAmount: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
