import "./global.css";
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from './src/context/NotificationContext';
import { BiddingProvider } from './src/context/BiddingContext';
import { LiveStreamProvider } from './src/context/LiveStreamContext';
import { ShopifyProvider } from './src/context/ShopifyContext';
import { LanguageProvider } from './src/context/LanguageContext';

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
