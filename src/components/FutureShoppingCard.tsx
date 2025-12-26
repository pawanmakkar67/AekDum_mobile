import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Bell, ImageOff } from 'lucide-react-native';

interface FutureShoppingCardProps {
    item: {
        id: string;
        title: string;
        host: string;
        time: string;
        image: string;
    };
    onPress?: () => void;
}

export const FutureShoppingCard = ({ item, onPress }: FutureShoppingCardProps) => {
    const [isNotified, setIsNotified] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleNotify = () => {
        setIsNotified(!isNotified);
        if (!isNotified) {
            Alert.alert('Reminder Set', `We will notify you when ${item.host} goes live!`);
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >
            {imageError ? (
                <View style={[styles.image, styles.imageError]}>
                    <ImageOff size={24} color="#9ca3af" />
                </View>
            ) : (
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    onError={() => setImageError(true)}
                />
            )}
            <View style={styles.content}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.title} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.host}>Hosted by {item.host}</Text>
            </View>
            <TouchableOpacity
                onPress={handleNotify}
                style={[styles.bellContainer, isNotified ? styles.bellActive : styles.bellInactive]}
            >
                <Bell size={18} color={isNotified ? '#9333ea' : '#6b7280'} fill={isNotified ? '#9333ea' : 'none'} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 24, // rounded-3xl approx
        borderColor: '#f3f4f6', // gray-100
        borderWidth: 1,
        marginBottom: 12,
        // shadow-sm
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: 56, // w-14
        height: 56, // h-14
        borderRadius: 28, // rounded-full
        marginRight: 12,
    },
    imageError: {
        backgroundColor: '#f3f4f6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    time: {
        color: '#9333ea', // purple-600
        fontWeight: 'bold',
        fontSize: 12, // text-xs
        marginBottom: 2,
    },
    title: {
        fontSize: 14, // text-sm
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginBottom: 2,
    },
    host: {
        fontSize: 12, // text-xs
        color: '#6b7280', // gray-500
    },
    bellContainer: {
        padding: 8,
        borderRadius: 9999, // rounded-full
    },
    bellActive: {
        backgroundColor: '#f3e8ff', // purple-100
    },
    bellInactive: {
        backgroundColor: '#f3f4f6', // gray-100
    },
});
