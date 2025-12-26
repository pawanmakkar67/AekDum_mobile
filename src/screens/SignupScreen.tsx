import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'; // Added Image, Dimensions, StyleSheet
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ChevronLeft, Smartphone } from 'lucide-react-native'; // Changed icon
import { LinearGradient } from 'expo-linear-gradient'; // Added LinearGradient
import { AekdumLogo } from '../components/common/AekdumLogo';

export const SignupScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { t } = useTranslation();
    const [otpSent, setOtpSent] = React.useState(false);
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [otp, setOtp] = React.useState('');

    const handleSendOtp = () => {
        if (name && phone) {
            // Simulate sending OTP
            setOtpSent(true);
        }
    };

    const handleVerify = () => {
        if (otp) {
            // Simulate verification
            navigation.replace('Main', { screen: 'Home' });
        }
    };

    return (
        <LinearGradient
            colors={['#ffffff', '#e9d5ff']} // White to Light Purple Gradient
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Back Button */}
                {/* <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ChevronLeft color="black" size={28} />
                </TouchableOpacity> */}
                {/* Removed back button to match "Welcome Back" standalone look, or keep it if navigation requires. 
                    Image doesn't explicitly show it, allowing standard nav behavior. */}

                <View style={styles.contentContainer}>
                    {/* Logo / Header Image Placeholder */}
                    <View style={styles.logoContainer}>
                        <AekdumLogo width={300} height={120} />
                    </View>

                    <Text style={styles.title}>
                        {otpSent ? t('auth.verification') : t('auth.welcomeBack')}
                    </Text>
                    <Text style={styles.subtitle}>
                        {otpSent
                            ? t('auth.enterCode', { phone })
                            : t('auth.verifyNumber')}
                    </Text>
                    {!otpSent && <Text style={styles.description}>
                        {t('auth.verifyDesc')}
                    </Text>}


                    <View style={styles.formContainer}>
                        {/* Name Input - Keeping it as requested, but styled */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('auth.fullName')}
                                placeholderTextColor="#9ca3af"
                                value={name}
                                onChangeText={setName}
                                editable={!otpSent}
                            />
                        </View>

                        {/* Phone Input with Flag */}
                        <View style={styles.phoneInputWrapper}>
                            <View style={styles.flagContainer}>
                                <Text style={styles.flagText}>🇮🇳 +91</Text>
                            </View>
                            <View style={styles.verticalDivider} />
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="9810123456"
                                placeholderTextColor="#9ca3af"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                editable={!otpSent}
                            />
                        </View>

                        {otpSent && (
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, styles.otpInput]}
                                    placeholder={t('auth.enterOtp')}
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    value={otp}
                                    onChangeText={setOtp}
                                    autoFocus
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={otpSent ? handleVerify : handleSendOtp}
                        >
                            <Text style={styles.buttonText}>
                                {otpSent ? t('auth.verifyOtp') : t('auth.sendOtp')}
                            </Text>
                        </TouchableOpacity>

                        {/* Or Continue With */}
                        <View style={styles.orContainer}>
                            <Text style={styles.orText}>{t('auth.orContinue')}</Text>
                        </View>

                        {/* Social Buttons */}
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#111827' }]}>
                                {/* Apple */}
                                <Text style={{ color: 'white', fontWeight: 'bold' }}></Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: 'white', borderWidth: 1, borderColor: '#e5e7eb' }]}>
                                {/* Google */}
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>G</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#9333ea' }]}>
                                {/* Mobile/Other */}
                                <Smartphone size={18} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerContainer}>
                            {!otpSent ? (
                                <Text style={styles.footerText}>
                                    {t('auth.haveAccount')}<Text style={styles.linkText} onPress={() => navigation.navigate('Login')}
                                    >{t('auth.login')}</Text>
                                    {/* Link to Login? The user flow is confused here. 
                                        If we are ON SignupScreen, this should link to Login. 
                                        But text says "Don't have an account? Sign Up". 
                                        The image likely IS the Signup (or Login) design. 
                                        I'll stick to navigation back to Login if needed. */}
                                </Text>
                            ) : (
                                <TouchableOpacity onPress={() => setOtpSent(false)}>
                                    <Text style={styles.linkText}>{t('auth.wrongNumber')}</Text>
                                </TouchableOpacity>
                            )}

                            <Text style={styles.termsText}>
                                {t('auth.terms')}
                            </Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 24,
    },
    backButton: {
        marginTop: 16,
        marginBottom: 24,
        marginLeft: -8,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    logoContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '500',
    },
    description: {
        fontSize: 12,
        color: '#4b5563',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
        lineHeight: 18,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 16,
        borderRadius: 9999, // Pill shape
        backgroundColor: '#f3f4f6', // Light gray/purple tint
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    input: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        fontSize: 16,
        color: '#1f2937',
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderRadius: 9999,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    flagContainer: {
        paddingLeft: 24,
        paddingRight: 12,
    },
    flagText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#d1d5db',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#1f2937',
    },
    otpInput: {
        textAlign: 'center',
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#d946ef', // Pink/Magenta
        borderRadius: 9999,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#d946ef',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    orText: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20, // React Native gap support or use margins
        marginBottom: 40,
    },
    socialButton: {
        width: 70, // w-16
        height: 50,
        borderRadius: 25, // Rounded rect or pill
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        // Make them pill shaped for the container
    },
    footerContainer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
        marginBottom: 16,
    },
    linkText: {
        color: '#d946ef', // Pink
        fontWeight: 'bold',
    },
    termsText: {
        fontSize: 11,
        color: '#4b5563',
        textAlign: 'center',
        lineHeight: 16,
    },
});
