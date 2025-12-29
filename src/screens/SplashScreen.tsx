import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenModule from 'expo-splash-screen';

export const SplashScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [status, setStatus] = useState({});

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.didJustFinish) {
            navigation.replace('Welcome');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Video
                source={require('../assets/images/Splash.mp4')}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                onLoad={() => {
                    // Hide the native splash screen when the video is loaded and ready to play
                    SplashScreenModule.hideAsync();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#0A6A8B',
        backgroundColor: '#F9FAFB',


    },
    video: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
