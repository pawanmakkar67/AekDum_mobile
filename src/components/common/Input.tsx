import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    size = 'md',
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={containerStyle}>
            {label && (
                <Text variant="label" style={styles.label}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.base,
                    styles[`size_${size}`],
                    error && styles.error,
                    style,
                ]}
                placeholderTextColor={theme.colors.text.tertiary}
                {...props}
            />
            {error && (
                <Text variant="caption" color={theme.colors.error} style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        marginBottom: theme.spacing.sm,
    },
    base: {
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.dark,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
    },
    size_sm: {
        height: theme.sizes.input.sm,
    },
    size_md: {
        height: theme.sizes.input.md,
    },
    size_lg: {
        height: theme.sizes.input.lg,
    },
    error: {
        borderColor: theme.colors.error,
    },
    errorText: {
        marginTop: theme.spacing.xs,
    },
});
