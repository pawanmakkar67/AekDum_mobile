import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { AuctionCard } from '../components/AuctionCard';
import { PRODUCTS } from '../data/mockData';
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from '../hooks/useTranslation';

type AuctionsListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuctionsList'>;

export const AuctionsListScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<AuctionsListScreenNavigationProp>();
    const { t } = useTranslation();

    // Filter only auction items
    const auctionItems = PRODUCTS.filter(p => p.isAuction);

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('navigation.auctions')}</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {renderHeader()}
            <FlatList
                data={auctionItems}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <AuctionCard
                            product={item}
                            onPress={() => navigation.navigate('LiveStream', { streamId: item.id })}
                            onBidPress={() => navigation.navigate('LiveStream', { streamId: item.id })}
                            style={{ width: '100%', marginBottom: 16 }}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContent: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    itemContainer: {
        width: '48%', // Ensure it takes up roughly half the space minus spacing
    }
});
