import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
    TrendingUp,
    TrendingDown,
    Package,
    UserPlus,
    Radio,
    MessageCircle,
    Trophy,
    ChevronRight
} from 'lucide-react-native';

interface NotificationItemProps {
    notification: {
        id: string;
        type: 'bid' | 'outbid' | 'won' | 'order' | 'follow' | 'stream' | 'message';
        title: string;
        message: string;
        timestamp: string;
        read: boolean;
        imageUrl?: string;
    };
    onPress: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onPress }) => {
    const getIcon = () => {
        const iconProps = { size: 24, color: 'white' };

        switch (notification.type) {
            case 'won':
                return <Trophy {...iconProps} />;
            case 'bid':
                return <TrendingUp {...iconProps} />;
            case 'outbid':
                return <TrendingDown {...iconProps} />;
            case 'order':
                return <Package {...iconProps} />;
            case 'follow':
                return <UserPlus {...iconProps} />;
            case 'stream':
                return <Radio {...iconProps} />;
            case 'message':
                return <MessageCircle {...iconProps} />;
            default:
                return <Package {...iconProps} />;
        }
    };

    const getIconBgColor = () => {
        switch (notification.type) {
            case 'won':
                return 'bg-yellow-500';
            case 'bid':
                return 'bg-green-500';
            case 'outbid':
                return 'bg-red-500';
            case 'order':
                return 'bg-blue-500';
            case 'follow':
                return 'bg-purple-500';
            case 'stream':
                return 'bg-pink-500';
            case 'message':
                return 'bg-indigo-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : 'bg-white'
                }`}
        >
            {/* Icon or Image */}
            <View className={`w-12 h-12 rounded-full ${getIconBgColor()} items-center justify-center mr-4`}>
                {notification.imageUrl ? (
                    <Image
                        source={{ uri: notification.imageUrl }}
                        className="w-12 h-12 rounded-full"
                    />
                ) : (
                    getIcon()
                )}
            </View>

            {/* Content */}
            <View className="flex-1">
                <Text className="font-bold text-gray-900 mb-1">{notification.title}</Text>
                <Text className="text-gray-600 text-sm mb-1" numberOfLines={2}>
                    {notification.message}
                </Text>
                <Text className="text-gray-400 text-xs">{notification.timestamp}</Text>
            </View>

            {/* Unread Indicator & Arrow */}
            <View className="flex-row items-center">
                {!notification.read && (
                    <View className="w-2 h-2 rounded-full bg-blue-600 mr-3" />
                )}
                <ChevronRight color="#999" size={20} />
            </View>
        </TouchableOpacity>
    );
};
