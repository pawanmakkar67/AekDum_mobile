import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { X, Gavel, Timer, Layers, DollarSign } from 'lucide-react-native';

interface SellerControlsModalProps {
    visible: boolean;
    onClose: () => void;
    onStartAuction: (config: AuctionConfig) => void;
}

export interface AuctionConfig {
    quantity: number;
    startPrice: number;
    duration: number; // seconds
    autoGap: number; // seconds
    isBulk: boolean;
}

import { useTranslation } from '../hooks/useTranslation';

export const SellerControlsModal: React.FC<SellerControlsModalProps> = ({ visible, onClose, onStartAuction }) => {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState('1');
    const [startPrice, setStartPrice] = useState('100');
    const [duration, setDuration] = useState('60');
    const [autoGap, setAutoGap] = useState('15');
    const [isBulk, setIsBulk] = useState(false);

    const handleStart = () => {
        onStartAuction({
            quantity: parseInt(quantity) || 1,
            startPrice: parseInt(startPrice) || 0,
            duration: parseInt(duration) || 60,
            autoGap: parseInt(autoGap) || 15,
            isBulk
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl p-6 h-3/4">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-bold">{t('live.sellerControls.title')}</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 rounded-full">
                            <X size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Quantity / Bulk Mode */}
                        <View className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <View className="flex-row items-center mb-2">
                                <Layers size={20} color="#4B5563" />
                                <Text className="font-semibold ml-2 text-gray-700">{t('live.sellerControls.inventoryType')}</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-gray-600">{t('live.sellerControls.bulkMode')}</Text>
                                <Switch
                                    value={isBulk}
                                    onValueChange={setIsBulk}
                                    trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                                />
                            </View>
                            <Text className="text-xs text-gray-500 mb-2">{t('live.sellerControls.quantityAvailable')}</Text>
                            <TextInput
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                className="bg-white p-3 rounded-lg border border-gray-200 text-lg"
                                placeholder="1"
                            />
                        </View>

                        {/* Pricing */}
                        <View className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <View className="flex-row items-center mb-2">
                                <DollarSign size={20} color="#4B5563" />
                                <Text className="font-semibold ml-2 text-gray-700">{t('live.sellerControls.pricing')}</Text>
                            </View>
                            <Text className="text-xs text-gray-500 mb-2">{t('live.sellerControls.startingBid')}</Text>
                            <TextInput
                                value={startPrice}
                                onChangeText={setStartPrice}
                                keyboardType="numeric"
                                className="bg-white p-3 rounded-lg border border-gray-200 text-lg"
                                placeholder="100"
                            />
                        </View>

                        {/* Timing */}
                        <View className="mb-6 p-4 bg-gray-50 rounded-xl">
                            <View className="flex-row items-center mb-2">
                                <Timer size={20} color="#4B5563" />
                                <Text className="font-semibold ml-2 text-gray-700">{t('live.sellerControls.timingRules')}</Text>
                            </View>

                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 mb-2">{t('live.sellerControls.duration')}</Text>
                                    <TextInput
                                        value={duration}
                                        onChangeText={setDuration}
                                        keyboardType="numeric"
                                        className="bg-white p-3 rounded-lg border border-gray-200 text-lg"
                                        placeholder="60"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs text-gray-500 mb-2">{t('live.sellerControls.autoGap')}</Text>
                                    <TextInput
                                        value={autoGap}
                                        onChangeText={setAutoGap}
                                        keyboardType="numeric"
                                        className="bg-white p-3 rounded-lg border border-gray-200 text-lg"
                                        placeholder="15"
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleStart}
                        className="bg-black w-full py-4 rounded-full items-center mt-4 mb-8 flex-row justify-center"
                    >
                        <Gavel color="white" size={20} />
                        <Text className="text-white font-bold text-lg ml-2">{t('live.sellerControls.startAuction')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
