/**
 * Spacing System
 * Consistent spacing scale and border radius values
 */

// Spacing scale (4px base unit)
export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,

    // Semantic spacing (easier to remember)
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
} as const;

// Border radius scale
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,  // For circular elements
} as const;

// Common sizes for UI elements
export const sizes = {
    // Icon sizes
    icon: {
        xs: 14,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    },

    // Button heights
    button: {
        sm: 32,
        md: 44,
        lg: 52,
    },

    // Input heights
    input: {
        sm: 36,
        md: 44,
        lg: 52,
    },

    // Avatar sizes
    avatar: {
        xs: 24,
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64,
    },
} as const;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Sizes = typeof sizes;
