import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { MarketplaceScreen } from '../screens/MarketplaceScreen';
import { FavouriteScreen } from '../screens/FavouriteScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { HomeIcon } from '../components/icons/HomeIcon';
import { CategoriesIcon } from '../components/icons/CategoriesIcon';
import { FavouriteIcon } from '../components/icons/FavouriteIcon';
import { ActivityIcon } from '../components/icons/ActivityIcon';
import { RewardsIcon } from '../components/icons/RewardsIcon';
import { MainTabParamList } from '../types/navigation';
import { useNotifications } from '../context/NotificationContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ActivityTabIconWithBadge = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => {
    const { unreadCount } = useNotifications();

    return (
        <View>
            <ActivityIcon color={color} size={size} focused={focused} />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#ef4444',
        minWidth: 18,
        height: 18,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#d946ef', // Purple
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
                    height: Platform.OS === 'ios' ? 85 : 65,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <HomeIcon color={color} size={24} focused={focused} />,
                    tabBarLabel: t('navigation.home')
                }}
            />
            <Tab.Screen
                name="Marketplace"
                component={MarketplaceScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <CategoriesIcon color={color} size={24} focused={focused} />,
                    tabBarLabel: t('navigation.categories')
                }}
            />
            <Tab.Screen
                name="Favourite"
                component={FavouriteScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <FavouriteIcon color={color} size={24} focused={focused} />,
                    tabBarLabel: t('navigation.favourite')
                }}
            />
            <Tab.Screen
                name="Activity"
                component={ActivityScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <ActivityTabIconWithBadge color={color} size={24} focused={focused} />,
                    tabBarLabel: t('navigation.activity')
                }}
            />
            <Tab.Screen
                name="Rewards"
                component={RewardsScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => <RewardsIcon color={color} size={24} focused={focused} />,
                    tabBarLabel: t('navigation.rewards')
                }}
            />
        </Tab.Navigator>
    );
};
