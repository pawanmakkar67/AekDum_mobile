import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';

interface TopSellerCardProps {
    seller: {
        id: string;
        name: string;
        image: string;
    };
    onPress?: () => void;
    style?: any;
}

export const TopSellerCard = ({ seller, onPress, style }: TopSellerCardProps) => {
    const [imageError, setImageError] = useState(false);

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
            <View style={[styles.imageContainer, imageError && styles.imageError]}>
                {imageError ? (
                    <User size={32} color="#9ca3af" />
                ) : (
                    <Image
                        source={{ uri: seller.image }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                )}
            </View>
            <Text style={styles.name} numberOfLines={1}>
                {seller.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 16,
        alignItems: 'center',
    },
    imageContainer: {
        width: 64, // w-16
        height: 64, // h-16
        borderRadius: 32,
        padding: 2,
        borderColor: '#fb923c', // orange-400
        borderWidth: 2,
        overflow: 'hidden', // Ensure styling respects border radius
    },
    imageError: {
        backgroundColor: '#f3f4f6', // gray-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    name: {
        fontSize: 12, // text-xs
        textAlign: 'center',
        marginTop: 4,
        fontWeight: '500', // font-medium
        color: '#1f2937', // gray-800
    },
});
