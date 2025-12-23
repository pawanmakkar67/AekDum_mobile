import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from '../types/navigation';

import { LiveStreamScreen } from '../screens/LiveStreamScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderDetailScreen } from '../screens/OrderDetailScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SellerProfileScreen } from '../screens/SellerProfileScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { SettingsDetailScreen } from '../screens/SettingsDetailScreen';
import { BroadcastScreen } from '../screens/BroadcastScreen';
import { SupportChatScreen } from '../screens/SupportChatScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { MiniPlayer } from '../components/MiniPlayer';
import { LiveShoppingListScreen } from '../screens/LiveShoppingListScreen';
import { TopSellersListScreen } from '../screens/TopSellersListScreen';
import { AuctionsListScreen } from '../screens/AuctionsListScreen';
import { FutureShoppingListScreen } from '../screens/FutureShoppingListScreen';

import { SplashScreen } from '../screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="LiveStream" component={LiveStreamScreen} options={{ presentation: 'fullScreenModal' }} />
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="Orders" component={OrdersScreen} />
                <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="Profile" component={SellerProfileScreen} />
                <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
                <Stack.Screen name="SettingsDetail" component={SettingsDetailScreen} />
                <Stack.Screen name="Broadcast" component={BroadcastScreen} options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
                <Stack.Screen name="SupportChat" component={SupportChatScreen} />
                <Stack.Screen name="LiveShoppingList" component={LiveShoppingListScreen} />
                <Stack.Screen name="TopSellersList" component={TopSellersListScreen} />
                <Stack.Screen name="AuctionsList" component={AuctionsListScreen} />
                <Stack.Screen name="FutureShoppingList" component={FutureShoppingListScreen} />
            </Stack.Navigator>
            <MiniPlayer />
        </NavigationContainer >
    );
};
