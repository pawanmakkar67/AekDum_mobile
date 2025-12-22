import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
    visible: boolean;
    onClose: () => void;
}

export const LanguageSelector = ({ visible, onClose }: LanguageSelectorProps) => {
    const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

    const handleSelectLanguage = (langCode: string) => {
        changeLanguage(langCode);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-center items-center px-4"
                onPress={onClose}
            >
                <Pressable className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-xl" onPress={e => e.stopPropagation()}>
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                        <Text className="text-lg font-bold">Select Language</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <X size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View className="p-2">
                        {availableLanguages.map((lang) => {
                            const isSelected = currentLanguage === lang.code;
                            return (
                                <TouchableOpacity
                                    key={lang.code}
                                    onPress={() => handleSelectLanguage(lang.code)}
                                    className={`flex-row items-center justify-between p-4 mb-1 rounded-xl ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
                                >
                                    <View className="flex-row items-center">
                                        <Text className={`text-base ${isSelected ? 'font-bold text-blue-600' : 'text-gray-900'}`}>
                                            {lang.label}
                                        </Text>
                                        <Text className="ml-2 text-sm text-gray-500 uppercase">
                                            ({lang.code})
                                        </Text>
                                    </View>
                                    {isSelected && <Check size={20} color="#2563EB" />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};
