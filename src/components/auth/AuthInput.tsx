import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, TextInputProps, StyleSheet } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface AuthInputProps extends TextInputProps {
    icon?: React.ReactNode;
    isPassword?: boolean;
}

export const AuthInput = ({ icon, isPassword = false, ...props }: AuthInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholderTextColor={colors.gray[400]}
                secureTextEntry={isPassword && !showPassword}
                autoCapitalize="none"
                {...props}
            />

            {/* Right Icon/Action */}
            {isPassword ? (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                        <EyeOff color="#64748b" size={20} />
                    ) : (
                        <Eye color="#64748b" size={20} />
                    )}
                </TouchableOpacity>
            ) : (
                icon
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.gray[300],
        borderWidth: 1,
        borderRadius: 9999, // Pill shape
        paddingHorizontal: 16,
        paddingVertical: 12, // Reduced slightly to match standard height visually
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text.primary,
        marginRight: 8,
    }
});
