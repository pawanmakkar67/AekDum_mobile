import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Video } from 'lucide-react-native';

interface LiveBadgeProps {
    style?: ViewStyle;
}

import { useTranslation } from '../hooks/useTranslation';

export const LiveBadge = ({ style }: LiveBadgeProps) => {
    const { t } = useTranslation();
    return (
        <View style={[styles.container, style]}>
            <Video size={12} color="white" />
            <Text style={styles.text}>{t('live.badge')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9333ea', // purple-600
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    text: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
});
