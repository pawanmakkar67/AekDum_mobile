import React, { createContext, useContext, useEffect, useState } from 'react';
import i18next from '../config/i18n.config';

type LanguageContextType = {
    currentLanguage: string;
    changeLanguage: (lang: string) => Promise<void>;
    availableLanguages: { code: string; label: string }[];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(i18next.language || 'en');

    // Update state when i18next language changes
    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            setCurrentLanguage(lng);
        };

        i18next.on('languageChanged', handleLanguageChanged);

        return () => {
            i18next.off('languageChanged', handleLanguageChanged);
        };
    }, []);

    const changeLanguage = async (lang: string) => {
        await i18next.changeLanguage(lang);
    };

    const availableLanguages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'fr', label: 'Français' },
        { code: 'de', label: 'Deutsch' },
        { code: 'ja', label: '日本語' },
    ];

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage, availableLanguages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
