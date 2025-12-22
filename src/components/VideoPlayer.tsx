// HLS Video Player Component
// Supports low-latency streaming with expo-av

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react-native';
import type { VideoPlayerState, StreamQuality } from '../types/streaming.types';

interface VideoPlayerProps {
    streamUrl?: string;
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    lowLatency?: boolean;
    onPlaybackStatusUpdate?: (status: VideoPlayerState) => void;
    onError?: (error: string) => void;
}

export function VideoPlayer({
    streamUrl,
    poster,
    autoPlay = true,
    muted = false,
    lowLatency = true,
    onPlaybackStatusUpdate,
    onError,
}: VideoPlayerProps) {
    const videoRef = useRef<Video>(null);
    const [playerState, setPlayerState] = useState<VideoPlayerState>({
        isPlaying: autoPlay,
        isMuted: muted,
        volume: muted ? 0 : 1,
        currentTime: 0,
        duration: 0,
        buffering: false,
        quality: 'auto',
        availableQualities: ['auto', '1080p', '720p', '480p', '360p'],
    });

    const [showControls, setShowControls] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (streamUrl) {
            loadVideo();
        }
    }, [streamUrl]);

    async function loadVideo() {
        try {
            setLoading(true);
            if (videoRef.current && streamUrl) {
                await videoRef.current.loadAsync(
                    { uri: streamUrl },
                    {
                        shouldPlay: autoPlay,
                        isMuted: muted,
                        // Low latency settings for HLS
                        progressUpdateIntervalMillis: lowLatency ? 100 : 500,
                    }
                );
                setLoading(false);
            }
        } catch (error) {
            console.error('Error loading video:', error);
            setLoading(false);
            onError?.(error instanceof Error ? error.message : 'Failed to load video');
        }
    }

    async function togglePlayPause() {
        if (!videoRef.current) return;

        if (playerState.isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    }

    async function toggleMute() {
        if (!videoRef.current) return;

        const newMuted = !playerState.isMuted;
        await videoRef.current.setIsMutedAsync(newMuted);
        setPlayerState((prev) => ({
            ...prev,
            isMuted: newMuted,
            volume: newMuted ? 0 : 1,
        }));
    }

    function handlePlaybackStatusUpdate(status: AVPlaybackStatus) {
        if (!status.isLoaded) {
            if (status.error) {
                console.error('Playback error:', status.error);
                onError?.(status.error);
            }
            return;
        }

        const newState: VideoPlayerState = {
            isPlaying: status.isPlaying,
            isMuted: status.isMuted,
            volume: status.volume,
            currentTime: status.positionMillis / 1000,
            duration: (status.durationMillis || 0) / 1000,
            buffering: status.isBuffering,
            quality: playerState.quality,
            availableQualities: playerState.availableQualities,
        };

        setPlayerState(newState);
        onPlaybackStatusUpdate?.(newState);
    }

    if (!streamUrl) {
        return (
            <View style={styles.container}>
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>No stream available</Text>
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={() => setShowControls(!showControls)}
        >
            <Video
                ref={videoRef}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                posterSource={poster ? { uri: poster } : undefined}
                usePoster={!!poster}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}

            {playerState.buffering && !loading && (
                <View style={styles.bufferingOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                </View>
            )}

            {showControls && (
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.controlButton} onPress={togglePlayPause}>
                        {playerState.isPlaying ? (
                            <Pause color="#fff" size={32} fill="#fff" />
                        ) : (
                            <Play color="#fff" size={32} fill="#fff" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
                        {playerState.isMuted ? (
                            <VolumeX color="#fff" size={24} />
                        ) : (
                            <Volume2 color="#fff" size={24} />
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* Live indicator */}
            <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    placeholderText: {
        color: '#666',
        fontSize: 16,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    bufferingOverlay: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    controls: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
        gap: 16,
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    liveIndicator: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,0,0,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        marginRight: 6,
    },
    liveText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
