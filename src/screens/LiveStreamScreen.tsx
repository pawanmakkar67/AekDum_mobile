// Enhanced Live Stream Screen with Shopify Integration
// Features: HLS video player, product tagging, real-time chat, flash deals, quick checkout

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Animated,
    StyleSheet,
    Alert,
    Keyboard,
} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { useRoute, useNavigation } from '@react-navigation/native';
import { X, Heart, Share, Gift, ShoppingBag, Send, Users, Settings } from 'lucide-react-native';

// Components
import { VideoPlayer } from '../components/VideoPlayer';
import { ProductTagOverlay } from '../components/ProductTagOverlay';
import { QuickCheckout } from '../components/QuickCheckout';
import { CountdownDealComponent } from '../components/CountdownDeal';
import { ChatOverlay } from '../components/ChatOverlay';
import { BiddingBottomSheet } from '../components/BiddingBottomSheet';
import { SellerControlsModal, AuctionConfig } from '../components/SellerControlsModal';
import { useBidding } from '../context/BiddingContext';
import { biddingService } from '../services/biddingService';
import { notificationService } from '../services/NotificationService';

// Contexts & Services
import { useShopify } from '../context/ShopifyContext';
import { useLiveStream } from '../context/LiveStreamContext';
import { socketClient } from '../services/socketClient';
import { getProducts } from '../services/shopifyProducts';
import { isAuctionProduct, getAuctionDataFromTags } from '../services/shopifyAuction';

// Types
import type { LiveProductDisplay, CountdownDeal, ChatMessage } from '../types/liveCommerce.types';
import type { ShopifyProduct } from '../types/shopify.types';

// Mock data
import { LIVE_STREAMS } from '../data/mockData';

interface FloatingHeart {
    id: number;
    animation: Animated.Value;
}

export const LiveStreamScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { streamId } = route.params || {};

    // Contexts
    const { addToCart, cart } = useShopify();
    const { playStream, closeStream, minimizeStream } = useLiveStream();
    const { initializeBid, getBidData, activeBids, addPendingPayment, pendingPayments, payForProduct } = useBidding();

    // Stream data
    const stream = LIVE_STREAMS.find((s) => s.id === streamId) || LIVE_STREAMS[0];
    const [viewerCount, setViewerCount] = useState(stream.viewers);

    // Product state
    const [taggedProducts, setTaggedProducts] = useState<LiveProductDisplay[]>([]);
    const [pinnedProduct, setPinnedProduct] = useState<LiveProductDisplay | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<LiveProductDisplay | null>(null);
    const [showProductOverlay, setShowProductOverlay] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);

    // Flash deals
    const [activeDeals, setActiveDeals] = useState<CountdownDeal[]>([]);

    // Chat state
    const [chatMessage, setChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    // Reactions
    const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

    // Bidding state - bottom sheet modal
    const [showBiddingSheet, setShowBiddingSheet] = useState(false);
    const [selectedAuctionProduct, setSelectedAuctionProduct] = useState<LiveProductDisplay | null>(null);

    // Streamer tools
    const [isStreamer, setIsStreamer] = useState(true); // Mock streamer role
    const [showSellerControls, setShowSellerControls] = useState(false);
    const [auctionConfig, setAuctionConfig] = useState<AuctionConfig | null>(null);

    // Initialize stream
    useEffect(() => {
        initializeStream();
        return () => {
            socketClient.leaveStream(stream.id);
            minimizeStream();
        };
    }, [stream.id]);

    // Configure Keyboard Manager
    useEffect(() => {
        if (Platform.OS === 'ios') {
            KeyboardManager.setEnable(true);
            KeyboardManager.setEnableAutoToolbar(false); // Disable toolbar for cleaner chat look
            KeyboardManager.setToolbarPreviousNextButtonEnable(false);
            KeyboardManager.setKeyboardDistanceFromTextField(10);
            KeyboardManager.setLayoutIfNeededOnUpdate(true);
        }
    }, []);

    async function initializeStream() {
        // Play stream
        playStream({
            id: stream.id,
            title: stream.title,
            streamer: stream.streamer,
            image: stream.image,
            avatar: stream.avatar,
        });

        // Connect to real-time
        socketClient.connect();
        socketClient.joinStream(stream.id);

        // Setup real-time listeners
        setupRealtimeListeners();

        // Load initial products
        await loadStreamProducts();
    }

    function setupRealtimeListeners() {
        // Chat messages
        socketClient.on('chat_message', (message: ChatMessage) => {
            setChatMessages((prev) => [...prev, message]);
        });

        // Product tagged
        socketClient.on('product_tagged', (data: any) => {
            handleProductTagged(data);
        });

        // Product pinned
        socketClient.on('product_pinned', (data: any) => {
            handleProductPinned(data);
        });

        // Flash deal started
        socketClient.on('flash_deal_started', (deal: CountdownDeal) => {
            setActiveDeals((prev) => [...prev, deal]);
        });

        // Viewer count updates
        socketClient.on('viewer_count', (count: number) => {
            setViewerCount(count);
        });

        // Reactions
        socketClient.on('reaction', () => {
            createFloatingHeart();
        });

        // Stream ended
        socketClient.on('stream_ended', () => {
            Alert.alert(
                t('live.streamEndedTitle'),
                t('live.streamEndedMessage'),
                [{ text: t('live.ok'), onPress: () => handleClose() }]
            );
        });
    }

    async function loadStreamProducts() {
        try {
            // Fetch products from Shopify - only get the first product (Jordan 1)
            const { products } = await getProducts(1);

            // Convert to LiveProductDisplay format
            const liveProducts: LiveProductDisplay[] = products.map((product) => ({
                product,
                selectedVariant: product.variants[0],
                tag: {
                    id: `tag-${product.id}`,
                    productId: product.id,
                    variantId: product.variants[0]?.id,
                    streamId: stream.id,
                    timestamp: Date.now(),
                    isPinned: true,
                },
                isPinned: true,
                isFlashDeal: false,
                inventory: {
                    available: product.variants[0]?.quantityAvailable || 10,
                    reserved: 0,
                    sold: 0,
                },
                engagement: {
                    views: 0,
                    clicks: 0,
                    addedToCart: 0,
                    purchased: 0,
                },
            }));

            setTaggedProducts(liveProducts);

            // Pin the first product immediately
            if (liveProducts.length > 0) {
                setPinnedProduct(liveProducts[0]);

                // Initialize bidding for auction products using Shopify tags
                const auctionData = getAuctionDataFromTags(liveProducts[0].product);
                if (auctionData && auctionData.isActive) {
                    initializeBid(
                        liveProducts[0].product.id,
                        biddingService.initializeAuction(
                            liveProducts[0].product.id,
                            auctionData.currentBid,
                            auctionData.buyNowPrice
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }



    function handleProductTagged(data: any) {
        // Handle new product tagged event
        console.log('Product tagged:', data);
    }

    function handleProductPinned(data: any) {
        const product = taggedProducts.find((p) => p.product.id === data.productId);
        if (product) {
            setPinnedProduct(product);
        }
    }

    // Reactions
    function createFloatingHeart() {
        const id = Date.now() + Math.random();
        const animation = new Animated.Value(0);

        setFloatingHearts((prev) => [...prev, { id, animation }]);

        Animated.timing(animation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            setFloatingHearts((prev) => prev.filter((heart) => heart.id !== id));
        });
    }

    function handleLike() {
        createFloatingHeart();
        socketClient.sendReaction(stream.id, 'heart', 'current-user-id');
    }

    // Chat
    function handleSendMessage() {
        if (chatMessage.trim()) {
            socketClient.sendChatMessage(
                stream.id,
                chatMessage,
                'current-user-id',
                'You'
            );
            setChatMessage('');
        }
    }

    // Product actions
    function handleProductPress(product: LiveProductDisplay) {
        // If it's an auction product, open bidding sheet
        if (isAuctionProduct(product.product) && !stream.isReplay) {
            setSelectedAuctionProduct(product);
            setShowBiddingSheet(true);
        } else if (stream.isReplay) {
            Alert.alert('Replay Mode', 'Bidding is not available during replays.');
        } else {
            setSelectedProduct(product);
            setShowCheckout(true);
        }
    }

    function handlePlaceBid(product: LiveProductDisplay) {
        setSelectedAuctionProduct(product);
        setShowBiddingSheet(true);
    }

    async function handleAddToCart(product: LiveProductDisplay) {
        try {
            const variantId = product.selectedVariant?.id || product.product.variants[0]?.id;
            if (variantId) {
                await addToCart(variantId, 1);
                // Show success feedback
                console.log('Added to cart!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    function handleClose() {
        closeStream();
        navigation.goBack();
    }

    function handleStartAuction(config: AuctionConfig) {
        console.log('Starting auction with config:', config);
        setAuctionConfig(config);

        // Use socket to broadcast auction start
        // In a real app, this would update the backend state
        if (taggedProducts.length > 0) {
            const product = taggedProducts[0].product;
            // Update the product with new auction data
            // For now just logs
            Alert.alert('Auction Started', `Quantity: ${config.quantity}, Price: ${config.startPrice}`);

            // SIMULATION: End auction after duration and notify winner
            setTimeout(() => {
                notificationService.sendAuctionWon(product.title, config.startPrice + 50); // Simulating a higher winning price
                notificationService.sendPaymentReminder(product.title);
                addPendingPayment(product.title, config.startPrice + 50);
            }, config.duration * 1000);
        }
    }

    // Mock stream URL - replace with real HLS URL from your streaming provider
    // Use the streamUrl from mock data if available, otherwise use placeholder
    const streamUrl = (stream as any).streamUrl || `https://demo-stream.example.com/live/${stream.id}/index.m3u8`;

    return (
        <View style={styles.container}>
            {/* Video Player */}
            <VideoPlayer
                streamUrl={streamUrl}
                poster={stream.image}
                autoPlay={true}
                lowLatency={true}
            />

            <SafeAreaView style={styles.overlay}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.streamerInfo}>
                        {stream.isReplay ? (
                            <View style={[styles.liveBadge, { backgroundColor: 'rgba(107, 114, 128, 0.9)' }]}>
                                <Text style={styles.liveText}>REPLAY</Text>
                            </View>
                        ) : (
                            <View style={styles.liveBadge}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>{t('live.badge')}</Text>
                            </View>
                        )}
                        <View style={styles.viewerBadge}>
                            <Users color="#fff" size={14} />
                            <Text style={styles.viewerText}>{viewerCount.toLocaleString()}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <X color="#fff" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Seller Tools Button */}
                {isStreamer && (
                    <TouchableOpacity
                        style={styles.sellerToolsButton}
                        onPress={() => setShowSellerControls(true)}
                    >
                        <Settings color="#fff" size={20} />
                        <Text style={styles.sellerToolsText}>Seller Tools</Text>
                    </TouchableOpacity>
                )}

                {/* Overdue Payment Banner */}
                {pendingPayments.length > 0 && (
                    <View className="mx-4 mt-2 bg-red-100 p-3 rounded-lg border border-red-200 flex-row justify-between items-center">
                        <View>
                            <Text className="text-red-800 font-bold text-xs">PAYMENT DUE: {pendingPayments[0].productName}</Text>
                            <Text className="text-red-600 text-[10px]">{Math.ceil((pendingPayments[0].dueDate - Date.now()) / 60000)} mins left</Text>
                        </View>
                        <TouchableOpacity
                            className="bg-red-600 px-3 py-1.5 rounded-full"
                            onPress={() => {
                                const success = payForProduct(pendingPayments[0].id);
                                if (success) Alert.alert('Payment Successful', 'Thank you for your payment!');
                                else Alert.alert('Payment Failed', 'Insufficient funds');
                            }}
                        >
                            <Text className="text-white text-xs font-bold">Pay ₹{pendingPayments[0].amount}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Stream Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.streamTitle}>{stream.title}</Text>
                    <Text style={styles.streamerName}>@{stream.streamer}</Text>
                </View>

                {/* Active Flash Deals */}
                {activeDeals.map((deal) => (
                    <CountdownDealComponent
                        key={deal.id}
                        deal={deal}
                        onExpire={() => {
                            setActiveDeals((prev) => prev.filter((d) => d.id !== deal.id));
                        }}
                    />
                ))}

                {/* Floating Hearts */}
                <View style={styles.heartsContainer} pointerEvents="none">
                    {floatingHearts.map((heart) => (
                        <Animated.View
                            key={heart.id}
                            style={[
                                styles.floatingHeart,
                                {
                                    opacity: heart.animation.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [1, 1, 0],
                                    }),
                                    transform: [
                                        {
                                            translateY: heart.animation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, -250],
                                            }),
                                        },
                                        {
                                            translateX: heart.animation.interpolate({
                                                inputRange: [0, 0.5, 1],
                                                outputRange: [0, 20, -10],
                                            }),
                                        },
                                        {
                                            scale: heart.animation.interpolate({
                                                inputRange: [0, 0.2, 1],
                                                outputRange: [0, 1.2, 0.8],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Heart color="#FF1493" size={32} fill="#FF1493" />
                        </Animated.View>
                    ))}
                </View>

                {/* Product Overlay */}
                <ProductTagOverlay
                    taggedProducts={taggedProducts}
                    pinnedProduct={pinnedProduct}
                    onProductPress={handleProductPress}
                    onAddToCart={handleAddToCart}
                    onPlaceBid={handlePlaceBid}
                    visible={showProductOverlay}
                />

                {/* Bottom Section */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    enabled={Platform.OS === 'android'}
                    style={styles.bottomSection}
                >
                    {/* Chat */}
                    <ChatOverlay />

                    {/* Action Bar */}
                    <View style={styles.actionBar}>
                        <View style={styles.chatInput}>
                            <TextInput
                                placeholder={t('live.chatPlaceholder')}
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                style={styles.input}
                                value={chatMessage}
                                onChangeText={setChatMessage}
                                onSubmitEditing={handleSendMessage}
                                returnKeyType="send"
                            />
                            <TouchableOpacity onPress={handleSendMessage}>
                                <Send color="#fff" size={20} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.actionButton}>
                                <ShoppingBag color="#fff" size={22} />
                                {cart && cart.totalQuantity > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{cart.totalQuantity}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Gift color="#fff" size={22} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Share color="#fff" size={22} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.heartButton} onPress={handleLike}>
                                <Heart color="#fff" size={22} fill="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* Quick Checkout Modal */}
            <QuickCheckout
                visible={showCheckout}
                product={selectedProduct || undefined}
                onClose={() => {
                    setShowCheckout(false);
                    setSelectedProduct(null);
                }}
                streamId={stream.id}
            />
            {/* Bidding Bottom Sheet */}
            {selectedAuctionProduct && (
                <BiddingBottomSheet
                    productId={selectedAuctionProduct.product.id}
                    productName={selectedAuctionProduct.product.title}
                    visible={showBiddingSheet}
                    onClose={() => {
                        setShowBiddingSheet(false);
                        setSelectedAuctionProduct(null);
                    }}
                />
            )}

            {/* Seller Controls Modal */}
            <SellerControlsModal
                visible={showSellerControls}
                onClose={() => setShowSellerControls(false)}
                onStartAuction={handleStartAuction}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    streamerInfo: {
        flexDirection: 'row',
        gap: 8,
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    liveText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    viewerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    viewerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    titleContainer: {
        paddingHorizontal: 16,
        marginTop: 12,
    },
    streamTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    streamerName: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        marginTop: 2,
    },
    heartsContainer: {
        position: 'absolute',
        right: 16,
        bottom: 150,
        width: 50,
        height: 300,
    },
    floatingHeart: {
        position: 'absolute',
        bottom: 0,
    },
    bottomSection: {
        paddingBottom: 16,
    },
    actionBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
        marginTop: 12,
    },
    chatInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        gap: 8,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        position: 'relative',
    },
    heartButton: {
        backgroundColor: '#EF4444',
        padding: 10,
        borderRadius: 20,
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#8B5CF6',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sellerToolsButton: {
        position: 'absolute',
        top: 60,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#10B981',
        gap: 6,
    },
    sellerToolsText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
});
