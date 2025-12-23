import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { Header } from '../components/Header';
import { LiveStreamCard } from '../components/LiveStreamCard';
import { TopSellerCard } from '../components/TopSellerCard';
import { FutureShoppingCard } from '../components/FutureShoppingCard';
import { AuctionCard } from '../components/AuctionCard';
import { LIVE_STREAMS, CATEGORIES, TOP_SELLERS, FUTURE_STREAMS, PRODUCTS } from '../data/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

type HomeScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>('For You');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleStreamPress = (streamId: string) => {
        navigation.navigate('LiveStream', { streamId });
    };

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    // Create category options with "For You" as first
    const categoryOptions = [
        {
            id: 'all',
            name: t('home.categories.all'),
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60'
        },
        ...CATEGORIES
    ];

    // Filter streams based on selected category and search query
    const getFilteredStreams = () => {
        let streams = selectedCategory === t('home.categories.all') || selectedCategory === 'For You'
            ? LIVE_STREAMS
            : LIVE_STREAMS.filter(stream => stream.category === selectedCategory);

        // Apply search filter if query exists
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            streams = streams.filter(stream =>
                stream.title.toLowerCase().includes(query) ||
                stream.streamer.toLowerCase().includes(query) ||
                stream.category.toLowerCase().includes(query)
            );
        }

        return streams;
    };

    const filteredStreams = getFilteredStreams();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Header
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                placeholder={t('home.searchPlaceholder')}
                onProfilePress={() => navigation.navigate('Profile')}
            />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Live Shopping Section */}
                <View style={styles.sectionHeaderContainer}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Live Shopping</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('LiveShoppingList')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                        {filteredStreams.map((stream) => (
                            <LiveStreamCard
                                key={stream.id}
                                stream={stream}
                                onPress={() => handleStreamPress(stream.id)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Top Sellers Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Top Sellers</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('TopSellersList')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                        {TOP_SELLERS.map((seller) => (
                            <TopSellerCard
                                key={seller.id}
                                seller={seller}
                                onPress={() => { }}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Future Shopping Section */}
                <View style={[styles.sectionContainer, styles.paddingHorizontal]}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Future Shopping</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('FutureShoppingList')}>
                            <Text style={styles.viewAllText}>Calendar</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {FUTURE_STREAMS.map((item) => (
                            <FutureShoppingCard
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </View>
                </View>

                {/* Recommend Auctions Section */}
                <View style={[styles.sectionContainer, styles.paddingHorizontal]}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Recommend Auctions</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('AuctionsList')}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gridContainer}>
                        {PRODUCTS.filter(p => p.isAuction).slice(0, 4).map((product) => (
                            <AuctionCard
                                key={product.id}
                                product={product}
                                onPress={() => navigation.navigate('LiveStream', { streamId: product.id })}
                                onBidPress={() => navigation.navigate('LiveStream', { streamId: product.id })}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Category Filter Pills (Bottom) */}
            <View style={styles.bottomFilters}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.paddingHorizontal}
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    {categoryOptions.map((category) => {
                        const isSelected = selectedCategory === category.name;
                        return (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => setSelectedCategory(category.name)}
                                style={[
                                    styles.categoryPill,
                                    isSelected ? styles.categoryPillSelected : styles.categoryPillUnselected
                                ]}
                            >
                                <Text style={[
                                    styles.categoryPillText,
                                    isSelected ? styles.categoryPillTextSelected : styles.categoryPillTextUnselected
                                ]}>
                                    {category.name === 'all' ? t('home.categories.all') : category.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionHeaderContainer: {
        marginTop: 16,
    },
    sectionContainer: {
        marginTop: 32,
    },
    paddingHorizontal: {
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12, // mb-3 / mb-4 varied, unifying to 12
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18, // text-lg
        fontWeight: 'bold',
        color: '#111827', // gray-900
        marginRight: 8,
    },
    viewAllText: {
        fontSize: 14, // text-sm
        color: '#9333ea', // purple-600
        fontWeight: 'bold',
    },
    horizontalScrollContent: {
        paddingHorizontal: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categorySection: {
        marginTop: 12, // mt-6
        marginBottom: 12, // mb-8
    },
    categoryPill: {
        marginRight: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
        borderWidth: 1,
    },
    categoryPillSelected: {
        backgroundColor: '#9333ea', // purple-600
        borderColor: '#9333ea',
    },
    categoryPillUnselected: {
        backgroundColor: 'white',
        borderColor: '#e5e7eb', // gray-200
    },
    categoryPillText: {
        fontWeight: '500', // font-medium
    },
    categoryPillTextSelected: {
        color: 'white',
    },
    categoryPillTextUnselected: {
        color: '#4b5563', // gray-600
    },
    bottomFilters: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        backgroundColor: 'white',
        paddingHorizontal: 8,
    },
});
