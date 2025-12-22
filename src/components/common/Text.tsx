import React from 'react';
import { Text as RNText, StyleSheet, TextProps as RNTextProps, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface TextProps extends RNTextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'caption' | 'label';
    color?: string;
    weight?: keyof typeof theme.typography.fontWeight;
    align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<TextProps> = ({
    variant = 'body',
    color,
    weight,
    align,
    style,
    ...props
}) => {
    return (
        <RNText
            style={[
                styles[variant],
                color && { color },
                weight && { fontWeight: theme.typography.fontWeight[weight] },
                align && { textAlign: align },
                style,
            ]}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: theme.typography.fontSize['4xl'],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
        color: theme.colors.text.primary,
    },
    h2: {
        fontSize: theme.typography.fontSize['3xl'],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
        color: theme.colors.text.primary,
    },
    h3: {
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight,
        color: theme.colors.text.primary,
    },
    body: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
        color: theme.colors.text.primary,
    },
    bodyLarge: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
        color: theme.colors.text.primary,
    },
    caption: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
        color: theme.colors.text.secondary,
    },
    label: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.semibold,
        textTransform: 'uppercase',
        letterSpacing: theme.typography.letterSpacing.wide,
        color: theme.colors.text.secondary,
    },
});
