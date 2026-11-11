import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { ArrowRight } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies, Radii } from '@/theme/tokens';

interface FinalCtaSectionProps {
  onOpenWalletApp: () => void;
}

export function FinalCtaSection({ onOpenWalletApp }: FinalCtaSectionProps) {
  const { isMobile } = useResponsive();

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
        <View style={[styles.panel, { padding: isMobile ? 28 : 56 }]}>
          <View pointerEvents="none" style={styles.decor}>
            <Svg width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMaxYMid slice">
              <Circle cx="690" cy="70" r="140" stroke="#B59A69" strokeOpacity="0.18" strokeWidth="1" fill="none" />
              <Path d="M 480 320 C 560 210, 660 220, 810 130" stroke="#F8F7F2" strokeOpacity="0.10" strokeWidth="1" fill="none" />
            </Svg>
          </View>

          <View style={styles.content}>
            <Text
              style={[
                styles.heading,
                {
                  fontSize: isMobile ? 28 : 40,
                  lineHeight: isMobile ? 35 : 46,
                  fontFamily: FontFamilies.headingBold,
                },
              ]}
            >
              Your rewards deserve a better experience.
            </Text>
            <Text style={[styles.sub, { fontFamily: FontFamilies.bodyRegular }]}>
              See what a simpler rewards experience feels like.
            </Text>
            <View style={styles.btnWrap}>
              <Button
                label="Open Your Rewards Wallet"
                variant="ivory"
                size="lg"
                rightIcon={<ArrowRight size={17} color="#19382E" />}
                onPress={onOpenWalletApp}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    backgroundColor: '#F8F7F2',
    paddingVertical: 76,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  panel: {
    backgroundColor: '#234B3B',
    borderRadius: Radii.xl,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  decor: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  content: {
    maxWidth: 580,
    alignItems: 'center',
    gap: 14,
  },
  heading: {
    color: '#F8F7F2',
    textAlign: 'center',
    letterSpacing: -0.9,
  },
  sub: {
    color: 'rgba(248, 247, 242, 0.8)',
    fontSize: 16.5,
    lineHeight: 25,
    textAlign: 'center',
  },
  btnWrap: {
    marginTop: 12,
  },
});
