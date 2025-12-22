import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { CATEGORIES } from '../data/mockData';

export const CategoryList = () => {
    return (
        <View className="py-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                {CATEGORIES.map((category) => (
                    <TouchableOpacity key={category.id} className="mr-4 items-center">
                        <View className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                            <Image source={{ uri: category.image }} className="h-full w-full" />
                        </View>
                        <Text className="mt-1 text-xs font-medium text-gray-700">{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
