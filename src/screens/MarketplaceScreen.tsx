import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, StyleSheet, LayoutAnimation, Platform, UIManager, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Mic, SlidersHorizontal, MoreHorizontal, Globe, MessageCircle, Bell, ShoppingCart, User, Play, Eye, ChevronDown, Check } from 'lucide-react-native';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { RootStackParamList } from '../types/navigation';
import { useNotifications } from '../context/NotificationContext';
import { LiveBadge } from '../components/LiveBadge';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export const MarketplaceScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const { unreadCount } = useNotifications();

    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearchFocus = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearchFocused(true);
    };

    const handleSearchCancel = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearchFocused(false);
        setSearchQuery('');
        Keyboard.dismiss();
    };

    // Data for the 2-column grid
    const CATEGORY_GRID_DATA = [
        {
            id: '1',
            name: 'Card Games',
            watching: '1262 Watching',
            image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=500&auto=format&fit=crop&q=60', // playing cards
        },
        {
            id: '2',
            name: 'Rocks & Crystals',
            watching: '845 Watching',
            image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&auto=format&fit=crop&q=60', // crystals
        },
        {
            id: '3',
            name: 'Jewellery',
            watching: '2.1k Watching',
            image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&auto=format&fit=crop&q=60', // jewelry close-up
        },
        {
            id: '4',
            name: 'Sporting Goods',
            watching: '533 Watching',
            image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=60', // sports equipment
        },
        {
            id: '5',
            name: 'Womens Fashion',
            watching: '3.4k Watching',
            image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=500&auto=format&fit=crop&q=60', // women fashion
        },
        {
            id: '6',
            name: 'Mens Fashion',
            watching: '1.2k Watching',
            image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=500&auto=format&fit=crop&q=60', // men fashion
        },
        {
            id: '7',
            name: 'Electronics',
            watching: '920 Watching',
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60', // electronics devices
        },
        {
            id: '8',
            name: 'Toys',
            watching: '450 Watching',
            image: 'https://images.unsplash.com/photo-1615486363973-f79d875780cf?w=500&auto=format&fit=crop&q=60', // toys
        },
    ]

    const FILTER_OPTIONS = [
        { label: t('profile.filters.all'), value: 'All' },
        { label: t('profile.filters.liveNow'), value: 'Live Now' },
        { label: t('profile.filters.auctions'), value: 'Auctions' },
        { label: t('profile.filters.buyItNow'), value: 'Buy It Now' },
        { label: t('profile.filters.endingSoon'), value: 'Ending Soon' },
        { label: t('profile.filters.newest'), value: 'Newest' },
    ];

    const handleProductPress = (productId: string) => {
        navigation.navigate('ProductDetail', { productId });
    };

    const toggleFilters = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsFilterExpanded(!isFilterExpanded);
    };

    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 48) / 2; // 2 columns with padding (16px * 3 gaps approx)

    return (
        <SafeAreaView style={styles.container} edges={['top']}>

            {/* Header with Search */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
                        <Search size={20} color="gray" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('favourite.searchPlaceholder')}
                            placeholderTextColor="gray"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={handleSearchFocus}
                        />
                        {isSearchFocused ? (
                            <TouchableOpacity onPress={handleSearchCancel}>
                                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                Alert.alert(t('profile.voiceSearchTitle'), t('profile.voiceSearchBody'), [
                                    { text: t('common.cancel'), style: 'cancel' },
                                    { text: t('profile.mockGames'), onPress: () => setSearchQuery('Games') }
                                ]);
                            }}>
                                <Mic size={20} color="gray" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {!isSearchFocused && (
                        <TouchableOpacity
                            style={[styles.filterButton, isFilterExpanded && styles.filterButtonActive]}
                            onPress={toggleFilters}
                        >
                            <SlidersHorizontal size={20} color={isFilterExpanded ? "white" : "black"} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Expandable Filter Section */}
                {isFilterExpanded && (
                    <View style={styles.filterSection}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                            {FILTER_OPTIONS.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[styles.filterChip, selectedFilter === option.value && styles.filterChipActive]}
                                    onPress={() => setSelectedFilter(option.value)}
                                >
                                    {selectedFilter === option.value && <Check size={14} color="white" style={styles.checkIcon} />}
                                    <Text style={[styles.filterChipText, selectedFilter === option.value && styles.filterChipTextActive]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Browse by Category Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MoreHorizontal size={24} color="black" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>{t('profile.browseCategory')}</Text>
                    </View>

                    <View style={styles.gridContainer}>
                        {CATEGORY_GRID_DATA.filter(item =>
                            item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.gridItem, { width: itemWidth, height: itemWidth * 1.3 }]}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.gridImage}
                                    resizeMode="cover"
                                />
                                {/* Overlay Gradient/Dim */}
                                <View style={styles.overlay} />

                                {/* Live Badge */}
                                <LiveBadge style={{ position: 'absolute', top: 12, left: 12 }} />

                                {/* Bottom Text */}
                                <View style={styles.gridItemContent}>
                                    <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
                                    <View style={styles.watchingContainer}>
                                        <Eye size={12} color="white" style={styles.eyeIcon} />
                                        <Text style={styles.watchingText}>{item.watching}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Curated For You Section */}
                <View style={styles.curatedSection}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>{t('profile.curatedForYou')}</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAllText}>{t('profile.viewAll')}</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalListContent}
                    >
                        {PRODUCTS.filter(product =>
                            product.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ).slice(0, 5).map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                onPress={() => handleProductPress(product.id)}
                            >
                                <Image
                                    source={{ uri: product.image }}
                                    style={styles.productImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlayWeak} />

                                <View style={styles.exclusiveBadge}>
                                    <Text style={styles.exclusiveText}>{t('profile.exclusive')}</Text>
                                </View>

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                                    <Text style={styles.productTime}>{t('profile.startingIn', { time: '20m' })}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topIconsContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
        marginBottom: 8,
    },
    bellButton: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ef4444',
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    headerContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
    },
    searchBarFocused: {
        marginRight: 0,
    },
    cancelText: {
        color: '#9333ea',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1f2937',
    },
    filterButton: {
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 9999,
    },
    filterButtonActive: {
        backgroundColor: '#1f2937', // Active dark state
    },
    filterSection: {
        marginTop: 12,
        flexDirection: 'row',
    },
    filterScroll: {
        paddingRight: 16,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    filterChipActive: {
        backgroundColor: '#1f2937',
        borderColor: '#1f2937',
    },
    filterChipText: {
        color: '#1f2937',
        fontSize: 14,
        fontWeight: '600',
    },
    filterChipTextActive: {
        color: 'white',
    },
    checkIcon: {
        marginRight: 4,
    },
    scrollContent: {
        paddingBottom: 20,
        paddingTop: 8,
    },
    sectionContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    overlayWeak: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    gridItemContent: {
        position: 'absolute',
        bottom: 16,
        left: 12,
    },
    categoryName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    watchingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIcon: {
        marginRight: 4,
    },
    watchingText: {
        color: 'white',
        fontSize: 12,
    },
    curatedSection: {
        marginTop: 8,
    },
    sectionHeaderRow: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    viewAllText: {
        color: '#9333ea',
        fontWeight: 'bold',
        fontSize: 14,
    },
    horizontalListContent: {
        paddingHorizontal: 16,
    },
    productCard: {
        marginRight: 16,
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        width: 160,
        height: 200,
        marginBottom: 8,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    exclusiveBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    exclusiveText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    productName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    productTime: {
        color: '#e5e7eb',
        fontSize: 12,
    },
});
