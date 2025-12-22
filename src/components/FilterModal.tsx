import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

export interface FilterOptions {
    priceRange: { min: number; max: number };
    condition: string[];
    itemType: 'all' | 'auction' | 'buyNow';
}

const CONDITIONS = ['New', 'Used - Like New', 'Used - Excellent', 'Used - Good', 'Graded - PSA 10'];

export const FilterModal = ({ visible, onClose, onApply, currentFilters }: FilterModalProps) => {
    const { t } = useTranslation();
    const [filters, setFilters] = React.useState<FilterOptions>(currentFilters);

    const priceRanges = useMemo(() => [
        { label: `${t('common.under')} ${t('common.currency')}50`, min: 0, max: 50 },
        { label: `${t('common.currency')}50 - ${t('common.currency')}100`, min: 50, max: 100 },
        { label: `${t('common.currency')}100 - ${t('common.currency')}250`, min: 100, max: 250 },
        { label: `${t('common.currency')}250 - ${t('common.currency')}500`, min: 250, max: 500 },
        { label: `${t('common.over')} ${t('common.currency')}500`, min: 500, max: 10000 },
    ], [t]);

    const toggleCondition = (condition: string) => {
        setFilters(prev => ({
            ...prev,
            condition: prev.condition.includes(condition)
                ? prev.condition.filter(c => c !== condition)
                : [...prev.condition, condition]
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            priceRange: { min: 0, max: 10000 },
            condition: [],
            itemType: 'all'
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 justify-end bg-black/60"
                onPress={onClose}
            >
                <Pressable
                    className="bg-white rounded-t-3xl h-[80%]"
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                        <View className="flex-row items-center">
                            <SlidersHorizontal color="black" size={24} />
                            <Text className="text-xl font-bold ml-2">Filters</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="p-2"
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <X color="black" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        className="flex-1 p-4"
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Item Type */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold mb-3">Item Type</Text>
                            <View className="flex-row space-x-2">
                                {[
                                    { label: 'All', value: 'all' as const },
                                    { label: 'Auction', value: 'auction' as const },
                                    { label: 'Buy Now', value: 'buyNow' as const }
                                ].map(type => (
                                    <TouchableOpacity
                                        key={type.value}
                                        onPress={() => setFilters(prev => ({ ...prev, itemType: type.value }))}
                                        activeOpacity={0.7}
                                        className={`flex-1 py-3 rounded-full border-2 ${filters.itemType === type.value
                                            ? 'bg-black border-black'
                                            : 'bg-white border-gray-300'
                                            }`}
                                    >
                                        <Text className={`text-center font-semibold ${filters.itemType === type.value ? 'text-white' : 'text-gray-700'
                                            }`}>
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Price Range */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold mb-3">Price Range</Text>
                            <View className="space-y-2">
                                {priceRanges.map(range => (
                                    <TouchableOpacity
                                        key={range.label}
                                        onPress={() => setFilters(prev => ({
                                            ...prev,
                                            priceRange: { min: range.min, max: range.max }
                                        }))}
                                        activeOpacity={0.7}
                                        className={`p-4 rounded-xl border-2 mb-2 ${filters.priceRange.min === range.min && filters.priceRange.max === range.max
                                            ? 'bg-black border-black'
                                            : 'bg-white border-gray-200'
                                            }`}
                                    >
                                        <Text className={`font-semibold ${filters.priceRange.min === range.min && filters.priceRange.max === range.max
                                            ? 'text-white'
                                            : 'text-gray-900'
                                            }`}>
                                            {range.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Condition */}
                        <View className="mb-6">
                            <Text className="text-lg font-bold mb-3">Condition</Text>
                            <View className="space-y-2">
                                {CONDITIONS.map(condition => (
                                    <TouchableOpacity
                                        key={condition}
                                        onPress={() => toggleCondition(condition)}
                                        activeOpacity={0.7}
                                        className={`p-4 rounded-xl border-2 mb-2 ${filters.condition.includes(condition)
                                            ? 'bg-black border-black'
                                            : 'bg-white border-gray-200'
                                            }`}
                                    >
                                        <Text className={`font-semibold ${filters.condition.includes(condition) ? 'text-white' : 'text-gray-900'
                                            }`}>
                                            {condition}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View className="p-4 border-t border-gray-200 flex-row space-x-3 bg-white">
                        <TouchableOpacity
                            onPress={handleReset}
                            activeOpacity={0.7}
                            className="flex-1 py-4 rounded-full border-2 border-gray-300"
                        >
                            <Text className="text-center font-bold text-gray-700">Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleApply}
                            activeOpacity={0.7}
                            className="flex-1 py-4 rounded-full bg-black"
                        >
                            <Text className="text-center font-bold text-white">Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
