import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Main: NavigatorScreenParams<MainTabParamList>;
    Welcome: undefined;
    LiveStream: { streamId: string };
    ProductDetail: { productId: string };
    // Auth screens
    Login: undefined;
    Signup: undefined;
    // Notification screens
    Notifications: undefined;
    // Order screens
    Orders: undefined;
    OrderDetail: { orderId: string };
    // Profile screens
    EditProfile: undefined;
    ProfileSettings: undefined;
    UserProfile: { userId: string };
    SettingsDetail: { title: string };
    Broadcast: undefined;
    SupportChat: undefined;
    Profile: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Marketplace: undefined;
    Favourite: undefined;
    Activity: undefined;
    Rewards: undefined;
};
