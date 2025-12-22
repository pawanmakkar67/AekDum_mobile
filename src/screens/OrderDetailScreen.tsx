import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ORDERS } from '../data/mockData';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle,
    MapPin,
    Copy,
    MessageCircle,
    Phone
} from 'lucide-react-native';

export const OrderDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { orderId } = route.params || {};

    const order = ORDERS.find(o => o.id === orderId);

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-500">{t('orders.notFound')}</Text>
            </SafeAreaView>
        );
    }

    const getStatusSteps = () => {
        const steps = [
            { key: 'pending', label: t('orders.status.placed'), icon: Package },
            { key: 'processing', label: t('orders.status.processing'), icon: Package },
            { key: 'shipped', label: t('orders.status.shipped'), icon: Truck },
            { key: 'delivered', label: t('orders.status.delivered'), icon: CheckCircle },
        ];

        const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusOrder.indexOf(order.status);

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex,
        }));
    };

    const statusSteps = getStatusSteps();

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <ArrowLeft color="black" size={24} />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold">{t('orders.details')}</Text>
                    <Text className="text-sm text-gray-500">{order.orderNumber}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Order Status Timeline */}
                {order.status !== 'cancelled' && (
                    <View className="px-4 py-6 bg-gray-50">
                        <Text className="font-bold text-gray-900 mb-4">{t('orders.orderStatus')}</Text>
                        <View>
                            {statusSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <View key={step.key} className="flex-row">
                                        <View className="items-center mr-4">
                                            <View
                                                className={`w-10 h-10 rounded-full items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <Icon color="white" size={20} />
                                            </View>
                                            {index < statusSteps.length - 1 && (
                                                <View
                                                    className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-200'
                                                        }`}
                                                />
                                            )}
                                        </View>
                                        <View className="flex-1 pb-6">
                                            <Text
                                                className={`font-semibold ${step.active ? 'text-green-600' : step.completed ? 'text-gray-900' : 'text-gray-400'
                                                    }`}
                                            >
                                                {step.label}
                                            </Text>
                                            {step.active && (
                                                <Text className="text-sm text-gray-600 mt-1">
                                                    {order.estimatedDelivery && `${t('orders.estDelivery')} ${order.estimatedDelivery}`}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Tracking Info */}
                {order.trackingNumber && order.status === 'shipped' && (
                    <View className="px-4 py-4 border-b border-gray-200">
                        <Text className="font-bold text-gray-900 mb-3">{t('orders.trackingInfo')}</Text>
                        <View className="bg-blue-50 rounded-xl p-4 flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-sm text-gray-600 mb-1">{t('orders.trackingNumber')}</Text>
                                <Text className="font-mono font-semibold text-gray-900">
                                    {order.trackingNumber}
                                </Text>
                            </View>
                            <TouchableOpacity className="ml-3">
                                <Copy color="#2563EB" size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Items */}
                <View className="px-4 py-4 border-b border-gray-200">
                    <Text className="font-bold text-gray-900 mb-3">{t('orders.items')}</Text>
                    {order.items.map(item => (
                        <View key={item.id} className="flex-row mb-4">
                            <Image
                                source={{ uri: item.image }}
                                className="w-20 h-20 rounded-lg bg-gray-100"
                            />
                            <View className="flex-1 ml-3">
                                <Text className="font-semibold text-gray-900 mb-1">{item.name}</Text>
                                <Text className="text-gray-600 text-sm mb-2">{t('orders.qty')} {item.quantity}</Text>
                                <Text className="font-bold text-gray-900">{t('common.currency')}{item.price.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping Address */}
                <View className="px-4 py-4 border-b border-gray-200">
                    <View className="flex-row items-center mb-3">
                        <MapPin color="#374151" size={20} />
                        <Text className="font-bold text-gray-900 ml-2">{t('orders.shippingAddress')}</Text>
                    </View>
                    <View className="bg-gray-50 rounded-xl p-4">
                        <Text className="font-semibold text-gray-900">{order.shippingAddress.name}</Text>
                        <Text className="text-gray-600 mt-1">{order.shippingAddress.street}</Text>
                        <Text className="text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                        </Text>
                        <Text className="text-gray-600">{order.shippingAddress.country}</Text>
                    </View>
                </View>

                {/* Seller Info */}
                <View className="px-4 py-4 border-b border-gray-200">
                    <Text className="font-bold text-gray-900 mb-3">{t('orders.seller')}</Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Image
                                source={{ uri: order.seller.avatar }}
                                className="w-12 h-12 rounded-full"
                            />
                            <Text className="font-semibold text-gray-900 ml-3">{order.seller.name}</Text>
                        </View>
                        <TouchableOpacity className="bg-black px-4 py-2 rounded-full">
                            <Text className="text-white font-semibold">{t('orders.contact')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Order Summary */}
                <View className="px-4 py-4">
                    <Text className="font-bold text-gray-900 mb-3">{t('orders.summary')}</Text>
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">{t('orders.subtotal')}</Text>
                            <Text className="text-gray-900">{t('common.currency')}{order.subtotal.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">{t('product.shipping')}</Text>
                            <Text className="text-gray-900">
                                {order.shipping === 0 ? t('orders.free') : `${t('common.currency')}${order.shipping.toFixed(2)}`}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mb-3 pb-3 border-b border-gray-200">
                            <Text className="text-gray-600">{t('orders.tax')}</Text>
                            <Text className="text-gray-900">{t('common.currency')}{order.tax.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="font-bold text-gray-900 text-lg">{t('orders.total')}</Text>
                            <Text className="font-bold text-gray-900 text-lg">{t('common.currency')}{order.total.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
};
