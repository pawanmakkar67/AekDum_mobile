import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { Box, Sparkles } from 'lucide-react-native';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        condition?: string;
        isAuction?: boolean;
        bids?: number;
    };
    onPress?: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
    const { t } = useTranslation();
    const [is3DGenerated, setIs3DGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handle3DGenerate = (e: any) => {
        e.stopPropagation();
        if (is3DGenerated) {
            setIs3DGenerated(false);
            return;
        }

        setIsGenerating(true);
        // Simulate "Banana Pro" generation
        Alert.alert('🍌 Banana Pro', 'Generating 3D render... Please wait.', [
            { text: 'Cancel', style: 'cancel', onPress: () => setIsGenerating(false) }
        ]);

        setTimeout(() => {
            setIsGenerating(false);
            setIs3DGenerated(true);
        }, 2000);
    };

    return (
        <TouchableOpacity
            className={`w-[48%] mb-4 bg-white rounded-lg shadow-sm border ${is3DGenerated ? 'border-purple-500 border-2' : 'border-gray-100'} overflow-hidden`}
            onPress={onPress}
            style={is3DGenerated ? {
                transform: [{ perspective: 1000 }, { rotateY: '10deg' }, { rotateX: '5deg' }],
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 10
            } : {}}
        >
            <View className="h-40 w-full bg-gray-100 relative">
                <Image source={{ uri: product.image }} className="h-full w-full" resizeMode="cover" />

                {/* 3D Toggle Button */}
                <TouchableOpacity
                    onPress={handle3DGenerate}
                    className={`absolute top-2 right-2 p-1.5 rounded-full ${is3DGenerated ? 'bg-purple-600' : 'bg-black/50'}`}
                >
                    {is3DGenerated ? (
                        <Sparkles size={16} color="white" />
                    ) : (
                        <Box size={16} color="white" />
                    )}
                </TouchableOpacity>

                {is3DGenerated && (
                    <View className="absolute bottom-2 left-2 bg-purple-600 px-2 py-0.5 rounded shadow-sm">
                        <Text className="text-white text-[10px] font-bold">3D VIEW</Text>
                    </View>
                )}

                {product.isAuction && !is3DGenerated && (
                    <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-bold">{t('common.auction')}</Text>
                    </View>
                )}
            </View>
            <View className="p-2">
                <Text className="text-sm font-medium text-gray-900" numberOfLines={2}>{product.name}</Text>
                <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-sm font-bold text-black">{t('common.currency')}{product.price}</Text>
                    {product.isAuction && product.bids && (
                        <Text className="text-xs text-gray-500">{product.bids} {t('product.bids')}</Text>
                    )}
                </View>
                {product.condition && (
                    <Text className="text-xs text-gray-500 mt-0.5">{product.condition}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};
