// Push Notification Service
// Handles push notifications for live stream events, promotions, and order updates

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = '@push_notification_token';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationData {
    type: 'stream_started' | 'stream_ended' | 'order_update' | 'promotion' | 'bid_update' | 'message';
    title: string;
    body: string;
    data?: Record<string, any>;
}

class PushNotificationService {
    private expoPushToken: string | null = null;
    private notificationListener: any = null;
    private responseListener: any = null;

    // Initialize push notifications
    async initialize(): Promise<string | null> {
        if (!Device.isDevice) {
            console.warn('Push notifications only work on physical devices');
            return null;
        }

        try {
            // Check existing permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Request permissions if not granted
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Push notification permission not granted');
                return null;
            }

            // Get push token
            const token = await Notifications.getExpoPushTokenAsync({
                projectId: 'your-expo-project-id', // Replace with your Expo project ID
            });

            this.expoPushToken = token.data;
            await this.storePushToken(token.data);

            // Configure notification channel for Android
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            // Set up listeners
            this.setupListeners();

            return token.data;
        } catch (error) {
            console.error('Error initializing push notifications:', error);
            return null;
        }
    }

    // Set up notification listeners
    private setupListeners(): void {
        // Listener for notifications received while app is foregrounded
        this.notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log('Notification received:', notification);
                this.handleNotificationReceived(notification);
            }
        );

        // Listener for when user taps on notification
        this.responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log('Notification tapped:', response);
                this.handleNotificationTapped(response);
            }
        );
    }

    // Handle notification received
    private handleNotificationReceived(notification: Notifications.Notification): void {
        const data = notification.request.content.data as Partial<NotificationData>;

        // You can emit events here to update UI
        // For example, if a stream starts, you could navigate to the stream
        console.log('Notification data:', data);
    }

    // Handle notification tapped
    private handleNotificationTapped(response: Notifications.NotificationResponse): void {
        const data = response.notification.request.content.data as Partial<NotificationData>;

        // Navigate based on notification type
        switch (data.type) {
            case 'stream_started':
                // Navigate to live stream
                console.log('Navigate to stream:', data.data?.streamId);
                break;
            case 'order_update':
                // Navigate to order details
                console.log('Navigate to order:', data.data?.orderId);
                break;
            case 'promotion':
                // Navigate to promotion
                console.log('Navigate to promotion:', data.data?.promotionId);
                break;
            default:
                console.log('Unknown notification type:', data.type);
        }
    }

    // Schedule a local notification
    async scheduleNotification(
        title: string,
        body: string,
        data?: Record<string, any>,
        trigger?: Notifications.NotificationTriggerInput
    ): Promise<string> {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: trigger || null, // null means immediate
        });
    }

    // Send notification to server (for backend to send push)
    async registerPushToken(userId: string): Promise<void> {
        if (!this.expoPushToken) {
            console.warn('No push token available');
            return;
        }

        try {
            // Send token to your backend
            // await fetch('https://your-backend.com/api/push-tokens', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         userId,
            //         token: this.expoPushToken,
            //         platform: Platform.OS,
            //     }),
            // });

            console.log('Push token registered for user:', userId);
        } catch (error) {
            console.error('Error registering push token:', error);
        }
    }

    // Cancel all scheduled notifications
    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    // Get badge count
    async getBadgeCount(): Promise<number> {
        return await Notifications.getBadgeCountAsync();
    }

    // Set badge count
    async setBadgeCount(count: number): Promise<void> {
        await Notifications.setBadgeCountAsync(count);
    }

    // Clear badge
    async clearBadge(): Promise<void> {
        await Notifications.setBadgeCountAsync(0);
    }

    // Store push token
    private async storePushToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Error storing push token:', error);
        }
    }

    // Get stored push token
    async getStoredPushToken(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting stored push token:', error);
            return null;
        }
    }

    // Clean up listeners
    cleanup(): void {
        if (this.notificationListener) {
            this.notificationListener.remove();
        }
        if (this.responseListener) {
            this.responseListener.remove();
        }
    }

    // Get push token
    getPushToken(): string | null {
        return this.expoPushToken;
    }
}

export const pushNotificationService = new PushNotificationService();
