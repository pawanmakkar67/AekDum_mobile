import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCircle, Monitor, LogIn, ShoppingBag, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

export const RewardsScreen = () => {
    const { t } = useTranslation();
    const REDEEM_ITEMS = [
        { id: '1', title: '₹100 off Kurti', cost: '500 pts', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&auto=format&fit=crop&q=60' },
        { id: '2', title: 'Free Shipping', cost: '200 pts', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop&q=60' },
        { id: '3', title: '₹100 off Kurti', cost: '500 pts', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&auto=format&fit=crop&q=60' }, // Duplicate for grid demo
        { id: '4', title: 'Free Shipping', cost: '200 pts', image: 'https://images.unsplash.com/photo-1556742046-806e8ac23cc6?w=500&auto=format&fit=crop&q=60' },
    ];

    const FILTER_TABS = [t('activity.tabs.all'), t('activity.tabs.buying'), t('activity.tabs.selling'), t('activity.tabs.liveBids')];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <UserCircle size={24} color="#374151" />
                <Text style={styles.headerTitle}>{t('live.rewards.title')}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Hero Balance Card */}
                <View style={styles.heroCard}>
                    <Text style={styles.balanceLabel}>{t('live.rewards.availableBalance')}</Text>
                    <Text style={styles.balanceValue}>2,450</Text>

                    <View style={styles.valueBadge}>
                        <Text style={styles.valueText}>{t('common.currency')}850.00 {t('live.rewards.value')}</Text>
                    </View>

                    <View style={styles.tierInfoRow}>
                        <Text style={styles.tierTextLeft}>{t('live.rewards.goldTier')}</Text>
                        <Text style={styles.tierTextRight}>550 {t('live.rewards.ptsToPlatinum')}</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={['#c026d3', '#db2777']} // Purple to Pink gradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: '75%' }]}
                        />
                    </View>
                </View>

                {/* Ways to Earn */}
                <Text style={styles.sectionTitle}>{t('live.rewards.waysToEarn')}</Text>
                <View style={styles.earnRow}>
                    <TouchableOpacity style={styles.earnCard}>
                        <View style={[styles.earnIconBg, { backgroundColor: '#FFEDD5' }]}>
                            <Monitor size={20} color="#F97316" />
                        </View>
                        <Text style={styles.earnTitle}>{t('live.rewards.watchLive')}</Text>
                        <Text style={styles.earnPoints}>+50 {t('live.rewards.pts')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.earnCard}>
                        <View style={[styles.earnIconBg, { backgroundColor: '#DBEAFE' }]}>
                            <LogIn size={20} color="#3B82F6" />
                        </View>
                        <Text style={styles.earnTitle}>{t('live.rewards.dailyLogin')}</Text>
                        <Text style={styles.earnPoints}>+50 {t('live.rewards.pts')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.earnCard}>
                        <View style={[styles.earnIconBg, { backgroundColor: '#DCFCE7' }]}>
                            <ShoppingBag size={20} color="#22C55E" />
                        </View>
                        <Text style={styles.earnTitle}>{t('live.rewards.purchase')}</Text>
                        <Text style={styles.earnPoints}>+50 {t('live.rewards.pts')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Refer & Earn Banner */}
                <View style={styles.referCard}>
                    <View style={styles.referContent}>
                        <Text style={styles.referTitle}>{t('live.rewards.referEarn')}</Text>
                        <Text style={styles.referDesc}>{t('live.rewards.inviteFriends')} <Text style={{ color: '#c026d3', fontWeight: 'bold' }}>{t('common.currency')}200</Text> {t('live.rewards.forEveryJoin')}</Text>
                        <TouchableOpacity style={styles.inviteButton}>
                            <Share2 size={16} color="#c026d3" style={{ marginRight: 6 }} />
                            <Text style={styles.inviteText}>{t('live.rewards.invite')}</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: 'https://cdni.iconscout.com/illustration/premium/thumb/friends-clicking-photo-illustration-download-in-svg-png-gif-file-formats--taking-selfie-group-pack-people-illustrations-4546761.png?f=webp' }}
                        style={styles.referImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Redeem Points */}
                <Text style={styles.sectionTitle}>{t('live.rewards.redeemPoints')}</Text>
                <View style={styles.redeemGrid}>
                    {REDEEM_ITEMS.map((item) => (
                        <View key={item.id} style={styles.redeemCard}>
                            <Image source={{ uri: item.image }} style={styles.redeemImage} />
                            <View style={styles.redeemInfo}>
                                <Text style={styles.redeemTitle}>{item.title}</Text>
                                <Text style={styles.redeemCost}>{item.cost}</Text>
                                <TouchableOpacity style={styles.redeemButton}>
                                    <Text style={styles.redeemButtonText}>{t('live.rewards.redeem')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* Bottom Filter Pills - Fixed or at bottom of scroll */}
            <View style={styles.bottomFilters}>
                {FILTER_TABS.map((tab, index) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.filterPill, index === 0 ? styles.filterPillActive : styles.filterPillInactive]}
                    >
                        <Text style={[styles.filterText, index === 0 ? styles.filterTextActive : styles.filterTextInactive]}>
                            {tab}
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
        color: '#1f2937', // gray-800
        marginLeft: 8,
    },
    scrollContent: {
        paddingBottom: 0, // Space for bottom filters
    },
    heroCard: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 24,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    balanceLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280', // gray-500
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    balanceValue: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#1f2937', // gray-900
        marginBottom: 8,
    },
    valueBadge: {
        backgroundColor: '#fdf4ff', // fuchsia-50
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 9999,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f0abfc', // fuchsia-300
    },
    valueText: {
        color: '#c026d3', // fuchsia-600
        fontWeight: 'bold',
        fontSize: 14,
    },
    tierInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    tierTextLeft: {
        fontWeight: 'bold',
        color: '#1f2937',
    },
    tierTextRight: {
        color: '#9ca3af', // gray-400
        fontSize: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 16, // Semi-bold headings
        fontWeight: 'bold',
        color: '#1f2937',
        marginLeft: 16,
        marginBottom: 12,
    },
    earnRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    earnCard: {
        width: (width - 32 - 24) / 3, // 3 cards with gaps
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        // Slight shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    earnIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    earnTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    earnPoints: {
        fontSize: 12,
        color: '#c026d3', // Premium purple/pink
        fontWeight: 'bold',
    },
    referCard: {
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    referContent: {
        flex: 1,
        paddingRight: 8,
    },
    referTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    referDesc: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 16,
        lineHeight: 18,
    },
    inviteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fdf4ff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 9999,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#e879f9',
    },
    inviteText: {
        color: '#c026d3',
        fontWeight: 'bold',
        fontSize: 14,
    },
    referImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    redeemGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    redeemCard: {
        width: (width - 32 - 16) / 2, // 2 cols with 16px gap
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        marginBottom: 16,
        overflow: 'hidden',
        paddingBottom: 12,
    },
    redeemImage: {
        width: '100%',
        height: 120,
        backgroundColor: '#f3f4f6',
    },
    redeemInfo: {
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    redeemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    redeemCost: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 12,
    },
    redeemButton: {
        backgroundColor: '#d946ef', // Fuchsia-500 similar to screenshot
        paddingVertical: 6,
        borderRadius: 9999,
        alignItems: 'center',
        alignSelf: 'flex-end', // Aligned to right like screenshot
        paddingHorizontal: 16,
    },
    redeemButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
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
