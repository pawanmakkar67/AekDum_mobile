import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
}) => {
    const getSpinnerColor = () => {
        if (variant === 'outline' || variant === 'ghost') {
            return theme.colors.primary;
        }
        return theme.colors.white;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.base,
                styles[variant],
                styles[`size_${size}`],
                fullWidth && styles.fullWidth,
                (disabled || loading) && styles.disabled,
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getSpinnerColor()} size="small" />
            ) : (
                <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: theme.colors.error,
    },

    // Sizes
    size_sm: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: theme.sizes.button.sm,
    },
    size_md: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: theme.sizes.button.md,
    },
    size_lg: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: theme.sizes.button.lg,
    },

    fullWidth: {
        width: '100%',
    },

    disabled: {
        opacity: 0.5,
    },

    // Text styles
    text: {
        fontWeight: theme.typography.fontWeight.bold,
    },
    text_primary: {
        color: theme.colors.white,
    },
    text_secondary: {
        color: theme.colors.black,
    },
    text_outline: {
        color: theme.colors.primary,
    },
    text_ghost: {
        color: theme.colors.primary,
    },
    text_danger: {
        color: theme.colors.white,
    },
    text_sm: {
        fontSize: theme.typography.fontSize.sm,
    },
    text_md: {
        fontSize: theme.typography.fontSize.base,
    },
    text_lg: {
        fontSize: theme.typography.fontSize.lg,
    },
});
