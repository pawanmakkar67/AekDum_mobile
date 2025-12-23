import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthButton } from '../components/auth/AuthButton';
import { Logo } from '../components/common/Logo';
import { colors } from '../theme/colors';
import { AekdumLogo } from '../components/common/AekdumLogo';

const { width } = Dimensions.get('window');

export const WelcomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* 1. Full Screen Background Image */}
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop' }}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            {/* 2. Full Screen Gradient Overlay */}
            <LinearGradient
                // colors={[colors.brand.gradientStart, colors.brand.gradientMid, colors.brand.gradientEnd]}
                colors={['transparent', colors.brand.gradientStart, colors.brand.gradientMid, colors.brand.gradientEnd]} // Adjusted for a smoother purple/pink fade similar to design
                locations={[0, 0.4, 0.7, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* 3. Content Safe Area */}
            <View style={styles.safeAreaContent}>

                {/* Logo Area */}
                <View style={styles.logoContainer}>
                    <AekdumLogo width={300} height={120} />
                </View>

                {/* Welcoming Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.headingText}>Namaste,</Text>
                    <View style={styles.subHeadingRow}>
                        <Text style={styles.headingText}>Welcome to </Text>
                        <Text style={[styles.headingText, styles.brandText]}>AekDum</Text>
                    </View>
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    India's #live shopping destination.{'\n'}
                    Bid, buy, and win starting at ₹1.
                </Text>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <AuthButton
                        variant="apple"
                        fullWidth
                        label="Continue with Apple"
                        onPress={() => console.log('Continue with Apple')}
                    />
                    <AuthButton
                        variant="google"
                        fullWidth
                        label="Continue with Google"
                        onPress={() => console.log('Continue with Google')}
                    />
                    <AuthButton
                        variant="phone"
                        fullWidth
                        label="Use Phone"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>

                {/* Login Footer */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginFooter}
                >
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={[styles.loginText, styles.brandTextBold]}>Log In</Text>
                    </Text>
                </TouchableOpacity>

                {/* Terms Footer */}
                <Text style={styles.termsText}>
                    By continuing, you agree to Aekdum's Terms and Privacy. Policy
                </Text>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '60%',
    },
    safeAreaContent: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    headingText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.black,
        letterSpacing: -0.5,
    },
    subHeadingRow: {
        flexDirection: 'row',
    },
    brandText: {
        color: colors.brand.pink,
    },
    brandTextBold: {
        color: colors.brand.pink,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        color: colors.text.primary,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    loginFooter: {
        marginBottom: 24,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.gray[900],
    },
    termsText: {
        fontSize: 11,
        textAlign: 'center',
        color: colors.gray[900],
        opacity: 0.8,
        paddingHorizontal: 16,
        lineHeight: 16,
    },
});
