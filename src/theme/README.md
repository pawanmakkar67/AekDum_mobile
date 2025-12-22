# Design System Usage Guide

## Quick Start

### Import the theme
```typescript
import { theme } from '../theme';
// or import specific modules
import { colors, typography, spacing } from '../theme';
```

### Use common components
```typescript
import { Button, Text, Card, Input, Badge } from '../components/common';
```

---

## Theme Tokens

### Colors
```typescript
// Brand colors
theme.colors.primary      // #8B5CF6 (purple)
theme.colors.secondary    // #FFC107 (yellow)
theme.colors.accent       // #10B981 (green)

// Semantic
theme.colors.success
theme.colors.warning
theme.colors.error
theme.colors.info

// Grayscale
theme.colors.gray[50] to theme.colors.gray[900]

// Feature-specific
theme.colors.auction.bid
theme.colors.auction.winning
theme.colors.live.indicator
```

### Typography
```typescript
// Font sizes
theme.typography.fontSize.xs    // 11
theme.typography.fontSize.base  // 14
theme.typography.fontSize['5xl'] // 48

// Font weights
theme.typography.fontWeight.normal
theme.typography.fontWeight.bold
```

### Spacing
```typescript
// Numeric scale
theme.spacing[4]   // 16px
theme.spacing[8]   // 32px

// Semantic
theme.spacing.md   // 16px
theme.spacing.xl   // 32px

// Border radius
theme.borderRadius.lg   // 12
theme.borderRadius.full // 9999
```

---

## Common Components

### Button
```typescript
<Button 
  variant="primary"  // primary | secondary | outline | ghost | danger
  size="md"          // sm | md | lg
  onPress={handlePress}
  loading={isLoading}
  disabled={isDisabled}
  fullWidth
>
  Submit
</Button>
```

### Text
```typescript
<Text 
  variant="h1"       // h1 | h2 | h3 | body | caption | label
  color={theme.colors.primary}
  weight="bold"
  align="center"
>
  Hello World
</Text>
```

### Card
```typescript
<Card 
  variant="elevated"  // elevated | outlined | filled
  padding="md"        // xs | sm | md | lg | xl
>
  <Text>Card content</Text>
</Card>
```

### Input
```typescript
<Input
  label="Email"
  placeholder="Enter email"
  error={errors.email}
  size="md"
  value={email}
  onChangeText={setEmail}
/>
```

### Badge
```typescript
<Badge 
  variant="success"  // primary | success | warning | error | info
  size="md"          // sm | md
>
  LIVE
</Badge>
```

---

## Migration Examples

### Before (Hardcoded)
```typescript
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
```

### After (Theme)
```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
```

### Or use component
```typescript
<Button variant="primary" onPress={handlePress}>
  Click Me
</Button>
```

---

## Files Created

### Theme
- `src/theme/colors.ts` - Color palette
- `src/theme/typography.ts` - Font system
- `src/theme/spacing.ts` - Spacing & sizes
- `src/theme/shadows.ts` - Shadow styles
- `src/theme/index.ts` - Central export

### Components
- `src/components/common/Button.tsx`
- `src/components/common/Text.tsx`
- `src/components/common/Card.tsx`
- `src/components/common/Input.tsx`
- `src/components/common/Badge.tsx`
- `src/components/common/index.ts`
