import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Settings as SettingsIcon, Share, Edit, Package, Radio, LifeBuoy, ChevronLeft } from 'lucide-react-native';
import { USER_PROFILE, LIVE_STREAMS, PRODUCTS } from '../data/mockData';

export const ProfileScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = React.useState<'streams' | 'listings'>('streams');

    const userStreams = LIVE_STREAMS.slice(0, 2);
    const userListings = PRODUCTS.slice(0, 3);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-4 py-2 flex-row justify-between items-center border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ChevronLeft color="black" size={24} />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold">@{USER_PROFILE.username}</Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity className="mr-4" onPress={() => { }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Share color="black" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileSettings')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <SettingsIcon color="black" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View className="items-center mt-6 px-4">
                    <View className="relative">
                        <Image
                            source={{ uri: USER_PROFILE.avatar }}
                            className="w-24 h-24 rounded-full border-2 border-gray-100"
                        />
                        {USER_PROFILE.verified && (
                            <View className="absolute bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full items-center justify-center border-2 border-white">
                                <Text className="text-white text-xs font-bold">✓</Text>
                            </View>
                        )}
                    </View>
                    <Text className="mt-3 text-2xl font-bold">{USER_PROFILE.displayName}</Text>
                    {USER_PROFILE.bio && (
                        <Text className="text-gray-600 text-center mt-2 px-4">{USER_PROFILE.bio}</Text>
                    )}

                    {/* Badges */}
                    {USER_PROFILE.badges.length > 0 && (
                        <View className="flex-row flex-wrap justify-center mt-3">
                            {USER_PROFILE.badges.map((badge, index) => (
                                <View key={index} className="bg-purple-100 px-3 py-1 rounded-full mr-2 mb-2">
                                    <Text className="text-purple-700 text-xs font-semibold">{badge}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Stats */}
                    <View className="flex-row mt-6 w-full justify-around">
                        <View className="items-center">
                            <Text className="font-bold text-xl">{USER_PROFILE.followers.toLocaleString()}</Text>
                            <Text className="text-gray-500 text-sm">{t('profile.followers')}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="font-bold text-xl">{USER_PROFILE.following}</Text>
                            <Text className="text-gray-500 text-sm">{t('profile.following')}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="font-bold text-xl">{USER_PROFILE.stats.itemsSold}</Text>
                            <Text className="text-gray-500 text-sm">{t('profile.sold')}</Text>
                        </View>
                    </View>

                    {/* Edit Profile Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('EditProfile')}
                        className="bg-black w-full py-3 rounded-xl mt-6 flex-row items-center justify-center"
                    >
                        <Edit color="white" size={18} />
                        <Text className="text-white font-bold ml-2">{t('profile.editProfile')}</Text>
                    </TouchableOpacity>

                    {/* Orders Button */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Orders')}
                        className="bg-gray-100 w-full py-3 rounded-xl mt-3 flex-row items-center justify-center"
                    >
                        <Package color="black" size={18} />
                        <Text className="text-black font-bold ml-2">{t('profile.myOrders')}</Text>
                    </TouchableOpacity>

                    {/* Support Button */}
                    <TouchableOpacity
                        onPress={() => (navigation as any).navigate('SupportChat')}
                        className="bg-green-50 w-full py-3 rounded-xl mt-3 flex-row items-center justify-center border border-green-100"
                    >
                        <LifeBuoy color="#059669" size={18} />
                        <Text className="text-green-700 font-bold ml-2">Help & Support</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Stats */}
                <View className="mt-6 px-4">
                    <View className="bg-gray-50 rounded-xl p-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-gray-700">{t('profile.rating')}</Text>
                            <Text className="font-bold text-gray-900">{USER_PROFILE.rating} / 5.0</Text>
                        </View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-gray-700">{t('profile.responseTime')}</Text>
                            <Text className="font-bold text-gray-900">{USER_PROFILE.responseTime}</Text>
                        </View>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-gray-700">{t('profile.activeListings')}</Text>
                            <Text className="font-bold text-gray-900">{USER_PROFILE.stats.activeListings}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row mt-6 px-4 border-b border-gray-200">
                    <TouchableOpacity
                        onPress={() => setActiveTab('streams')}
                        className={`flex-1 pb-3 ${activeTab === 'streams' ? 'border-b-2 border-black' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${activeTab === 'streams' ? 'text-black' : 'text-gray-500'}`}>
                            {t('profile.pastStreams')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('listings')}
                        className={`flex-1 pb-3 ${activeTab === 'listings' ? 'border-b-2 border-black' : ''}`}
                    >
                        <Text className={`text-center font-semibold ${activeTab === 'listings' ? 'text-black' : 'text-gray-500'}`}>
                            {t('profile.listings')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="px-4 mt-4 mb-8">
                    {activeTab === 'streams' ? (
                        userStreams.length > 0 ? (
                            <View className="flex-row flex-wrap">
                                {userStreams.map(stream => (
                                    <TouchableOpacity
                                        key={stream.id}
                                        className="w-[48%] mr-[4%] mb-4"
                                        onPress={() => navigation.navigate('LiveStream', { streamId: stream.id })}
                                    >
                                        <Image
                                            source={{ uri: stream.image }}
                                            className="w-full h-40 rounded-xl bg-gray-100"
                                        />
                                        <View className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded-md flex-row items-center">
                                            <Radio color="white" size={12} />
                                            <Text className="text-white text-xs font-bold ml-1">
                                                {stream.viewers.toLocaleString()}
                                            </Text>
                                        </View>
                                        <Text className="mt-2 font-semibold text-gray-900" numberOfLines={2}>
                                            {stream.title}
                                        </Text>
                                        <Text className="text-xs text-gray-500 mt-1">{stream.category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View className="bg-gray-100 p-8 rounded-lg items-center">
                                <Text className="text-gray-500">{t('profile.noStreams')}</Text>
                            </View>
                        )
                    ) : (
                        userListings.length > 0 ? (
                            <View className="flex-row flex-wrap">
                                {userListings.map(product => (
                                    <TouchableOpacity
                                        key={product.id}
                                        className="w-[48%] mr-[4%] mb-4"
                                        onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                                    >
                                        <Image
                                            source={{ uri: product.image }}
                                            className="w-full h-40 rounded-xl bg-gray-100"
                                        />
                                        <Text className="mt-2 font-semibold text-gray-900" numberOfLines={2}>
                                            {product.name}
                                        </Text>
                                        <Text className="text-sm font-bold text-gray-900 mt-1">
                                            {product.priceString}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View className="bg-gray-100 p-8 rounded-lg items-center">
                                <Text className="text-gray-500">{t('profile.noListings')}</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
