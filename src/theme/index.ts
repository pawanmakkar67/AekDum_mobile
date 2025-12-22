/**
 * Theme
 * Central export for all design tokens
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, sizes } from './spacing';
import { shadows } from './shadows';

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    sizes,
    shadows,
} as const;

// Export individual modules for convenience
export { colors, typography, spacing, borderRadius, sizes, shadows };

// Export types
export type Theme = typeof theme;
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing, BorderRadius, Sizes } from './spacing';
export type { Shadows } from './shadows';
