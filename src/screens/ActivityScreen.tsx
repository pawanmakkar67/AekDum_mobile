import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ticket, Video, Clock, ChevronUp, Check, Play } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LiveBadge } from '../components/LiveBadge';
import { Header } from '../components/Header';
import { useTranslation } from '../hooks/useTranslation';

const MOCK_ACTIVITY = [
    {
        id: '1',
        type: 'live_bid',
        title: 'Embroidered Silk Kurta Set',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&auto=format&fit=crop&q=60',
        yourBid: '1600.00',
        currentBid: '1800.00',
        nextBid: '1900.00',
        seller: 'Ananya_Style',
        sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        timeLeft: '2m',
        status: 'live'
    },
    {
        id: '2',
        type: 'winning',
        title: "Men's Silk Kurta",
        image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=500&auto=format&fit=crop&q=60',
        yourBid: '1600.00',
        saveAmount: '300.00',
        soldFor: '1,600.00',
        seller: 'Ananya_Style',
        sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        orderTime: '5m',
        status: 'winning'
    },
    {
        id: '3',
        type: 'outbid',
        title: 'Hand Painted Saree',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60',
        yourBid: '5,600',
        soldFor: '5,850.00',
        seller: 'Ananya_Style',
        sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        endedTime: '5m ago',
        status: 'outbid'
    },
    {
        id: '4',
        type: 'live_notification',
        seller: 'DesiTrends',
        sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        subtitle: 'Showcasing wedding special...',
    },
    {
        id: '5',
        type: 'payment_success',
        title: 'Payment Successful',
        subtitle: 'For Order #AD99234 . ₹1,200.00',
        time: '2h Ago'
    },
    {
        id: '6',
        type: 'delivered',
        title: 'Oxidized Silver Jhumkas',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&auto=format&fit=crop&q=60',
        paid: '850.00',
        save: '250.00',
        status: 'DELIVERED YESTERDAY'
    }
];

const FILTER_TABS = ['all', 'buying', 'selling', 'liveBids'];

export const ActivityScreen = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const renderCard = (item: any) => {
        switch (item.type) {
            case 'live_bid':
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.cardInfo}>
                                <LiveBadge style={{ alignSelf: 'flex-start', marginBottom: 4 }} />
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.bidText}>{t('activity.yourBid')} <Text style={styles.purpleText}>₹{item.yourBid}</Text></Text>
                                <View style={styles.sellerRow}>
                                    <Image source={{ uri: item.sellerAvatar }} style={styles.avatarSmall} />
                                    <Text style={styles.sellerName}>{item.seller}</Text>
                                    <View style={styles.dotSeparator} />
                                    <Clock size={12} color="#9ca3af" />
                                    <Text style={styles.timeText}>{t('activity.endsBidIn')} <Text style={{ color: '#22c55e' }}>{item.timeLeft}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.cardFooter}>
                            <Text style={styles.footerLabel}>{t('activity.currentBid')} <Text style={styles.redText}>₹{item.currentBid}</Text></Text>
                            <TouchableOpacity style={styles.bidButton}>
                                <Text style={styles.bidButtonText}>{t('activity.bid')} ₹{item.nextBid}</Text>
                                <ChevronUp size={14} color="white" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 'winning':
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.cardInfo}>
                                <Text style={styles.winningText}>{t('activity.winning')}</Text>
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.bidText}>{t('activity.yourBid')} <Text style={styles.purpleText}>₹{item.yourBid}</Text> <Text style={styles.grayText}>{t('activity.save', { amount: item.saveAmount })}</Text></Text>
                                <View style={styles.sellerRow}>
                                    <Image source={{ uri: item.sellerAvatar }} style={styles.avatarSmall} />
                                    <Text style={styles.sellerName}>{item.seller}</Text>
                                    <View style={styles.dotSeparator} />
                                    <Clock size={12} color="#9ca3af" />
                                    <Text style={[styles.timeText, { color: '#d946ef' }]}>{t('activity.orderWithin', { time: item.orderTime })}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.cardFooter}>
                            <Text style={styles.footerLabel}>{t('activity.soldFor')} <Text style={styles.redText}>₹{item.soldFor}</Text></Text>
                            <TouchableOpacity style={styles.outlineButton}>
                                <Text style={styles.outlineButtonText}>{t('activity.order')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 'outbid':
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.cardInfo}>
                                <Text style={[styles.title, { marginTop: 2 }]} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.bidText}>{t('activity.yourBid')} ₹{item.yourBid}</Text>
                                <View style={[styles.sellerRow, { marginTop: 8 }]}>
                                    <Image source={{ uri: item.sellerAvatar }} style={styles.avatarSmall} />
                                    <Text style={styles.sellerName}>{item.seller}</Text>
                                    <View style={styles.dotSeparator} />
                                    <Clock size={12} color="#9ca3af" />
                                    <Text style={styles.timeText}>{t('activity.endedBid', { time: item.endedTime })}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.cardFooter}>
                            <Text style={styles.footerLabel}>{t('activity.soldFor')} <Text style={styles.redText}>₹{item.soldFor}</Text></Text>
                            <TouchableOpacity style={[styles.outlineButton, { borderColor: '#e5e7eb' }]}>
                                <Text style={[styles.outlineButtonText, { color: '#9ca3af' }]}>{t('activity.outbid')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 'live_notification':
                return (
                    <View key={item.id} style={styles.notificationCard}>
                        <Image source={{ uri: item.sellerAvatar }} style={styles.notificationAvatar} />
                        <View style={styles.notificationInfo}>
                            <Text style={styles.notificationTitle}>{item.seller} <Text style={{ fontWeight: '400' }}>{t('activity.isLiveNow')}</Text></Text>
                            <Text style={styles.notificationSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                        </View>
                        <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>{t('activity.join')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'payment_success':
                return (
                    <View key={item.id} style={styles.notificationCard}>
                        <View style={styles.successIconBg}>
                            <Check size={16} color="white" strokeWidth={3} />
                        </View>
                        <View style={styles.notificationInfo}>
                            <Text style={styles.notificationTitle}>{item.title}</Text>
                            <Text style={styles.notificationSubtitle}>{item.subtitle}</Text>
                        </View>
                        <Text style={styles.timeAgo}>{item.time}</Text>
                    </View>
                );

            case 'delivered':
                return (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.cardInfo}>
                                <Text style={styles.deliveredText}>{t('activity.delivered')}</Text>
                                <Text style={[styles.title, { fontSize: 16 }]}>{item.title}</Text>
                                <Text style={styles.bidText}>{t('activity.paid')} <Text style={styles.blackBold}>₹{item.paid}</Text> <Text style={styles.grayText}>{t('activity.save', { amount: item.save })}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.fullWidthButton}>
                            <Text style={styles.fullWidthButtonText}>{t('activity.leaveReview')}</Text>
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <Header
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                placeholder={t('home.searchPlaceholder')}
                onProfilePress={() => navigation.navigate('Profile')}
            />
            {/* Header Title Section */}
            <View style={styles.header}>
                <Ticket size={24} color="#374151" />
                <Text style={styles.headerTitle}>{t('navigation.activity')}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {MOCK_ACTIVITY.map(item => renderCard(item))}
                {/* Duplicate notifications to fill space like design */}
                {renderCard({ ...MOCK_ACTIVITY[3], id: '7' })}
                {renderCard({ ...MOCK_ACTIVITY[3], id: '8', seller: 'Women\'s Fashion', subtitle: 'Showcasing Fashion' })}
            </ScrollView>

            {/* Bottom Filters */}
            <View style={styles.bottomFilters}>
                {FILTER_TABS.map((tab, index) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setSelectedFilter(tab)}
                        style={[styles.filterPill, selectedFilter === tab ? styles.filterPillActive : styles.filterPillInactive]}
                    >
                        <Text style={[styles.filterText, selectedFilter === tab ? styles.filterTextActive : styles.filterTextInactive]}>
                            {t(`activity.tabs.${tab}` as any)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    // Common Card Styles
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#e5e7eb', // gray-200
        marginBottom: 16,
        overflow: 'hidden',
        padding: 16,
    },
    cardContent: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    // Live Badge

    // Typography
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    bidText: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    purpleText: {
        color: '#d946ef',
        fontWeight: 'bold',
    },
    redText: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
    blackBold: {
        color: '#1f2937',
        fontWeight: 'bold',
    },
    grayText: {
        color: '#9ca3af',
    },
    winningText: {
        color: '#22c55e', // green-500
        fontWeight: 'bold',
        fontSize: 10,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    deliveredText: {
        color: '#9ca3af',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    // Seller Row
    sellerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarSmall: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
    },
    sellerName: {
        fontSize: 11,
        color: '#4b5563',
        fontWeight: '500',
    },
    dotSeparator: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#d1d5db',
        marginHorizontal: 6,
    },
    timeText: {
        fontSize: 11,
        color: '#6b7280',
        marginLeft: 4,
    },
    // Footer & Actions
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginHorizontal: -16,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLabel: {
        fontSize: 12,
        color: '#4b5563',
        fontWeight: '500',
    },
    bidButton: {
        backgroundColor: '#d946ef',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 9999,
    },
    bidButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderRadius: 9999,
    },
    outlineButtonText: {
        color: '#4b5563',
        fontWeight: '600',
        fontSize: 12,
    },
    fullWidthButton: {
        backgroundColor: '#f9fafb',
        paddingVertical: 10,
        borderRadius: 9999,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    fullWidthButtonText: {
        color: '#4b5563',
        fontWeight: 'bold',
        fontSize: 12,
    },
    // Notifications
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 12,
    },
    notificationAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    notificationInfo: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    notificationSubtitle: {
        fontSize: 12,
        color: '#ab0ce8', // purple-500
    },
    joinButton: {
        borderWidth: 1,
        borderColor: '#d946ef',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 9999,
    },
    joinButtonText: {
        color: '#d946ef',
        fontWeight: 'bold',
        fontSize: 12,
    },
    successIconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#22c55e', // green-500
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    timeAgo: {
        fontSize: 11,
        color: '#9ca3af',
        marginLeft: 8,
    },
    // Bottom Filters
    bottomFilters: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        backgroundColor: 'white',
        paddingHorizontal: 8,
    },
    filterPill: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 9999,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    filterPillActive: {
        backgroundColor: '#d946ef',
        borderColor: '#d946ef',
    },
    filterPillInactive: {
        backgroundColor: '#f3f4f6',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
    },
    filterTextActive: {
        color: 'white',
    },
    filterTextInactive: {
        color: '#6b7280',
    }
});
