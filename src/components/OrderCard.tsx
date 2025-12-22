import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

interface OrderCardProps {
    order: {
        id: string;
        orderNumber: string;
        items: Array<{
            id: string;
            name: string;
            image: string;
            price: number;
            quantity: number;
        }>;
        status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        total: number;
        date: string;
        seller: {
            name: string;
            avatar: string;
        };
    };
    onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
    const { t } = useTranslation();
    const getStatusConfig = () => {
        switch (order.status) {
            case 'pending':
                return {
                    icon: <Clock color="#F59E0B" size={16} />,
                    text: 'Pending',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-700',
                };
            case 'processing':
                return {
                    icon: <Package color="#3B82F6" size={16} />,
                    text: 'Processing',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                };
            case 'shipped':
                return {
                    icon: <Truck color="#8B5CF6" size={16} />,
                    text: 'Shipped',
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-700',
                };
            case 'delivered':
                return {
                    icon: <CheckCircle color="#10B981" size={16} />,
                    text: 'Delivered',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                };
            case 'cancelled':
                return {
                    icon: <XCircle color="#EF4444" size={16} />,
                    text: 'Cancelled',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-700',
                };
        }
    };

    const statusConfig = getStatusConfig();
    const firstItem = order.items[0];
    const hasMultipleItems = order.items.length > 1;

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
        >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text className="font-bold text-gray-900">{order.orderNumber}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{order.date}</Text>
                </View>
                <View className={`flex-row items-center px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}>
                    {statusConfig.icon}
                    <Text className={`ml-1.5 text-xs font-semibold ${statusConfig.textColor}`}>
                        {statusConfig.text}
                    </Text>
                </View>
            </View>

            {/* Product Info */}
            <View className="flex-row mb-3">
                <View className="relative">
                    <Image
                        source={{ uri: firstItem.image }}
                        className="w-20 h-20 rounded-lg bg-gray-100"
                    />
                    {hasMultipleItems && (
                        <View className="absolute -top-1 -right-1 bg-black rounded-full w-6 h-6 items-center justify-center">
                            <Text className="text-white text-xs font-bold">+{order.items.length - 1}</Text>
                        </View>
                    )}
                </View>
                <View className="flex-1 ml-3 justify-center">
                    <Text className="font-semibold text-gray-900 mb-1" numberOfLines={2}>
                        {firstItem.name}
                    </Text>
                    {hasMultipleItems && (
                        <Text className="text-xs text-gray-500">
                            and {order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                        </Text>
                    )}
                    <View className="flex-row items-center mt-2">
                        <Image
                            source={{ uri: order.seller.avatar }}
                            className="w-4 h-4 rounded-full mr-1.5"
                        />
                        <Text className="text-xs text-gray-600">{order.seller.name}</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <Text className="text-lg font-bold text-gray-900">
                    {t('common.currency')}{order.total.toFixed(2)}
                </Text>
                <View className="flex-row items-center">
                    <Text className="text-blue-600 font-semibold text-sm mr-1">View Details</Text>
                    <ChevronRight color="#2563EB" size={16} />
                </View>
            </View>
        </TouchableOpacity>
    );
};
