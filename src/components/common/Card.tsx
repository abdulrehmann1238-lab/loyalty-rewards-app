import React, { useState } from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@/theme/ThemeContext';
import { Radii, Shadows } from '@/theme/tokens';

export type CardVariant = 'default' | 'cream' | 'forest' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 20,
  onPress,
  style,
  accessibilityLabel,
}: CardProps) {
  const { colors } = useAppTheme();
  const [hovered, setHovered] = useState(false);

  const bg =
    variant === 'cream'
      ? colors.surfaceElevated
      : variant === 'forest'
      ? colors.primary
      : variant === 'outlined'
      ? 'transparent'
      : colors.surface;

  const borderColor =
    variant === 'forest'
      ? 'rgba(248, 247, 242, 0.14)'
      : hovered && onPress
      ? colors.borderStrong
      : colors.border;

  const baseStyle: StyleProp<ViewStyle> = [
    styles.card,
    {
      backgroundColor: bg,
      borderColor,
      padding,
    },
    variant !== 'outlined' ? Shadows.subtle : undefined,
    hovered && onPress ? Shadows.card : undefined,
    hovered && onPress && Platform.OS === 'web' ? ({ transform: [{ translateY: -2 }] } as any) : undefined,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          baseStyle,
          pressed ? { transform: [{ scale: 0.992 }], opacity: 0.96 } : undefined,
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    ...(Platform.OS === 'web'
      ? ({
          transitionProperty: 'transform, box-shadow, border-color',
          transitionDuration: '180ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        } as any)
      : {}),
  },
});

