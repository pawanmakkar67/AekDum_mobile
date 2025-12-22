import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, StyleSheet, LayoutAnimation, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Mic, SlidersHorizontal, MoreHorizontal, Globe, MessageCircle, Bell, ShoppingCart, User, Play, Heart } from 'lucide-react-native';
import { RootStackParamList } from '../types/navigation';
import { useNotifications } from '../context/NotificationContext';
import { LiveBadge } from '../components/LiveBadge';

export const FavouriteScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const { unreadCount } = useNotifications();

    // Mock Data for Favourite Items
    const FAVOURITE_ITEMS = [
        {
            id: '1',
            name: 'Embroidered Red Kurta',
            price: '₹1100.00',
            seller: '@AnjaliFashion',
            sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
            image: 'https://images.unsplash.com/photo-1583391733958-e026b141d08e?w=500&auto=format&fit=crop&q=60',
            isLive: true
        },
        {
            id: '2',
            name: 'Oxidised Jhumkas',
            price: '₹1100.00',
            seller: '@DesiVibesFashion',
            sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
            image: 'https://images.unsplash.com/photo-1631730486782-0dd50cb25320?w=500&auto=format&fit=crop&q=60',
            isLive: false
        },
        {
            id: '3',
            name: 'Banarasi Silk Saree',
            price: '₹21000.00',
            seller: '@SareeQueen',
            sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
            image: 'https://images.unsplash.com/photo-1610189025006-2598379201e7?w=500&auto=format&fit=crop&q=60',
            isLive: true
        },
        {
            id: '4',
            name: 'Banjara Vintage Bag',
            price: '₹1200.00',
            seller: '@CraftIndia',
            sellerAvatar: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=100&auto=format&fit=crop&q=60',
            image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60',
            isLive: false
        },
        {
            id: '5',
            name: 'Glass Bangles Set',
            price: '₹21000.00',
            seller: '@JaipurGems',
            sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
            image: 'https://images.unsplash.com/photo-1626065586616-5682664d4205?w=500&auto=format&fit=crop&q=60',
            isLive: false
        },
        {
            id: '6',
            name: 'Leather Mojari',
            price: '₹1500.00',
            seller: '@RoyalSteps',
            sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
            image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&auto=format&fit=crop&q=60',
            isLive: true
        },
    ];

    const CATEGORY_TAGS = ['Sneakers', 'Jewellery', 'Accessories', 'Electronics'];

    const handleProductPress = (productId: string) => {
        // navigation.navigate('ProductDetail', { productId });
    };

    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 48) / 2;

    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearchFocus = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearchFocused(false);
    };

    const handleSearchCancel = () => {
        handleSearchBlur();
        setSearchQuery('');
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header with Search */}
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
                        <Search size={20} color="gray" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Your favourites Product"
                            placeholderTextColor="gray"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onFocus={handleSearchFocus}
                        />
                        {isSearchFocused ? (
                            <TouchableOpacity onPress={handleSearchCancel}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => {
                                Alert.alert('Voice Search', 'Listening...', [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Mock "Saree"', onPress: () => setSearchQuery('Saree') }
                                ]);
                            }}>
                                <Mic size={20} color="gray" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* {!isSearchFocused && (
                        <TouchableOpacity style={styles.filterButton}>
                            <SlidersHorizontal size={20} color="black" />
                        </TouchableOpacity>
                    )} */}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Browse by Category Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MoreHorizontal size={24} color="black" style={styles.sectionIcon} />
                        <Text style={styles.sectionTitle}>Browse by Category</Text>
                    </View>

                    <View style={styles.gridContainer}>
                        {FAVOURITE_ITEMS.filter(item =>
                            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.seller.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.gridItem, { width: itemWidth }]}
                                onPress={() => {
                                    if (item.isLive) {
                                        navigation.navigate('LiveStream', { streamId: item.id });
                                    } else {
                                        handleProductPress(item.id);
                                    }
                                }}
                            >
                                <View style={[styles.imageContainer, { height: itemWidth * 1.5 }]}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.gridImage}
                                        resizeMode="cover"
                                    />

                                    {/* Live Badge */}
                                    {item.isLive && (
                                        <LiveBadge style={{ position: 'absolute', top: 12, left: 12 }} />
                                    )}

                                    {/* Heart Icon Badge */}
                                    <TouchableOpacity style={styles.heartBadge}>
                                        <Heart size={14} color="#9333ea" fill="#9333ea" />
                                    </TouchableOpacity>
                                </View>

                                {/* Bottom Details */}
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemTitle} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.itemPrice}>{item.price}</Text>

                                    <View style={styles.sellerRow}>
                                        <Image
                                            source={{ uri: item.sellerAvatar }}
                                            style={styles.sellerAvatar}
                                        />
                                        <Text style={styles.sellerName}>{item.seller}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Category Tags */}
            <View style={styles.bottomFilters}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                    {CATEGORY_TAGS.map((tag, index) => (
                        <TouchableOpacity key={index} style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
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
    scrollContent: {
        paddingBottom: 0,
    },
    sectionContainer: {
        paddingHorizontal: 16,
        marginBottom: 16, // Reduced margin
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
        marginBottom: 24,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 16, // Slightly less rounded than category chips
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#f3f4f6',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },

    heartBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'white', // White circle background
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemDetails: {
        paddingHorizontal: 4,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#9333ea', // Primary Purple
        marginBottom: 8,
    },
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 6,
        backgroundColor: '#e5e7eb',
    },
    sellerName: {
        fontSize: 12,
        color: '#4b5563',
        fontWeight: '500',
    },
    tagsContainer: {
        marginTop: 0,
        paddingVertical: 12,
    },
    tagsScroll: {
        paddingHorizontal: 16,
    },
    categoryTag: {
        backgroundColor: '#f3f4f6', // Light gray background
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
        marginRight: 12,
    },
    categoryTagText: {
        color: '#6b7280', // Gray text
        fontSize: 14,
        fontWeight: '600',
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
