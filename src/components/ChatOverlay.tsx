import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { CHAT_MESSAGES } from '../data/mockData';

export const ChatOverlay = () => {
    return (
        <View className="h-48 w-full px-4">
            <FlatList
                data={CHAT_MESSAGES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row items-start mb-2">
                        <Text className="text-white font-bold mr-2 text-sm shadow-black shadow-sm">{item.user}:</Text>
                        <Text className="text-white text-sm shadow-black shadow-sm">{item.message}</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                inverted
                contentContainerStyle={{ flexDirection: 'column-reverse' }}
            />
        </View>
    );
};
