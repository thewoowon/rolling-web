/**
 * Rolling Design Tokens
 *
 * Pure data — no Tailwind/React/CSS-in-JS dependencies. Same object can be
 * consumed by:
 *   - Tailwind 4 `@theme` (via `globals.css`)
 *   - React Native styled primitives later
 *   - Storybook / docs
 *
 * Naming convention: semantic > literal.
 *   `text.primary` not `gray.900`
 *   `surface.card` not `white`
 *
 * When values diverge between light and dark, use the `mode` namespaces.
 */

export const palette = {
  // Brand — warm coral (warm, inviting, but not Tinder-red).
  coral: {
    50: "#FFF4F2",
    100: "#FFE6E1",
    200: "#FFC6BD",
    300: "#FFA095",
    400: "#FF8579",
    500: "#FF6F62", // base
    600: "#EE5750",
    700: "#C73E3A",
    800: "#9A2E2C",
  },
  // Secondary accent — soft lavender for info / quiet states.
  lavender: {
    50: "#F4F1FF",
    100: "#E8E2FF",
    200: "#C9BFFF",
    300: "#A99BFF",
    400: "#897CFF",
    500: "#6E60F5",
  },
  // Functional — success / warning / danger.
  mint: {
    50: "#E8F8F4",
    500: "#1FB99F",
    700: "#0E8270",
  },
  amber: {
    50: "#FFF6E0",
    500: "#F59E0B",
    700: "#B45309",
  },
  red: {
    50: "#FFEBE9",
    500: "#E5494C",
    700: "#A82A2D",
  },
  // Warm neutrals — slight yellow cast so the app feels human, not corporate.
  neutral: {
    0: "#FFFFFF",
    50: "#FBFAF7", // app background
    100: "#F4F2EC", // surface-2 / chip
    150: "#E9E6DD",
    200: "#DEDAD0", // border
    300: "#BFBAAE",
    400: "#8E8A7F",
    500: "#6B6960",
    600: "#4D4B45",
    700: "#33322E",
    800: "#1F1E1B",
    900: "#0F0F0D",
  },
} as const;

export const semanticColors = {
  light: {
    bg: {
      app: palette.neutral[50],
      surface: palette.neutral[0],
      surfaceSubtle: palette.neutral[100],
      surfaceMuted: palette.neutral[150],
      inverse: palette.neutral[900],
    },
    text: {
      primary: palette.neutral[900],
      secondary: palette.neutral[600],
      tertiary: palette.neutral[400],
      onAccent: palette.neutral[0],
      onInverse: palette.neutral[50],
      link: palette.coral[700],
    },
    border: {
      subtle: palette.neutral[150],
      default: palette.neutral[200],
      strong: palette.neutral[300],
      focus: palette.coral[500],
    },
    accent: {
      bg: palette.coral[500],
      bgHover: palette.coral[600],
      bgPressed: palette.coral[700],
      bgSoft: palette.coral[50],
      bgSoftHover: palette.coral[100],
      text: palette.coral[700],
      onAccent: palette.neutral[0],
    },
    success: {
      bg: palette.mint[500],
      bgSoft: palette.mint[50],
      text: palette.mint[700],
    },
    warning: {
      bg: palette.amber[500],
      bgSoft: palette.amber[50],
      text: palette.amber[700],
    },
    danger: {
      bg: palette.red[500],
      bgSoft: palette.red[50],
      text: palette.red[700],
    },
    info: {
      bg: palette.lavender[500],
      bgSoft: palette.lavender[50],
      text: palette.lavender[500],
    },
  },
  dark: {
    bg: {
      app: palette.neutral[900],
      surface: palette.neutral[800],
      surfaceSubtle: palette.neutral[700],
      surfaceMuted: palette.neutral[600],
      inverse: palette.neutral[0],
    },
    text: {
      primary: palette.neutral[50],
      secondary: palette.neutral[300],
      tertiary: palette.neutral[400],
      onAccent: palette.neutral[0],
      onInverse: palette.neutral[900],
      link: palette.coral[300],
    },
    border: {
      subtle: palette.neutral[700],
      default: palette.neutral[600],
      strong: palette.neutral[500],
      focus: palette.coral[400],
    },
    accent: {
      bg: palette.coral[500],
      bgHover: palette.coral[400],
      bgPressed: palette.coral[300],
      bgSoft: "rgba(255,111,98,0.12)",
      bgSoftHover: "rgba(255,111,98,0.20)",
      text: palette.coral[300],
      onAccent: palette.neutral[0],
    },
    success: {
      bg: palette.mint[500],
      bgSoft: "rgba(31,185,159,0.14)",
      text: palette.mint[500],
    },
    warning: {
      bg: palette.amber[500],
      bgSoft: "rgba(245,158,11,0.14)",
      text: palette.amber[500],
    },
    danger: {
      bg: palette.red[500],
      bgSoft: "rgba(229,73,76,0.14)",
      text: palette.red[500],
    },
    info: {
      bg: palette.lavender[400],
      bgSoft: "rgba(110,96,245,0.14)",
      text: palette.lavender[300],
    },
  },
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12, // default for inputs/buttons
  lg: 16, // default for cards
  xl: 24, // hero cards
  pill: 999,
} as const;

export const space = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const fontFamilies = {
  // Pretendard Variable for Korean + Latin; system fallbacks per OS.
  sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const fontSizes = {
  xs: 12,
  sm: 13,
  base: 15, // body — slightly larger than 14 for Korean readability
  md: 16,
  lg: 18,
  xl: 22,
  "2xl": 26,
  "3xl": 32,
  "4xl": 40,
  "5xl": 52,
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  tight: 1.2,
  snug: 1.4,
  normal: 1.6, // body — Korean needs more
  relaxed: 1.75,
} as const;

export const letterSpacings = {
  tight: "-0.02em",
  normal: 0,
  wide: "0.04em",
  wider: "0.08em",
} as const;

export const shadows = {
  // Light, layered shadows — feels "lifted, not stamped".
  xs: "0 1px 1px rgba(20,18,12,0.04)",
  sm: "0 1px 2px rgba(20,18,12,0.06)",
  md: "0 1px 2px rgba(20,18,12,0.04), 0 4px 12px rgba(20,18,12,0.06)",
  lg: "0 2px 4px rgba(20,18,12,0.04), 0 12px 28px rgba(20,18,12,0.08)",
  xl: "0 4px 8px rgba(20,18,12,0.04), 0 24px 60px rgba(20,18,12,0.10)",
  focus: "0 0 0 3px rgba(255,111,98,0.20)", // coral 500 @ 20%
} as const;

export const durations = {
  instant: 50,
  fast: 150,
  base: 200,
  slow: 320,
  slower: 480,
} as const;

export const easings = {
  standard: "cubic-bezier(0.2, 0, 0, 1)", // material-style
  emphasized: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // gentle overshoot
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const tokens = {
  palette,
  semanticColors,
  radii,
  space,
  fontFamilies,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  shadows,
  durations,
  easings,
  breakpoints,
} as const;

export type Tokens = typeof tokens;
