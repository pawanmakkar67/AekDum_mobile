import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import {
    ArrowLeft,
    ChevronRight,
    Bell,
    Lock,
    CreditCard,
    MapPin,
    HelpCircle,
    Shield,
    LogOut,
    User,
    MessageCircle,
    FileText,
    Globe
} from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

export const ProfileSettingsScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [pushNotifications, setPushNotifications] = React.useState(true);
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [bidAlerts, setBidAlerts] = React.useState(true);
    const { t } = useTranslation();
    const { availableLanguages, currentLanguage } = useLanguage();
    const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);

    const currentLanguageLabel = availableLanguages.find(l => l.code === currentLanguage)?.label || 'English';

    const handleLogout = () => {
        // In a real app, this would clear auth state
        console.log('Logging out...');
        navigation.navigate('Login');
    };

    const SettingItem = ({
        icon: Icon,
        title,
        subtitle,
        onPress,
        showArrow = true
    }: any) => (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 px-4 border-b border-gray-100"
        >
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Icon color="#374151" size={20} />
            </View>
            <View className="flex-1">
                <Text className="font-semibold text-gray-900">{title}</Text>
                {subtitle && <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>}
            </View>
            {showArrow && <ChevronRight color="#9CA3AF" size={20} />}
        </TouchableOpacity>
    );

    const ToggleItem = ({
        icon: Icon,
        title,
        subtitle,
        value,
        onValueChange
    }: any) => (
        <View className="flex-row items-center py-4 px-4 border-b border-gray-100">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Icon color="#374151" size={20} />
            </View>
            <View className="flex-1">
                <Text className="font-semibold text-gray-900">{title}</Text>
                {subtitle && <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="white"
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <ArrowLeft color="black" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-bold">{t('settings.title')}</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Account Section */}
                <View className="mt-4">
                    <Text className="px-4 py-2 text-sm font-bold text-gray-500">{t('settings.account')}</Text>
                    <SettingItem
                        icon={User}
                        title={t('settings.editProfile')}
                        subtitle={t('settings.editProfile')}
                        onPress={() => navigation.navigate('EditProfile')}
                    />
                    <SettingItem
                        icon={CreditCard}
                        title={t('settings.paymentMethods')}
                        subtitle={t('settings.paymentMethods')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Payment Methods' })}
                    />
                    <SettingItem
                        icon={MapPin}
                        title={t('settings.shippingAddresses')}
                        subtitle={t('settings.shippingAddresses')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Shipping Addresses' })}
                    />
                    <SettingItem
                        icon={Globe}
                        title={t('settings.language')}
                        subtitle={currentLanguageLabel}
                        onPress={() => setShowLanguageSelector(true)}
                    />
                </View>

                {/* Notifications Section */}
                <View className="mt-6">
                    <Text className="px-4 py-2 text-sm font-bold text-gray-500">{t('settings.notifications')}</Text>
                    <ToggleItem
                        icon={Bell}
                        title={t('settings.pushNotifications')}
                        subtitle={t('settings.pushNotifications')}
                        value={pushNotifications}
                        onValueChange={setPushNotifications}
                    />
                    <ToggleItem
                        icon={Bell}
                        title={t('settings.emailNotifications')}
                        subtitle={t('settings.emailNotifications')}
                        value={emailNotifications}
                        onValueChange={setEmailNotifications}
                    />
                    <ToggleItem
                        icon={Bell}
                        title={t('settings.bidAlerts')}
                        subtitle={t('settings.bidAlerts')}
                        value={bidAlerts}
                        onValueChange={setBidAlerts}
                    />
                </View>

                {/* Privacy & Security */}
                <View className="mt-6">
                    <Text className="px-4 py-2 text-sm font-bold text-gray-500">{t('settings.privacy')}</Text>
                    <SettingItem
                        icon={Lock}
                        title={t('settings.changePassword')}
                        subtitle={t('settings.changePassword')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Change Password' })}
                    />
                    <SettingItem
                        icon={Shield}
                        title={t('settings.privacyItem')}
                        subtitle={t('settings.privacy')} // Using privacy translation again as placeholder
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Privacy Settings' })}
                    />
                </View>

                {/* Support */}
                <View className="mt-6">
                    <Text className="px-4 py-2 text-sm font-bold text-gray-500">{t('settings.support')}</Text>
                    <SettingItem
                        icon={MessageCircle}
                        title={t('settings.contactUs')}
                        subtitle={t('settings.contactUs')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Contact Us' })}
                    />
                    <SettingItem
                        icon={HelpCircle}
                        title={t('settings.faq')}
                        subtitle={t('settings.faq')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'FAQ' })}
                    />
                </View>

                {/* Legal */}
                <View className="mt-6">
                    <Text className="px-4 py-2 text-sm font-bold text-gray-500">{t('settings.legal')}</Text>
                    <SettingItem
                        icon={FileText}
                        title={t('settings.terms')}
                        subtitle={t('settings.terms')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Terms and Conditions' })}
                    />
                    <SettingItem
                        icon={Shield}
                        title={t('settings.privacyPolicy')}
                        subtitle={t('settings.privacyPolicy')}
                        onPress={() => navigation.navigate('SettingsDetail', { title: 'Privacy Policy' })}
                    />
                </View>

                {/* Logout */}
                <View className="mt-6 mb-8">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center py-4 px-4 mx-4 bg-red-50 rounded-xl"
                    >
                        <LogOut color="#DC2626" size={20} />
                        <Text className="ml-3 font-bold text-red-600">{t('settings.logout')}</Text>
                    </TouchableOpacity>
                </View>

                <View className="items-center pb-8">
                    <Text className="text-xs text-gray-400">{t('settings.version')} 1.0.0</Text>
                </View>
            </ScrollView>

            <LanguageSelector
                visible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
            />
        </SafeAreaView>
    );
};
