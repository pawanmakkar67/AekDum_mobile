import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { Text } from './Text';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    style,
}) => {
    return (
        <View style={[styles.base, styles[variant], styles[`size_${size}`], style]}>
            <Text style={[styles.text, styles[`text_${size}`]]}>
                {children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
    },
    success: {
        backgroundColor: theme.colors.success,
    },
    warning: {
        backgroundColor: theme.colors.warning,
    },
    error: {
        backgroundColor: theme.colors.error,
    },
    info: {
        backgroundColor: theme.colors.info,
    },

    // Sizes
    size_sm: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    size_md: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },

    // Text
    text: {
        color: theme.colors.white,
        fontWeight: theme.typography.fontWeight.semibold,
    },
    text_sm: {
        fontSize: theme.typography.fontSize.xs,
    },
    text_md: {
        fontSize: theme.typography.fontSize.sm,
    },
});
