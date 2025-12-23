import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { FutureShoppingCard } from '../components/FutureShoppingCard';
import { FUTURE_STREAMS } from '../data/mockData';
import { ArrowLeft } from 'lucide-react-native';

type FutureShoppingListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FutureShoppingList'>;

export const FutureShoppingListScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<FutureShoppingListScreenNavigationProp>();

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Future Shopping</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {renderHeader()}
            <FlatList
                data={FUTURE_STREAMS}
                renderItem={({ item }) => (
                    <FutureShoppingCard
                        item={item}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
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
    }
});
