import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ORDERS } from '../data/mockData';
import { OrderCard } from '../components/OrderCard';
import { ArrowLeft, Package } from 'lucide-react-native';

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const OrdersScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<OrderStatus>('all');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const filteredOrders = activeTab === 'all'
        ? ORDERS
        : ORDERS.filter(order => order.status === activeTab);

    const tabs: { key: OrderStatus; label: string }[] = [
        { key: 'all', label: t('orders.status.all') },
        { key: 'pending', label: t('orders.status.pending') },
        { key: 'shipped', label: t('orders.status.shipped') },
        { key: 'delivered', label: t('orders.status.delivered') },
    ];

    const getOrderCount = (status: OrderStatus) => {
        if (status === 'all') return ORDERS.length;
        return ORDERS.filter(order => order.status === status).length;
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="bg-white border-b border-gray-200">
                <View className="flex-row items-center px-4 py-3">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ArrowLeft color="black" size={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">{t('orders.myOrders')}</Text>
                </View>

                {/* Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-4 pb-2"
                >
                    {tabs.map(tab => {
                        const count = getOrderCount(tab.key);
                        const isActive = activeTab === tab.key;

                        return (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setActiveTab(tab.key)}
                                className={`mr-3 px-4 py-2 rounded-full ${isActive ? 'bg-black' : 'bg-gray-100'
                                    }`}
                            >
                                <Text className={`font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                    {tab.label} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4">
                        <Package color="#9CA3AF" size={48} />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-2">{t('orders.noOrders')}</Text>
                    <Text className="text-gray-500 text-center">
                        {activeTab === 'all'
                            ? t('orders.noOrdersAll')
                            : t('orders.noOrdersFilter', { status: activeTab })}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    className="flex-1 px-4 pt-4"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order as any}
                            onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                        />
                    ))}
                    <View className="h-4" />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
