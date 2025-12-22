import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';

type SettingsDetailRouteProp = RouteProp<RootStackParamList, 'SettingsDetail'>;

export const SettingsDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<SettingsDetailRouteProp>();
    const { title } = route.params;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <ArrowLeft color="black" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-bold">{title}</Text>
            </View>
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-gray-500 text-center text-lg">
                    {title} settings coming soon!
                </Text>
            </View>
        </SafeAreaView>
    );
};
