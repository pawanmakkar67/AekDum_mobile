import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNotifications } from '../context/NotificationContext';
import { NotificationItem } from '../components/NotificationItem';
import { ArrowLeft, CheckCheck, Bell } from 'lucide-react-native';

export const NotificationsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleNotificationPress = (notification: any) => {
        markAsRead(notification.id);

        // Navigate based on notification type
        if (notification.type === 'order' && notification.relatedId) {
            navigation.navigate('OrderDetail', { orderId: notification.relatedId });
        } else if (notification.type === 'stream' && notification.relatedId) {
            navigation.navigate('LiveStream', { streamId: notification.relatedId });
        } else if (notification.relatedId && ['bid', 'outbid', 'won'].includes(notification.type)) {
            navigation.navigate('ProductDetail', { productId: notification.relatedId });
        }
    };

    const groupNotifications = () => {
        const now = new Date();
        const today: any[] = [];
        const thisWeek: any[] = [];
        const earlier: any[] = [];

        notifications.forEach(notif => {
            // Simple grouping based on timestamp text
            if (notif.timestamp.includes('min') || notif.timestamp.includes('hour') || notif.timestamp === 'Just now') {
                today.push(notif);
            } else if (notif.timestamp.includes('day')) {
                thisWeek.push(notif);
            } else {
                earlier.push(notif);
            }
        });

        return { today, thisWeek, earlier };
    };

    const { today, thisWeek, earlier } = groupNotifications();
    const hasNotifications = notifications.length > 0;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ArrowLeft color="black" size={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">{t('notifications.title')}</Text>
                </View>
                {hasNotifications && (
                    <TouchableOpacity onPress={markAllAsRead} className="flex-row items-center">
                        <CheckCheck color="#2563EB" size={20} />
                        <Text className="text-blue-600 font-semibold ml-1">{t('notifications.markAllRead')}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            {!hasNotifications ? (
                <View className="flex-1 items-center justify-center px-8">
                    <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                        <Bell color="#9CA3AF" size={48} />
                    </View>
                    <Text className="text-xl font-bold text-gray-900 mb-2">{t('notifications.empty')}</Text>
                    <Text className="text-gray-500 text-center">
                        {t('notifications.emptySubtitle')}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {/* Today */}
                    {today.length > 0 && (
                        <View>
                            <View className="px-4 py-3 bg-gray-50">
                                <Text className="text-sm font-bold text-gray-700">{t('notifications.today')}</Text>
                            </View>
                            {today.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onPress={() => handleNotificationPress(notification)}
                                />
                            ))}
                        </View>
                    )}

                    {/* This Week */}
                    {thisWeek.length > 0 && (
                        <View>
                            <View className="px-4 py-3 bg-gray-50">
                                <Text className="text-sm font-bold text-gray-700">{t('notifications.thisWeek')}</Text>
                            </View>
                            {thisWeek.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onPress={() => handleNotificationPress(notification)}
                                />
                            ))}
                        </View>
                    )}

                    {/* Earlier */}
                    {earlier.length > 0 && (
                        <View>
                            <View className="px-4 py-3 bg-gray-50">
                                <Text className="text-sm font-bold text-gray-700">{t('notifications.earlier')}</Text>
                            </View>
                            {earlier.map(notification => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onPress={() => handleNotificationPress(notification)}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
