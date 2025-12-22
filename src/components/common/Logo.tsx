import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const Logo = () => {
    return (
        <View style={styles.logoWrapper}>
            <View style={styles.logoBox}>
                <View style={styles.logoAccent} />
                <View style={styles.logoTextContainer}>
                    <Text style={styles.logoText}>AEK</Text>
                    <Text style={styles.logoText}>DUM</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logoWrapper: {
        backgroundColor: colors.white,
        padding: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoBox: {
        borderWidth: 2,
        borderColor: colors.black,
        padding: 4,
        borderRadius: 4,
        width: 64,
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFBEB', // yellow-50
        position: 'relative',
        overflow: 'hidden',
    },
    logoAccent: {
        position: 'absolute',
        left: 4,
        top: 8,
        width: 12,
        height: 32,
        backgroundColor: '#FACC15', // yellow-400
        borderRadius: 2,
        zIndex: 0,
        transform: [{ rotate: '-12deg' }],
    },
    logoTextContainer: {
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1.5,
        color: colors.black,
        lineHeight: 14,
    },
});
