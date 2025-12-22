// Quick Checkout Component
// Streamlined checkout modal for instant purchases during live streams

import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { X, ShoppingBag, CreditCard } from 'lucide-react-native';
import { useShopify } from '../context/ShopifyContext';
import type { LiveProductDisplay } from '../types/liveCommerce.types';
import { useTranslation } from '../hooks/useTranslation';

interface QuickCheckoutProps {
    visible: boolean;
    product: LiveProductDisplay | null | undefined;
    onClose: () => void;
    streamId?: string;
}

export function QuickCheckout({ visible, product, onClose, streamId }: QuickCheckoutProps) {
    const { t } = useTranslation();
    const { addToCart, buyNow, cart, cartLoading } = useShopify();
    const [processing, setProcessing] = useState(false);

    if (!product) return null;

    const variant = product.selectedVariant || product.product.variants[0];
    const price = variant.price.amount;
    const isFlashDeal = product.isFlashDeal && product.flashDeal;
    const finalPrice = isFlashDeal ? product.flashDeal!.dealPrice.amount : price;

    async function handleAddToCart() {
        try {
            setProcessing(true);
            await addToCart(variant.id, 1);
            onClose();
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setProcessing(false);
        }
    }

    async function handleBuyNow() {
        try {
            setProcessing(true);
            const checkoutUrl = await buyNow(variant.id, 1);

            if (checkoutUrl) {
                // Open Shopify checkout in browser
                await Linking.openURL(checkoutUrl);
                onClose();
            }
        } catch (error) {
            console.error('Error processing purchase:', error);
        } finally {
            setProcessing(false);
        }
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Quick Checkout</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#000" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Product Info */}
                    <View style={styles.productSection}>
                        <Image
                            source={{ uri: product.product.images[0]?.url }}
                            style={styles.productImage}
                        />
                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle} numberOfLines={2}>
                                {product.product.title}
                            </Text>
                            {variant.title !== 'Default' && (
                                <Text style={styles.variantText}>{variant.title}</Text>
                            )}

                            {/* Price */}
                            <View style={styles.priceRow}>
                                {isFlashDeal && (
                                    <>
                                        <Text style={styles.originalPrice}>{t('common.currency')}{price}</Text>
                                        <Text style={styles.dealPrice}>{t('common.currency')}{finalPrice}</Text>
                                        <View style={styles.savingsBadge}>
                                            <Text style={styles.savingsText}>
                                                Save {product.flashDeal!.discountPercentage}%
                                            </Text>
                                        </View>
                                    </>
                                )}
                                {!isFlashDeal && (
                                    <Text style={styles.price}>{t('common.currency')}{price}</Text>
                                )}
                            </View>

                            {/* Inventory */}
                            <View style={styles.inventoryRow}>
                                <Text style={styles.inventoryText}>
                                    {product.inventory.available} in stock
                                </Text>
                                {product.inventory.available < 10 && (
                                    <Text style={styles.lowStockText}>⚠️ Low stock!</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Flash Deal Timer (if applicable) */}
                    {isFlashDeal && product.flashDeal && (
                        <View style={styles.dealAlert}>
                            <Text style={styles.dealAlertText}>
                                🔥 Flash deal ends soon! Limited quantity available.
                            </Text>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.addToCartButton]}
                            onPress={handleAddToCart}
                            disabled={processing || cartLoading}
                        >
                            {processing || cartLoading ? (
                                <ActivityIndicator color="#8B5CF6" />
                            ) : (
                                <>
                                    <ShoppingBag color="#8B5CF6" size={20} />
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.buyNowButton]}
                            onPress={handleBuyNow}
                            disabled={processing || cartLoading}
                        >
                            {processing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <CreditCard color="#fff" size={20} />
                                    <Text style={styles.buyNowText}>Buy Now</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Cart Summary */}
                    {cart && cart.totalQuantity > 0 && (
                        <View style={styles.cartSummary}>
                            <Text style={styles.cartText}>
                                {cart.totalQuantity} item{cart.totalQuantity > 1 ? 's' : ''} in cart
                            </Text>
                            <Text style={styles.cartTotal}>
                                {t('common.currency')}{cart.cost.totalAmount.amount}
                            </Text>
                        </View>
                    )}

                    {/* Trust Badges */}
                    <View style={styles.trustBadges}>
                        <Text style={styles.trustText}>🔒 Secure checkout</Text>
                        <Text style={styles.trustText}>📦 Free shipping over {t('common.currency')}50</Text>
                        <Text style={styles.trustText}>↩️ Easy returns</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    productSection: {
        flexDirection: 'row',
        padding: 20,
        gap: 16,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
    },
    productInfo: {
        flex: 1,
        gap: 6,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    variantText: {
        fontSize: 14,
        color: '#666',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    originalPrice: {
        fontSize: 16,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    dealPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    savingsBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    savingsText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '600',
    },
    inventoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inventoryText: {
        fontSize: 13,
        color: '#666',
    },
    lowStockText: {
        fontSize: 12,
        color: '#F59E0B',
        fontWeight: '600',
    },
    dealAlert: {
        backgroundColor: '#FEF3C7',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    dealAlertText: {
        color: '#92400E',
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
    },
    addToCartButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderColor: '#8B5CF6',
    },
    addToCartText: {
        color: '#8B5CF6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyNowButton: {
        backgroundColor: '#8B5CF6',
    },
    buyNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
        marginHorizontal: 20,
        borderRadius: 8,
        marginBottom: 16,
    },
    cartText: {
        fontSize: 14,
        color: '#666',
    },
    cartTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    trustBadges: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    trustText: {
        fontSize: 11,
        color: '#999',
    },
});
