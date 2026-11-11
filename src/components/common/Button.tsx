import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'ivory' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useAppTheme();
  const [hovered, setHovered] = useState(false);

  const isDisabled = disabled || loading;

  const getPalette = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: hovered ? colors.primaryDark : colors.primary,
          text: colors.textOnPrimary,
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: hovered ? colors.surfaceMuted : colors.surfaceElevated,
          text: colors.text,
          border: colors.border,
        };
      case 'outline':
        return {
          bg: hovered ? colors.surfaceElevated : 'transparent',
          text: colors.text,
          border: colors.borderStrong,
        };
      case 'ivory':
        return {
          bg: hovered ? '#EFECE3' : '#F8F7F2',
          text: '#19382E',
          border: 'transparent',
        };
      case 'danger':
        return {
          bg: hovered ? '#A85F5A' : colors.error,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'ghost':
      default:
        return {
          bg: hovered ? colors.surfaceElevated : 'transparent',
          text: colors.text,
          border: 'transparent',
        };
    }
  };

  const palette = getPalette();

  const height = size === 'sm' ? 40 : size === 'lg' ? 52 : 46;
  const paddingHorizontal = size === 'sm' ? 14 : size === 'lg' ? 24 : 18;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: Math.max(height, 44),
          paddingHorizontal,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: palette.border === 'transparent' ? 0 : 1,
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.56 : pressed ? 0.92 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.985 : 1 }],
        },
        Platform.OS === 'web' && ({ cursor: isDisabled ? 'not-allowed' : 'pointer' } as any),
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.text} />
      ) : (
        <View style={styles.inner}>
          {leftIcon}
          <Text
            style={[
              styles.label,
              {
                color: palette.text,
                fontSize,
                fontFamily: FontFamilies.bodySemiBold,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(Platform.OS === 'web'
      ? ({
          transitionProperty: 'background-color, transform, opacity, border-color',
          transitionDuration: '160ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    letterSpacing: -0.1,
  },
});

