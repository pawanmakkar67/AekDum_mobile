/**
 * Color Palette
 * Centralized color definitions for the WhatNot clone app
 */

export const colors = {
    // Brand colors
    primary: '#8B5CF6',      // Purple - main brand color
    secondary: '#FFC107',    // Yellow - auction/bid highlight
    accent: '#10B981',       // Green - success states

    brand: {
        pink: '#c026d3',     // AekDum Pink
        purple: '#9333ea',   // AekDum Purple
        gradientStart: '#ffffff',
        gradientMid: '#f5f3ff',
        gradientEnd: '#e879f9',
    },

    social: {
        apple: '#0f172a',
        google: '#ffffff',
        phone: '#9333ea',
    },

    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#2563EB',

    // Grayscale
    black: '#000000',
    white: '#FFFFFF',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    // Background colors
    background: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        dark: '#000000',
        overlay: 'rgba(0, 0, 0, 0.5)',
        overlayLight: 'rgba(0, 0, 0, 0.3)',
        card: 'rgba(0, 0, 0, 0.75)',
        cardLight: 'rgba(0, 0, 0, 0.6)',
    },

    // Text colors
    text: {
        primary: '#111827',
        secondary: '#6B7280',
        tertiary: '#9CA3AF',
        inverse: '#FFFFFF',
        disabled: 'rgba(0, 0, 0, 0.4)',
    },

    // Border colors
    border: {
        light: 'rgba(255, 255, 255, 0.2)',
        medium: 'rgba(255, 255, 255, 0.3)',
        dark: 'rgba(0, 0, 0, 0.1)',
        darkMedium: 'rgba(0, 0, 0, 0.2)',
    },

    // Feature-specific colors
    auction: {
        bid: '#FFC107',         // Yellow for bid amounts
        winning: '#10B981',     // Green for winning state
        urgent: '#EF4444',      // Red for urgent/ending soon
        timer: {
            normal: '#FFFFFF',
            warning: '#F59E0B',   // Orange for <60s
            critical: '#EF4444',  // Red for <30s
        },
    },

    live: {
        indicator: '#EF4444',   // Red live dot
        badge: 'rgba(239, 68, 68, 0.1)',
        text: '#FFFFFF',
    },

    // Social/interaction colors
    heart: '#FF1493',         // Deep pink for likes
    share: '#FFFFFF',
    gift: '#FFFFFF',

    // Status colors
    status: {
        online: '#10B981',
        offline: '#9CA3AF',
        away: '#F59E0B',
    },
} as const;

export type Colors = typeof colors;
