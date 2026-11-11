import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';
import { Button } from './Button';

export type EmptyStateKind = 'transactions' | 'wallet' | 'notifications' | 'search';

interface EmptyStateProps {
  kind: EmptyStateKind;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  kind,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  const renderIllustration = () => {
    const stroke = colors.primary;
    const muted = colors.sage;
    switch (kind) {
      case 'wallet':
        return (
          <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <Rect x="6" y="11" width="32" height="22" rx="5" stroke={stroke} strokeWidth="1.6" />
            <Path d="M26 19H38V25H26C24.3 25 23 23.7 23 22C23 20.3 24.3 19 26 19Z" stroke={muted} strokeWidth="1.6" />
            <Circle cx="27" cy="22" r="1.4" fill={colors.gold} />
          </Svg>
        );
      case 'notifications':
        return (
          <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <Path
              d="M14 27V19C14 14.6 17.6 11 22 11C26.4 11 30 14.6 30 19V27L33 30H11L14 27Z"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <Path d="M19.5 33C20.1 34.2 21 35 22 35C23 35 23.9 34.2 24.5 33" stroke={muted} strokeWidth="1.6" strokeLinecap="round" />
          </Svg>
        );
      case 'search':
        return (
          <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <Circle cx="20" cy="20" r="9.5" stroke={stroke} strokeWidth="1.6" />
            <Path d="M27 27L34 34" stroke={muted} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M16.5 20H23.5" stroke={colors.gold} strokeWidth="1.6" strokeLinecap="round" />
          </Svg>
        );
      case 'transactions':
      default:
        return (
          <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
            <Rect x="10" y="8" width="24" height="28" rx="4" stroke={stroke} strokeWidth="1.6" />
            <Path d="M15 16H29M15 22H25M15 28H21" stroke={muted} strokeWidth="1.6" strokeLinecap="round" />
          </Svg>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {renderIllustration()}
      </View>
      <Text style={[styles.title, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
        ]}
      >
        {description}
      </Text>
      {actionLabel && onAction ? (
        <View style={styles.actionWrap}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 340,
  },
  actionWrap: {
    marginTop: 6,
  },
});

