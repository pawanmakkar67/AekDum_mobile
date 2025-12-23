import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TopSellerCard } from '../components/TopSellerCard';
import { TOP_SELLERS } from '../data/mockData';
import { ArrowLeft } from 'lucide-react-native';

type TopSellersListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopSellersList'>;

export const TopSellersListScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<TopSellersListScreenNavigationProp>();

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Top Sellers</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {renderHeader()}
            <FlatList
                data={TOP_SELLERS}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <TopSellerCard
                            seller={item}
                        // onPress={() => navigation.navigate('SellerProfile', { sellerId: item.id })} // Assuming SellerProfile exists or will exist. The mock calls it empty for now in HomeScreen.
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
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
        justifyContent: 'space-between', // Or 'flex-start' with gap if we want consistent spacing
        gap: 16,
    },
    itemContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 24,
    }
});
