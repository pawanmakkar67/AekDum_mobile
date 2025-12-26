// Countdown Deal Component
// Displays flash sales with real-time countdown timer

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import type { CountdownDeal } from '../types/liveCommerce.types';
import { useTranslation } from '../hooks/useTranslation';

interface CountdownDealProps {
    deal: CountdownDeal;
    onExpire?: () => void;
}

export function CountdownDealComponent({ deal, onExpire }: CountdownDealProps) {
    const { t } = useTranslation();
    const [timeRemaining, setTimeRemaining] = useState(deal.timeRemaining);
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                const newTime = prev - 1;
                if (newTime <= 0) {
                    clearInterval(interval);
                    onExpire?.();
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Pulse animation for urgency
        if (timeRemaining <= 60) {
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
    }, [timeRemaining]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getUrgencyColor = (): string => {
        if (timeRemaining <= 30) return '#EF4444'; // Red
        if (timeRemaining <= 300) return '#F59E0B'; // Orange
        return '#10B981'; // Green
    };

    const getUrgencyText = (): string => {
        if (timeRemaining <= 30) return t('live.countdown.endingSoon');
        if (timeRemaining <= 300) return t('live.countdown.hurryUp');
        return t('live.countdown.limitedTime');
    };

    if (timeRemaining <= 0) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ scale: pulseAnim }] },
                { borderColor: getUrgencyColor() },
            ]}
        >
            <View style={[styles.badge, { backgroundColor: getUrgencyColor() }]}>
                <Text style={styles.badgeText}>{getUrgencyText()}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.priceRow}>
                    <Text style={styles.originalPrice}>
                        {t('common.currency')}{deal.originalPrice.amount}
                    </Text>
                    <Text style={styles.dealPrice}>
                        {t('common.currency')}{deal.dealPrice.amount}
                    </Text>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            {deal.discountPercentage}% {t('live.countdown.off')}
                        </Text>
                    </View>
                </View>

                <View style={styles.timerRow}>
                    <Text style={styles.timerLabel}>{t('live.countdown.endsIn')}</Text>
                    <Text style={[styles.timer, { color: getUrgencyColor() }]}>
                        {formatTime(timeRemaining)}
                    </Text>
                </View>

                <View style={styles.stockRow}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${((deal.quantity - deal.quantitySold) / deal.quantity) * 100}%`,
                                    backgroundColor: getUrgencyColor(),
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.stockText}>
                        {deal.quantity - deal.quantitySold} / {deal.quantity} {t('live.countdown.left')}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderRadius: 12,
        borderWidth: 2,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    content: {
        padding: 12,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    originalPrice: {
        color: '#999',
        fontSize: 16,
        textDecorationLine: 'line-through',
    },
    dealPrice: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    discountBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    timerLabel: {
        color: '#999',
        fontSize: 14,
    },
    timer: {
        fontSize: 20,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    stockRow: {
        gap: 6,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    stockText: {
        color: '#999',
        fontSize: 12,
    },
});
