import { Platform } from 'react-native';

export interface AppThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  sage: string;
  olive: string;
  sand: string;
  border: string;
  borderStrong: string;
  gold: string;
  goldSoft: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  overlay: string;
  navBlurBg: string;
}

export const LightColors: AppThemeColors = {
  background: '#F8F7F2', // Warm ivory
  surface: '#FFFFFF', // Crisp white card surface
  surfaceElevated: '#F2F0E8', // Soft cream
  surfaceMuted: '#EFECE3',
  primary: '#234B3B', // Deep forest green
  primaryDark: '#19382E', // Dark green
  primarySoft: '#EAF0EC',
  sage: '#8FA596', // Muted sage
  olive: '#A8AE8B', // Soft olive
  sand: '#E7E0D3', // Warm sand
  border: '#E7E0D3',
  borderStrong: '#D5CCB9',
  gold: '#B59A69', // Muted gold (used sparingly)
  goldSoft: '#F6F1E6',
  text: '#252A27', // Charcoal
  textSecondary: '#777C75', // Secondary text
  textMuted: '#91958E',
  textOnPrimary: '#F8F7F2',
  success: '#4F8065',
  successSoft: '#EBF2EE',
  warning: '#C69B58',
  warningSoft: '#F8F1E4',
  error: '#B96D68',
  errorSoft: '#F7ECEB',
  overlay: 'rgba(25, 34, 29, 0.42)',
  navBlurBg: 'rgba(248, 247, 242, 0.90)',
};

export const DarkColors: AppThemeColors = {
  background: '#111714',
  surface: '#17201C',
  surfaceElevated: '#1D2823',
  surfaceMuted: '#24312B',
  primary: '#2F644F',
  primaryDark: '#19382E',
  primarySoft: 'rgba(143, 165, 150, 0.14)',
  sage: '#8FA596',
  olive: '#A8AE8B',
  sand: '#2B3831',
  border: '#27342D',
  borderStrong: '#36473E',
  gold: '#C5AA79',
  goldSoft: 'rgba(197, 170, 121, 0.14)',
  text: '#F5F4EE',
  textSecondary: '#A8B1AA',
  textMuted: '#7F8A82',
  textOnPrimary: '#F8F7F2',
  success: '#639C7D',
  successSoft: 'rgba(79, 128, 101, 0.16)',
  warning: '#D4AB6A',
  warningSoft: 'rgba(198, 155, 88, 0.16)',
  error: '#CE817C',
  errorSoft: 'rgba(185, 109, 104, 0.16)',
  overlay: 'rgba(7, 11, 9, 0.65)',
  navBlurBg: 'rgba(17, 23, 20, 0.90)',
};

export const FontFamilies = {
  headingRegular: Platform.select({ web: '"DM Sans", Inter, system-ui, sans-serif', default: 'DMSans_500Medium' }),
  headingSemiBold: Platform.select({ web: '"DM Sans", Inter, system-ui, sans-serif', default: 'DMSans_600SemiBold' }),
  headingBold: Platform.select({ web: '"DM Sans", Inter, system-ui, sans-serif', default: 'DMSans_700Bold' }),
  bodyRegular: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'Inter_400Regular' }),
  bodyMedium: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'Inter_500Medium' }),
  bodySemiBold: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'Inter_600SemiBold' }),
  editorial: Platform.select({ web: '"Playfair Display", Georgia, serif', default: 'PlayfairDisplay_500Medium' }),
  editorialItalic: Platform.select({
    web: '"Playfair Display", Georgia, serif',
    default: 'PlayfairDisplay_500Medium_Italic',
  }),
  mono: Platform.select({
    web: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
} as const;

export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 72,
} as const;

export const Shadows = {
  subtle: Platform.select({
    web: {
      boxShadow: '0 4px 20px rgba(25, 56, 46, 0.05)',
    },
    default: {
      shadowColor: '#19382E',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
    },
  }),
  card: Platform.select({
    web: {
      boxShadow: '0 10px 30px rgba(25, 56, 46, 0.07)',
    },
    default: {
      shadowColor: '#19382E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 3,
    },
  }),
  floating: Platform.select({
    web: {
      boxShadow: '0 24px 54px rgba(25, 42, 34, 0.14)',
    },
    default: {
      shadowColor: '#192A22',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.16,
      shadowRadius: 26,
      elevation: 8,
    },
  }),
};

export const TabularNumStyle = Platform.select({
  web: { fontVariantNumeric: 'tabular-nums' } as any,
  default: { fontVariant: ['tabular-nums'] as ('tabular-nums')[] },
});

