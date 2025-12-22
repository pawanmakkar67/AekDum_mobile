import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, Heart, Share, Star, Clock, Eye, TrendingUp } from 'lucide-react-native';
import { PRODUCTS, BID_HISTORY, CATEGORIES } from '../data/mockData';
import { SwipeButton } from '../components/SwipeButton';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { productId } = route.params || {};
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showBidModal, setShowBidModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

    const handleBuyNow = () => {
        console.log('Buy now:', product.buyNowPrice);
    };

    const handlePlaceBid = () => {
        setShowBidModal(true);
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ArrowLeft color="black" size={24} />
                    </TouchableOpacity>
                    <View className="flex-row items-center space-x-4">
                        <TouchableOpacity className="p-2">
                            <Share color="black" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} className="p-2 -mr-2">
                            <Heart color={isFavorite ? "#FF1493" : "black"} size={22} fill={isFavorite ? "#FF1493" : "none"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Image Gallery */}
                    <View className="bg-gray-50">
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                                setCurrentImageIndex(index);
                            }}
                        >
                            {product.images.map((img, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: img }}
                                    style={{ width, height: width }}
                                    resizeMode="cover"
                                />
                            ))}
                        </ScrollView>
                        {product.images.length > 1 && (
                            <View className="absolute bottom-4 self-center flex-row">
                                {product.images.map((_, index) => (
                                    <View
                                        key={index}
                                        className={`w-2 h-2 rounded-full mx-1 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Product Info */}
                    <View className="p-4">
                        {/* Title and Price */}
                        <View className="mb-4">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">{product.name}</Text>
                            <View className="flex-row items-center justify-between">
                                <View>
                                    {product.isAuction ? (
                                        <>
                                            <Text className="text-sm text-gray-500">{t('product.currentBid')}</Text>
                                            <Text className="text-3xl font-bold text-green-600">{t('common.currency')}{product.currentBid}</Text>
                                            {product.bids && (
                                                <Text className="text-sm text-gray-500 mt-1">{product.bids} {t('product.bids')}</Text>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Text className="text-sm text-gray-500">{t('product.price')}</Text>
                                            <Text className="text-3xl font-bold text-gray-900">{t('common.currency')}{product.buyNowPrice}</Text>
                                        </>
                                    )}
                                </View>
                                {product.isAuction && product.timeLeft && (
                                    <View className="bg-red-50 px-4 py-3 rounded-xl">
                                        <View className="flex-row items-center mb-1">
                                            <Clock color="#DC2626" size={16} />
                                            <Text className="text-xs text-red-600 font-semibold ml-1">{t('product.timeLeft')}</Text>
                                        </View>
                                        <Text className="text-xl font-bold text-red-600">{product.timeLeft}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Stats */}
                        <View className="flex-row items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <Eye color="#6B7280" size={16} />
                                <Text className="text-sm text-gray-600 ml-1">{product.views} {t('product.views')}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <TrendingUp color="#6B7280" size={16} />
                                <Text className="text-sm text-gray-600 ml-1">{product.category}</Text>
                            </View>
                        </View>

                        {/* Seller Info */}
                        <TouchableOpacity className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
                            <Image
                                source={{ uri: product.seller.avatar }}
                                className="w-12 h-12 rounded-full border border-gray-200"
                            />
                            <View className="ml-3 flex-1">
                                <Text className="text-base font-bold text-gray-900">{product.seller.name}</Text>
                                <View className="flex-row items-center mt-1">
                                    <Star color="#FCD34D" size={14} fill="#FCD34D" />
                                    <Text className="text-sm text-gray-600 ml-1">
                                        {product.seller.rating} ({product.seller.totalSales} {t('product.sales')})
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
                                <Text className="text-sm font-semibold">{t('common.follow')}</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>

                        {/* Description */}
                        <View className="mb-4">
                            <Text className="text-lg font-bold text-gray-900 mb-2">{t('product.description')}</Text>
                            <Text className="text-base text-gray-700 leading-6">{product.description}</Text>
                        </View>

                        {/* Details */}
                        <View className="mb-4 bg-gray-50 rounded-xl p-4">
                            <Text className="text-lg font-bold text-gray-900 mb-3">{t('product.details')}</Text>
                            <View className="space-y-2">
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-gray-600">{t('product.condition')}</Text>
                                    <Text className="font-semibold text-gray-900">{product.condition}</Text>
                                </View>
                                <View className="flex-row justify-between py-2 border-t border-gray-200">
                                    <Text className="text-gray-600">{t('product.shipping')}</Text>
                                    <Text className="font-semibold text-gray-900">{product.shipping}</Text>
                                </View>
                                <View className="flex-row justify-between py-2 border-t border-gray-200">
                                    <Text className="text-gray-600">{t('product.category')}</Text>
                                    <Text className="font-semibold text-gray-900">{product.category}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Bid History (if auction) */}
                        {product.isAuction && (
                            <View className="mb-6">
                                <Text className="text-lg font-bold text-gray-900 mb-3">{t('product.bidHistory')}</Text>
                                <View className="bg-gray-50 rounded-xl overflow-hidden">
                                    {BID_HISTORY.map((bid, index) => (
                                        <View
                                            key={bid.id}
                                            className={`flex-row justify-between items-center p-4 ${index !== BID_HISTORY.length - 1 ? 'border-b border-gray-200' : ''
                                                }`}
                                        >
                                            <View>
                                                <Text className="font-semibold text-gray-900">{bid.user}</Text>
                                                <Text className="text-xs text-gray-500 mt-0.5">{bid.time}</Text>
                                            </View>
                                            <Text className="text-lg font-bold text-green-600">{t('common.currency')}{bid.amount}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        {/* Categories Section */}
                        <View className="mb-8">
                            <Text className="text-lg font-bold text-gray-900 mb-3 px-4">{t('market.categories')}</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                className="px-4"
                                contentContainerStyle={{ paddingRight: 16 }}
                            >
                                {CATEGORIES.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        className="mr-3 items-center"
                                        onPress={() => (navigation as any).navigate('Home', { screen: 'Home', params: { category: category.name } })}
                                    >
                                        <View className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 mb-1">
                                            <Image
                                                source={{ uri: category.image }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <Text className="text-xs font-medium text-gray-700 text-center w-20" numberOfLines={1}>
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Action Bar */}
                <View className="border-t border-gray-200 p-4 bg-white">
                    {product.isAuction ? (
                        <View className="flex-row space-x-3">
                            <TouchableOpacity
                                onPress={handlePlaceBid}
                                className="flex-1 bg-black py-4 rounded-full items-center"
                            >
                                <Text className="text-white font-bold text-lg">{t('product.placeBid')}</Text>
                            </TouchableOpacity>
                            {product.buyNowPrice && (
                                <TouchableOpacity
                                    onPress={handleBuyNow}
                                    className="flex-1 bg-blue-600 py-4 rounded-full items-center"
                                >
                                    <Text className="text-white font-bold text-lg">{t('product.buyNow')} {t('common.currency')}{product.buyNowPrice}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleBuyNow}
                            className="bg-black py-4 rounded-full items-center"
                        >
                            <Text className="text-white font-bold text-lg">{t('product.buyNow')} {t('common.currency')}{product.buyNowPrice}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>

            {/* Bid Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showBidModal}
                onRequestClose={() => setShowBidModal(false)}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-white rounded-t-3xl p-6">
                        <Text className="text-2xl font-bold mb-4">{t('product.placeYourBid')}</Text>
                        <View className="bg-gray-50 rounded-xl p-4 mb-4">
                            <Text className="text-sm text-gray-600 mb-1">{t('product.currentBid')}</Text>
                            <Text className="text-3xl font-bold text-gray-900">{t('common.currency')}{product.currentBid}</Text>
                        </View>
                        <View className="bg-green-50 rounded-xl p-4 mb-6">
                            <Text className="text-sm text-gray-600 mb-1">{t('product.yourBid')}</Text>
                            <Text className="text-3xl font-bold text-green-600">{t('common.currency')}{(product.currentBid || 0) + 10}</Text>
                        </View>
                        <SwipeButton
                            onSwipeSuccess={() => {
                                setShowBidModal(false);
                                console.log('Bid placed');
                            }}
                            label={t('product.swipeToConfirm')}
                            backgroundColor="#000000"
                            thumbColor="#FFFFFF"
                            successColor="#10B981"
                        />
                        <TouchableOpacity
                            onPress={() => setShowBidModal(false)}
                            className="py-4 items-center"
                        >
                            <Text className="text-gray-600 font-semibold">{t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
