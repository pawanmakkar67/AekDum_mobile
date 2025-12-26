import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, LayoutAnimation, Keyboard, Dimensions, Text, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
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
    const { t, changeLanguage, currentLanguage } = useTranslation();
    const defaultPlaceholder = placeholder || t('common.search');
    const [isFocused, setIsFocused] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const LANGUAGES = [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
        // Add more supported languages here if needed
    ];

    const handleLanguageChange = (langParams: string) => {
        changeLanguage(langParams);
        setShowLanguageModal(false);
    };

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
                    <TouchableOpacity onPress={() => setShowLanguageModal(true)}>
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
            {/* Language Modal */}
            <Modal
                visible={showLanguageModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLanguageModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{t('settings.language')}</Text>
                                {LANGUAGES.map((lang) => (
                                    <TouchableOpacity
                                        key={lang.code}
                                        style={[
                                            styles.languageOption,
                                            currentLanguage === lang.code && styles.languageOptionSelected
                                        ]}
                                        onPress={() => handleLanguageChange(lang.code)}
                                    >
                                        <View>
                                            <Text style={[
                                                styles.languageLabel,
                                                currentLanguage === lang.code && styles.languageLabelSelected
                                            ]}>
                                                {lang.native}
                                            </Text>
                                            <Text style={styles.languageSubLabel}>{lang.label}</Text>
                                        </View>
                                        {currentLanguage === lang.code && (
                                            <View style={styles.checkCircle} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24, // increased padding
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#1f2937',
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16, // added horizontal padding
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        borderRadius: 12, // rounded corners for hover effect
    },
    languageOptionSelected: {
        backgroundColor: '#fdf4ff', // light purple bg
        borderColor: '#9333ea',
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    languageLabelSelected: {
        color: '#9333ea',
        fontWeight: 'bold',
    },
    languageSubLabel: { // Added sub label for English name
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 2,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#9333ea',
    }
});
