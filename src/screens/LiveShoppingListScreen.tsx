import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LiveStreamCard } from '../components/LiveStreamCard';
import { LIVE_STREAMS } from '../data/mockData';
import { Header } from '../components/Header';
import { useTranslation } from '../hooks/useTranslation';
// Implementing a simple back header for now as it's a detail screen, but maybe we want the main header?
// The prompt says "details screen with specific designs".
// Usually "View All" screens have a back button title.
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity, Text } from 'react-native';

type LiveShoppingListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LiveShoppingList'>;

export const LiveShoppingListScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<LiveShoppingListScreenNavigationProp>();
    const { t } = useTranslation();

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('profile.liveShopping')}</Text>
            <View style={{ width: 24 }} />
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {renderHeader()}
            <FlatList
                data={LIVE_STREAMS}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <LiveStreamCard
                            stream={item}
                            onPress={() => navigation.navigate('LiveStream', { streamId: item.id })}
                            style={{ marginRight: 0 }}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                numColumns={2}
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
    itemContainer: {
        marginBottom: 16,
        width: '48%',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center', // Center the card in the column
    },
    columnWrapper: {
        justifyContent: 'space-between',
    }
});
