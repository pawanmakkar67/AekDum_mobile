import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ImageOff } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

interface AuctionCardProps {
    product: {
        id: string;
        name: string;
        image: string;
        currentBid?: number;
        priceString?: string;
        timeLeft?: string;
    };
    onPress?: () => void;
    onBidPress?: () => void;
    style?: any;
}

export const AuctionCard = ({ product, onPress, onBidPress, style }: AuctionCardProps) => {
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, style]}
        >
            <View style={[styles.imageContainer, imageError && styles.imageError]}>
                {imageError ? (
                    <ImageOff size={48} color="#9ca3af" />
                ) : (
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                )}
                {product.timeLeft && (
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>
                            {product.timeLeft}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {product.name}
                </Text>

                <Text style={styles.label}>{t('live.bidding.currentBid')}</Text>

                <View style={styles.bidContainer}>
                    <Text style={styles.price}>
                        {product.priceString || `₹${product.currentBid}`}
                    </Text>

                    <TouchableOpacity
                        onPress={onBidPress}
                        style={styles.bidButton}
                    >
                        <Text style={styles.bidButtonText}>{t('live.liveOverlay.bid')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderColor: '#e5e7eb', // gray-200
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 16,
        width: '48%',
    },
    imageContainer: {
        height: 160,
        width: '100%',
        position: 'relative',
    },
    imageError: {
        backgroundColor: '#f3f4f6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    timerBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'black',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    timerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#6b7280', // gray-500
        marginBottom: 4,
    },
    bidContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        color: '#9333ea', // purple-600
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 2, // Fine tune alignment
    },
    bidButton: {
        backgroundColor: '#9333ea', // purple-600
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    bidButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
