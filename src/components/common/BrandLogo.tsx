import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies } from '@/theme/tokens';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  subtitle?: string;
}

export function BrandLogo({
  variant = 'auto',
  size = 'md',
  showWordmark = true,
  subtitle,
}: BrandLogoProps) {
  const { colors, isDark } = useAppTheme();

  const resolvedLight = variant === 'light' || (variant === 'auto' && isDark);
  const symbolBg = resolvedLight ? 'rgba(248, 247, 242, 0.14)' : colors.primary;
  const symbolStroke = '#F8F7F2';
  const wordmarkColor = resolvedLight ? '#F8F7F2' : colors.text;
  const subColor = resolvedLight ? 'rgba(248, 247, 242, 0.72)' : colors.textSecondary;

  const boxSize = size === 'sm' ? 30 : size === 'lg' ? 46 : 36;
  const fontSize = size === 'sm' ? 17 : size === 'lg' ? 24 : 20;

  return (
    <View style={styles.row} accessible accessibilityLabel="Verdant Rewards">
      <View
        style={[
          styles.markWrap,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: boxSize * 0.28,
            backgroundColor: symbolBg,
            borderColor: resolvedLight ? 'rgba(248, 247, 242, 0.25)' : 'transparent',
            borderWidth: resolvedLight ? 1 : 0,
          },
        ]}
      >
        <Svg width={boxSize * 0.62} height={boxSize * 0.62} viewBox="0 0 24 24" fill="none">
          <Rect
            x="3.2"
            y="3.2"
            width="17.6"
            height="17.6"
            rx="5"
            stroke={symbolStroke}
            strokeWidth="1.5"
            strokeOpacity={0.35}
          />
          <Path
            d="M7.2 8.2L12 16.4L16.8 8.2"
            stroke={symbolStroke}
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="7.5" r="1.45" fill="#B59A69" />
        </Svg>
      </View>

      {showWordmark ? (
        <View style={styles.textWrap}>
          <Text
            style={[
              styles.wordmark,
              {
                color: wordmarkColor,
                fontSize,
                fontFamily: FontFamilies.headingSemiBold,
              },
            ]}
          >
            verdant
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: subColor, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  markWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    justifyContent: 'center',
  },
  wordmark: {
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 0.4,
    marginTop: 1,
  },
});

