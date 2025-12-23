import "./global.css";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from './src/context/NotificationContext';
import { BiddingProvider } from './src/context/BiddingContext';
import { LiveStreamProvider } from './src/context/LiveStreamContext';
import { ShopifyProvider } from './src/context/ShopifyContext';
import { LanguageProvider } from './src/context/LanguageContext';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ShopifyProvider>
          <NotificationProvider>
            <BiddingProvider>
              <LiveStreamProvider>
                <RootNavigator />
              </LiveStreamProvider>
              <StatusBar style="auto" />
            </BiddingProvider>
          </NotificationProvider>
        </ShopifyProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
