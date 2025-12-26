// Product Tag Overlay Component
// Interactive overlay showing tagged products during live stream

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ShoppingBag, X } from 'lucide-react-native';
import { isAuctionProduct } from '../services/shopifyAuction';
import { useBidding } from '../context/BiddingContext';
import { useTranslation } from '../hooks/useTranslation';
import type { LiveProductDisplay } from '../types/liveCommerce.types';

interface ProductTagOverlayProps {
    taggedProducts: LiveProductDisplay[];
    pinnedProduct?: LiveProductDisplay | null;
    onProductPress: (product: LiveProductDisplay) => void;
    onAddToCart: (product: LiveProductDisplay) => void;
    onPlaceBid?: (product: LiveProductDisplay) => void;
    onClose?: () => void;
    visible?: boolean;
}

export function ProductTagOverlay({
    taggedProducts,
    pinnedProduct,
    onProductPress,
    onAddToCart,
    onPlaceBid,
    onClose,
    visible = true,
}: ProductTagOverlayProps) {
    const { getBidData } = useBidding();
    const { t } = useTranslation();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!visible || taggedProducts.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Pinned Product (if any) */}
            {pinnedProduct && (
                <View style={styles.pinnedContainer}>
                    <View style={styles.pinnedBadge}>
                        <Text style={styles.pinnedText}>{t('live.liveOverlay.featured')}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.pinnedProduct}
                        onPress={() => onProductPress(pinnedProduct)}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: pinnedProduct.product.images[0]?.url }}
                            style={styles.pinnedImage}
                        />
                        <View style={styles.pinnedInfo}>
                            <Text style={styles.pinnedTitle} numberOfLines={2}>
                                {pinnedProduct.product.title}
                            </Text>
                            {isAuctionProduct(pinnedProduct.product) && getBidData(pinnedProduct.product.id) ? (
                                <>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={styles.auctionLabel}>{t('live.liveOverlay.currentBid')}</Text>
                                        <Text style={[styles.timerText, getBidData(pinnedProduct.product.id)?.timeLeft! < 30 && styles.timerUrgent]}>
                                            {formatTime(getBidData(pinnedProduct.product.id)?.timeLeft || 0)}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                                        <Text style={styles.auctionPrice}>{t('common.currency')}{getBidData(pinnedProduct.product.id)?.currentBid}</Text>
                                        {(getBidData(pinnedProduct.product.id)?.totalBids ?? 0) > 0 && (
                                            <Text style={styles.auctionBids}>{getBidData(pinnedProduct.product.id)?.totalBids} {t('live.liveOverlay.bids')}</Text>
                                        )}
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.price}>
                                            {t('common.currency')}{pinnedProduct.selectedVariant?.price.amount || pinnedProduct.product.priceRange.minVariantPrice.amount}
                                        </Text>
                                        {pinnedProduct.isFlashDeal && pinnedProduct.flashDeal && (
                                            <View style={styles.flashBadge}>
                                                <Text style={styles.flashText}>
                                                    🔥 {pinnedProduct.flashDeal.discountPercentage}% OFF
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.inventoryRow}>
                                        <Text style={styles.inventoryText}>
                                            {pinnedProduct.inventory.available} {t('live.liveOverlay.left')}
                                        </Text>
                                        {pinnedProduct.inventory.available < 10 && (
                                            <Text style={styles.lowStockText}>{t('live.liveOverlay.lowStock')}</Text>
                                        )}
                                    </View>
                                </>
                            )}
                        </View>
                        {isAuctionProduct(pinnedProduct.product) && onPlaceBid ? (
                            <TouchableOpacity
                                style={styles.quickAddButton} // Reusing quickAddButton style for now
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onPlaceBid(pinnedProduct);
                                }}
                            >
                                <Text style={styles.placeBidText}>{t('live.liveOverlay.bid')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.quickAddButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(pinnedProduct);
                                }}
                            >
                                <ShoppingBag color="#fff" size={20} />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* Product Carousel */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
                contentContainerStyle={styles.carouselContent}
            >
                {taggedProducts
                    .filter((p) => !pinnedProduct || p.product.id !== pinnedProduct.product.id)
                    .map((product, index) => {
                        const isAuction = isAuctionProduct(product.product);
                        const bidData = getBidData(product.product.id);

                        return (
                            <TouchableOpacity
                                key={`${product.product.id} -${index} `}
                                style={styles.productCard}
                                onPress={() => onProductPress(product)}
                                activeOpacity={0.9}
                            >
                                <Image
                                    source={{ uri: product.product.images[0]?.url }}
                                    style={styles.productImage}
                                />

                                {product.isFlashDeal && (
                                    <View style={styles.dealBadge}>
                                        <Text style={styles.dealText}>{t('live.liveOverlay.deal')}</Text>
                                    </View>
                                )}

                                <View style={styles.productInfo}>
                                    <Text style={styles.productTitle} numberOfLines={1}>
                                        {product.product.title}
                                    </Text>
                                    {isAuction && bidData ? (
                                        <>
                                            <Text style={styles.auctionLabel}>{t('live.liveOverlay.currentBid')}</Text>
                                            <Text style={styles.auctionPrice}>{t('common.currency')}{bidData.currentBid}</Text>
                                            {bidData.totalBids > 0 && (
                                                <Text style={styles.auctionBids}>{bidData.totalBids} {t('live.liveOverlay.bids')}</Text>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.productPrice}>
                                                {t('common.currency')}{product.selectedVariant?.price.amount || product.product.priceRange.minVariantPrice.amount}
                                            </Text>
                                            {product.inventory.available < 10 && (
                                                <Text style={styles.stockWarning}>
                                                    {t('live.liveOverlay.onlyLeft', { count: product.inventory.available })}
                                                </Text>
                                            )}
                                        </>
                                    )}
                                </View>

                                {isAuction && onPlaceBid ? (
                                    <TouchableOpacity
                                        style={styles.miniAddButton} // Reusing miniAddButton style for now
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            onPlaceBid(product);
                                        }}
                                    >
                                        <Text style={styles.miniPlaceBidText}>{t('live.liveOverlay.bid')}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.miniAddButton}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            onAddToCart(product);
                                        }}
                                    >
                                        <ShoppingBag color="#fff" size={16} />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        );
                    })}
            </ScrollView>

            {onClose && (
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X color="#fff" size={20} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 125,
        left: 0,
        right: 0,
    },
    pinnedContainer: {
        marginHorizontal: 16,
        marginBottom: 12,
    },
    pinnedBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    pinnedText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    pinnedProduct: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.85)',
        borderRadius: 12,
        borderTopLeftRadius: 0,
        padding: 12,
        borderWidth: 2,
        borderColor: '#8B5CF6',
    },
    pinnedImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    pinnedInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    pinnedTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    flashBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    flashText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    inventoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inventoryText: {
        color: '#999',
        fontSize: 12,
    },
    lowStockText: {
        color: '#FFA500',
        fontSize: 11,
        fontWeight: '600',
    },
    quickAddButton: {
        backgroundColor: '#8B5CF6',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 10
    },
    carousel: {
        paddingLeft: 16,
    },
    carouselContent: {
        paddingRight: 16,
        gap: 12,
    },
    productCard: {
        width: 140,
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    dealBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    dealText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
    productInfo: {
        marginTop: 8,
    },
    productTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    productPrice: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    stockWarning: {
        color: '#FFA500',
        fontSize: 10,
        marginTop: 2,
    },
    miniAddButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#8B5CF6',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
    // Auction-specific styles
    auctionLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    auctionPrice: {
        fontSize: 20,
        color: '#FFC107',
        fontWeight: 'bold',
        marginTop: 2,
    },
    auctionBids: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
    },
    placeBidText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    miniPlaceBidText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    timerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    timerUrgent: {
        color: '#EF4444',
    },
});
