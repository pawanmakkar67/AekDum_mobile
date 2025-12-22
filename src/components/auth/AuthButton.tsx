import React from 'react';
import { Text, TouchableOpacity, Image, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Apple, Smartphone } from 'lucide-react-native';
import { colors } from '../../theme/colors';

type AuthButtonVariant = 'apple' | 'google' | 'phone' | 'primary';

interface AuthButtonProps {
    variant: AuthButtonVariant;
    onPress: () => void;
    label?: string; // Optional for icon-only buttons
    fullWidth?: boolean;
}

export const AuthButton = ({ variant, onPress, label, fullWidth = false }: AuthButtonProps) => {

    const getButtonStyle = (): ViewStyle => {
        switch (variant) {
            case 'apple':
                return {
                    backgroundColor: colors.social.apple,
                    borderColor: colors.social.apple,
                    borderWidth: 1,
                };
            case 'google':
                return {
                    backgroundColor: colors.social.google,
                    borderColor: colors.gray[200],
                    borderWidth: 1,
                };
            case 'phone':
                return {
                    backgroundColor: colors.social.phone,
                    borderColor: colors.social.phone,
                    borderWidth: 1,
                };
            case 'primary':
                return {
                    backgroundColor: colors.brand.pink, // Or branding pink
                    borderColor: colors.brand.pink,
                    borderWidth: 1,
                };
            default:
                return {
                    backgroundColor: colors.gray[200],
                };
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (variant) {
            case 'google':
                return { color: colors.text.primary };
            default:
                return { color: colors.white };
        }
    };

    const renderIcon = () => {
        switch (variant) {
            case 'apple':
                return <Apple color="white" size={24} fill="white" />;
            case 'google':
                return (
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
                        style={styles.googleIcon}
                    />
                );
            case 'phone':
                return <Smartphone color="white" size={24} fill="white" />;
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                fullWidth ? styles.fullWidth : styles.iconOnly,
                getButtonStyle()
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {renderIcon()}
            {label && (
                <Text style={[styles.text, renderIcon() ? styles.textWithIcon : null, getTextStyle()]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 9999, // Full rounded
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    fullWidth: {
        width: '100%',
        paddingVertical: 16,
    },
    iconOnly: {
        width: 80,
        height: 56,
    },
    text: {
        fontWeight: '600',
        fontSize: 17,
    },
    textWithIcon: {
        marginLeft: 12,
    },
    googleIcon: {
        width: 24,
        height: 24,
    }
});
