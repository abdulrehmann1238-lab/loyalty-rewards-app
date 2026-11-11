import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies, Radii } from '@/theme/tokens';

export function SecuritySection() {
  const { isMobile, isTablet } = useResponsive();
  const stacked = isMobile || isTablet;

  const pillars = [
    {
      title: 'Transparent transaction records.',
      desc: 'Every earned reward and token redemption includes clear date, status, and transaction metadata.',
      illustration: (
        <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
          <Rect x="9" y="8" width="26" height="28" rx="4" stroke="#234B3B" strokeWidth="1.6" />
          <Path d="M15 16H29M15 22H26M15 28H22" stroke="#8FA596" strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
      ),
    },
    {
      title: 'Clear wallet connection status.',
      desc: 'Always know which network and address are active, with effortless one-tap disconnect controls.',
      illustration: (
        <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
          <Circle cx="22" cy="22" r="14" stroke="#234B3B" strokeWidth="1.6" />
          <Path d="M16 22.5L20 26.5L28.5 18" stroke="#4F8065" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      ),
    },
    {
      title: 'Straightforward account controls.',
      desc: 'Manage profile information, notification preferences, and appearance without clutter.',
      illustration: (
        <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
          <Path d="M12 16H32M12 28H32" stroke="#8FA596" strokeWidth="1.6" strokeLinecap="round" />
          <Circle cx="18" cy="16" r="3.5" fill="#F8F7F2" stroke="#234B3B" strokeWidth="1.6" />
          <Circle cx="27" cy="28" r="3.5" fill="#F8F7F2" stroke="#234B3B" strokeWidth="1.6" />
        </Svg>
      ),
    },
  ];

  return (
    <View style={styles.outer}>
      <View
        style={[
          styles.inner,
          {
            maxWidth: LayoutMetrics.maxLandingWidth,
            paddingHorizontal: isMobile ? 20 : 32,
          },
        ]}
      >
        <View style={styles.headerBlock}>
          <Text style={[styles.eyebrow, { fontFamily: FontFamilies.bodySemiBold }]}>
            TRANSPARENCY & CONTROL
          </Text>
          <Text
            style={[
              styles.heading,
              {
                fontSize: isMobile ? 30 : 40,
                lineHeight: isMobile ? 36 : 46,
                fontFamily: FontFamilies.headingBold,
              },
            ]}
          >
            Clarity at every step.
          </Text>
        </View>

        <View style={[styles.grid, stacked ? styles.gridStacked : undefined]}>
          {pillars.map((p) => (
            <View key={p.title} style={styles.card}>
              <View style={styles.illusWrap}>{p.illustration}</View>
              <Text style={[styles.title, { fontFamily: FontFamilies.headingSemiBold }]}>
                {p.title}
              </Text>
              <Text style={[styles.desc, { fontFamily: FontFamilies.bodyRegular }]}>
                {p.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F2F0E8',
    paddingVertical: 84,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E7E0D3',
  },
  inner: {
    width: '100%',
    gap: 36,
  },
  headerBlock: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.8,
    color: '#234B3B',
  },
  heading: {
    color: '#252A27',
    letterSpacing: -0.9,
  },
  grid: {
    flexDirection: 'row',
    gap: 20,
  },
  gridStacked: {
    flexDirection: 'column',
  },
  card: {
    flex: 1,
    backgroundColor: '#F8F7F2',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 24,
    gap: 12,
  },
  illusWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E0D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    color: '#252A27',
    letterSpacing: -0.2,
  },
  desc: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#777C75',
  },
});

