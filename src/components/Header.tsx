import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, Keyboard, Dimensions, Text, Alert } from 'react-native';
import { Search, Bell, MessageSquare, ShoppingCart, Languages, UserCircle, Mic } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
    searchValue?: string;
    onSearchChange?: (text: string) => void;
    placeholder?: string;
    onProfilePress?: () => void;
}

const { width } = Dimensions.get('window');

export const Header = ({
    searchValue = '',
    onSearchChange,
    placeholder,
    onProfilePress
}: HeaderProps) => {
    const { t } = useTranslation();
    const defaultPlaceholder = placeholder || t('common.search');
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFocused(true);
    };

    const handleBlur = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFocused(false);
    };

    const handleCancel = () => {
        handleBlur();
        if (onSearchChange) onSearchChange('');
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
                <Search size={18} color="#9ca3af" />
                <TextInput
                    placeholder={defaultPlaceholder}
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    value={searchValue}
                    onChangeText={onSearchChange}
                    onFocus={handleFocus}
                />
                {isFocused ? (
                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => {
                        Alert.alert('Voice Search', 'Listening...', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Mock "Shoes"', onPress: () => onSearchChange && onSearchChange('Shoes') }
                        ]);
                    }}>
                        <Mic size={18} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Icons */}
            {!isFocused && (
                <View style={styles.iconsContainer}>
                    <TouchableOpacity>
                        <Languages size={22} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MessageSquare size={22} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Bell size={22} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <ShoppingCart size={22} color="#4b5563" />
                    </TouchableOpacity>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onProfilePress}>
                        <UserCircle size={24} color="#4b5563" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#e5e7eb', // gray-200
        borderWidth: 1,
        borderRadius: 9999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 12,
        // Shadow for shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchContainerFocused: {
        marginRight: 0,
    },
    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#1f2937', // gray-800
        height: '100%',
        paddingVertical: 0, // Fix alignment on android
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginLeft: 4,
    },
    cancelText: {
        color: '#9333ea',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    }
});
