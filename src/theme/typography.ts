/**
 * Typography System
 * Font sizes, weights, line heights, and letter spacing
 */

export const typography = {
    // Font families (using system fonts for React Native)
    fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },

    // Font size scale (based on 4px grid)
    fontSize: {
        xs: 11,      // Extra small - labels, badges
        sm: 13,      // Small - captions, secondary text
        base: 14,    // Base - body text
        md: 16,      // Medium - emphasized body
        lg: 18,      // Large - subheadings
        xl: 20,      // Extra large - headings
        '2xl': 24,   // 2X large - section headings
        '3xl': 30,   // 3X large - page titles
        '4xl': 36,   // 4X large - hero text
        '5xl': 48,   // 5X large - display text (bid amounts)
    },

    // Font weights
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },

    // Line heights (multipliers)
    lineHeight: {
        tight: 1.25,    // For headings
        normal: 1.5,    // For body text
        relaxed: 1.75,  // For loose text
    },

    // Letter spacing
    letterSpacing: {
        tighter: -1,
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
} as const;

export type Typography = typeof typography;
