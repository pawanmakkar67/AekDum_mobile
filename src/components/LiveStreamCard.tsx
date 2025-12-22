import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, Video } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiveBadge } from './LiveBadge';

interface LiveStreamCardProps {
    stream: {
        id: string;
        title: string;
        streamer: string;
        viewers: number;
        image: string;
        avatar: string; // not used in new design directly but kept for compatibility
        category: string;
    };
    onPress: () => void;
}

export const LiveStreamCard = ({ stream, onPress }: LiveStreamCardProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.9}>
            <View style={styles.card}>
                <ImageBackground
                    source={{ uri: stream.image }}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                >
                    {/* Dark Gradient Overlay for text readability at bottom */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradient}
                    />

                    {/* Top Badges */}
                    <View style={styles.topBadges}>
                        <LiveBadge />

                        <View style={styles.viewerBadge}>
                            <Eye size={12} color="white" />
                            <Text style={styles.viewerText}>
                                {stream.viewers > 1000 ? `${(stream.viewers / 1000).toFixed(1)}k` : stream.viewers}
                            </Text>
                        </View>
                    </View>

                    {/* Bottom Content */}
                    <View style={styles.bottomContent}>
                        <Text style={styles.title} numberOfLines={2}>
                            {stream.title}
                        </Text>
                        <Text style={styles.streamer}>
                            {stream.streamer}
                        </Text>

                        <TouchableOpacity
                            onPress={onPress}
                            style={styles.joinButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.joinButtonText}>
                                Join Live Stream
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 16,
    },
    card: {
        width: 174, // w-56 (56 * 4 = 224)
        height: 224, // h-72 (72 * 4 = 288)
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#111827', // gray-900
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    topBadges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    viewerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        // backdrop-blur is not directly supported in RN styles like CSS, usually requires Expo BlurView, but simpler for now
    },
    viewerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'medium', // 500
        marginLeft: 4,
    },
    bottomContent: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14, // text-lg
        marginBottom: 4,
        // lineHeight: 24,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    streamer: {
        color: '#d1d5db', // gray-300
        fontSize: 10, // text-xs
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 12,
    },
    joinButton: {
        backgroundColor: '#9333ea', // purple-600
        width: '100%',
        paddingVertical: 10,
        borderRadius: 9999,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    joinButtonText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5, // tracking-wide
    },
});
