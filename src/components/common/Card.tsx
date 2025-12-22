import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'filled';
    padding?: keyof typeof theme.spacing;
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    padding = 'md',
    style,
}) => {
    return (
        <View
            style={[
                styles.base,
                styles[variant],
                { padding: theme.spacing[padding] },
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background.primary,
    },
    elevated: {
        ...theme.shadows.md,
    },
    outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border.dark,
    },
    filled: {
        backgroundColor: theme.colors.background.secondary,
    },
});
