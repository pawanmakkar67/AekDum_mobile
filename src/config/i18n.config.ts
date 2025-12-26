import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import ja from '../locales/ja.json';
import hi from '../locales/hi.json';

const RESOURCES = {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    ja: { translation: ja },
    hi: { translation: hi },
};

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lang: string) => void) => {
        try {
            // 1. Check for saved language preference
            const savedLanguage = await AsyncStorage.getItem('user-language');
            if (savedLanguage) {
                return callback(savedLanguage);
            }

            // 2. Check device language
            const locales = getLocales();
            if (locales && locales.length > 0) {
                const bestLanguage = locales[0].languageCode;
                return callback(bestLanguage);
            }

            // 3. Fallback to default
            return callback('en');
        } catch (error) {
            console.log('Error reading language', error);
            return callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language);
        } catch (error) {
            console.log('Error saving language', error);
        }
    },
};

i18next
    .use(LANGUAGE_DETECTOR)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources: RESOURCES,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            useSuspense: false,
        },
    } as any);

export default i18next;
