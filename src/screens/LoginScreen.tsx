import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Mail } from 'lucide-react-native';
import { AuthButton } from '../components/auth/AuthButton';
import { AuthInput } from '../components/auth/AuthInput';
import { Logo } from '../components/common/Logo';
import { colors } from '../theme/colors';
import { AekdumLogo } from '../components/common/AekdumLogo';

export const LoginScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient
                colors={[colors.brand.gradientStart, colors.brand.gradientMid, colors.brand.gradientEnd]}
                locations={[0, 0.4, 1]}
                style={styles.gradient}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    {/* <Logo /> */}
                    <AekdumLogo width={300} height={200} />
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Login to catch latest drop live</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <AuthInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        icon={<Mail color="#64748b" size={20} />}
                    />
                    <AuthInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        isPassword
                    />
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.replace('Main')}
                >
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableOpacity>

                {/* Or Continue With */}
                <View style={styles.dividerContainer}>
                    <Text style={styles.dividerText}>Or Continue with</Text>
                </View>

                {/* Social Buttons */}
                <View style={styles.socialContainer}>
                    <AuthButton variant="apple" onPress={() => console.log('Apple Login')} />
                    <AuthButton variant="google" onPress={() => console.log('Google Login')} />
                    <AuthButton variant="phone" onPress={() => console.log('Phone Login')} />
                </View>

                {/* Sign Up Footer */}
                <View style={styles.signupFooter}>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.footerText}>
                            Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.termsText}>
                    By continuing, you agree to Aekdum's Terms and Privacy. Policy
                </Text>

            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: colors.gray[900],
    },
    formContainer: {
        marginBottom: 8,
        gap: 16,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 32,
        marginTop: 8,
    },
    forgotPasswordText: {
        color: colors.gray[900],
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: colors.brand.pink,
        borderRadius: 9999,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: colors.brand.purple,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    loginButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 20,
    },
    dividerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dividerText: {
        color: colors.gray[900],
        fontSize: 18,
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 32,
    },
    signupFooter: {
        alignItems: 'center',
        marginBottom: 16,
    },
    footerText: {
        color: colors.black,
        fontSize: 14,
        fontWeight: '500',
    },
    signupLink: {
        color: colors.brand.pink,
        fontWeight: 'bold',
    },
    termsText: {
        fontSize: 10,
        textAlign: 'center',
        color: colors.gray[800],
        opacity: 0.6,
        paddingHorizontal: 32,
        marginBottom: 16,
    },
});
