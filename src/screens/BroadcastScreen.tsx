// Broadcast Screen
// Allows users to go live, stream video, and manage their broadcast

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    StatusBar,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { X, Mic, MicOff, Camera as CameraIcon, Settings, ShoppingBag } from 'lucide-react-native';
import { streamService } from '../services/streamService';
import { useShopify } from '../context/ShopifyContext';

export const BroadcastScreen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [permission, requestPermission] = useCameraPermissions();
    const [isLive, setIsLive] = useState(false);
    const [cameraType, setCameraType] = useState<CameraType>('front');
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Check permissions
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    // Timer for stream duration
    useEffect(() => {
        if (isLive) {
            timerRef.current = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setDuration(0);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isLive]);

    async function handleGoLive() {
        try {
            await streamService.startBroadcast(t('broadcast.defaultTitle'));
            setIsLive(true);
        } catch (error) {
            Alert.alert(t('common.error'), t('broadcast.errorStart'));
        }
    }

    async function handleEndStream() {
        Alert.alert(
            t('broadcast.endStream'),
            t('broadcast.endConfirmation'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.end'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await streamService.stopBroadcast();
                            setIsLive(false);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert(t('common.error'), t('broadcast.errorStop'));
                        }
                    },
                },
            ]
        );
    }

    function toggleCamera() {
        setCameraType((current) => (current === 'back' ? 'front' : 'back'));
    }

    function toggleMute() {
        setIsMuted(!isMuted);
    }

    function formatDuration(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{t('broadcast.permissionNeeded')}</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.button}>
                    <Text style={styles.buttonText}>{t('broadcast.grantPermission')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <CameraView
                style={styles.camera}
                facing={cameraType}
                mute={isMuted}
            >
                <SafeAreaView style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.statusContainer}>
                            {isLive ? (
                                <View style={styles.liveBadge}>
                                    <Text style={styles.liveText}>{t('live.badge')}</Text>
                                    <Text style={styles.durationText}>{formatDuration(duration)}</Text>
                                </View>
                            ) : (
                                <View style={styles.readyBadge}>
                                    <Text style={styles.readyText}>{t('broadcast.ready')}</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => isLive ? handleEndStream() : navigation.goBack()}
                        >
                            <X color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Controls */}
                    <View style={styles.controlsContainer}>
                        {/* Bottom Bar */}
                        <View style={styles.bottomBar}>
                            <View style={styles.leftControls}>
                                <TouchableOpacity style={styles.iconButton} onPress={toggleCamera}>
                                    <CameraIcon color="#fff" size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={toggleMute}>
                                    {isMuted ? (
                                        <MicOff color="#EF4444" size={24} />
                                    ) : (
                                        <Mic color="#fff" size={24} />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Settings color="#fff" size={24} />
                                </TouchableOpacity>
                            </View>

                            {!isLive ? (
                                <TouchableOpacity style={styles.goLiveButton} onPress={handleGoLive}>
                                    <View style={styles.goLiveInner}>
                                        <Text style={styles.goLiveText}>{t('broadcast.goLive')}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.addProductButton}>
                                    <ShoppingBag color="#fff" size={20} />
                                    <Text style={styles.addProductText}>{t('broadcast.tagProduct')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#8B5CF6',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        gap: 8,
    },
    liveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    durationText: {
        color: '#fff',
        fontSize: 12,
    },
    readyBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    readyText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    controlsContainer: {
        paddingBottom: 20,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    leftControls: {
        flexDirection: 'row',
        gap: 20,
    },
    iconButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 24,
    },
    goLiveButton: {
        backgroundColor: '#EF4444',
        padding: 4,
        borderRadius: 30,
    },
    goLiveInner: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 26,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    goLiveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    addProductButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
    },
    addProductText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
