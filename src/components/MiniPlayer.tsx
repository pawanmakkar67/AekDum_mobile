import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { X, Maximize2, Play } from 'lucide-react-native';
import { useLiveStream } from '../context/LiveStreamContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

export const MiniPlayer = () => {
    const { activeStream, isMinimized, closeStream, maximizeStream } = useLiveStream();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    if (!activeStream || !isMinimized) return null;

    const handleMaximize = () => {
        maximizeStream();
        navigation.navigate('LiveStream', { streamId: activeStream.id });
    };

    return (
        <View
            className="absolute bottom-24 right-4 bg-black rounded-xl overflow-hidden shadow-lg border border-white/20"
            style={{ width: width * 0.35, aspectRatio: 9 / 16, elevation: 5 }}
        >
            {/* Video Placeholder */}
            <Image
                source={{ uri: activeStream.image }}
                className="w-full h-full opacity-80"
                resizeMode="cover"
            />

            {/* Overlay */}
            <TouchableOpacity
                className="absolute inset-0 justify-center items-center bg-black/10"
                onPress={handleMaximize}
            >
                <Play color="white" size={24} fill="white" style={{ opacity: 0.8 }} />
            </TouchableOpacity>

            {/* Controls */}
            <TouchableOpacity
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                onPress={closeStream}
            >
                <X color="white" size={14} />
            </TouchableOpacity>

            {/* Info */}
            <View className="absolute bottom-0 w-full bg-black/60 p-2">
                <Text className="text-white text-xs font-bold" numberOfLines={1}>
                    {activeStream.streamer}
                </Text>
            </View>
        </View>
    );
};
