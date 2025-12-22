import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { USER_PROFILE } from '../data/mockData';

export const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [displayName, setDisplayName] = useState(USER_PROFILE.displayName);
    const [username, setUsername] = useState(USER_PROFILE.username);
    const [bio, setBio] = useState(USER_PROFILE.bio || '');
    const [instagram, setInstagram] = useState(USER_PROFILE.socialLinks?.instagram || '');
    const [twitter, setTwitter] = useState(USER_PROFILE.socialLinks?.twitter || '');

    const handleSave = () => {
        // In a real app, this would save to backend
        console.log('Saving profile:', { displayName, username, bio, instagram, twitter });
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <ArrowLeft color="black" size={24} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">{t('profile.editProfile')}</Text>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-blue-600 font-bold text-base">{t('common.save')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View className="items-center py-6">
                    <View className="relative">
                        <Image
                            source={{ uri: USER_PROFILE.avatar }}
                            className="w-24 h-24 rounded-full"
                        />
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-black w-8 h-8 rounded-full items-center justify-center border-2 border-white">
                            <Camera color="white" size={16} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity className="mt-3">
                        <Text className="text-blue-600 font-semibold">{t('profile.changePhoto')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="px-4">
                    {/* Display Name */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('profile.displayName')}</Text>
                        <TextInput
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder={t('profile.displayNamePlaceholder')}
                            className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                        />
                    </View>

                    {/* Username */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('profile.username')}</Text>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder={t('profile.usernamePlaceholder')}
                            autoCapitalize="none"
                            className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                        />
                        <Text className="text-xs text-gray-500 mt-1">
                            {t('profile.usernameHint')}
                        </Text>
                    </View>

                    {/* Bio */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">{t('profile.bio')}</Text>
                        <TextInput
                            value={bio}
                            onChangeText={setBio}
                            placeholder={t('profile.bioPlaceholder')}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                            maxLength={150}
                        />
                        <Text className="text-xs text-gray-500 mt-1 text-right">
                            {bio.length}/150
                        </Text>
                    </View>

                    {/* Social Links */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-3">{t('profile.socialLinks')}</Text>

                        <View className="mb-3">
                            <Text className="text-xs text-gray-600 mb-1">{t('profile.instagram')}</Text>
                            <TextInput
                                value={instagram}
                                onChangeText={setInstagram}
                                placeholder="@username"
                                autoCapitalize="none"
                                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                            />
                        </View>

                        <View>
                            <Text className="text-xs text-gray-600 mb-1">{t('profile.twitter')}</Text>
                            <TextInput
                                value={twitter}
                                onChangeText={setTwitter}
                                placeholder="@username"
                                autoCapitalize="none"
                                className="bg-gray-50 rounded-xl px-4 py-3 text-base"
                            />
                        </View>
                    </View>
                </View>

                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
};
