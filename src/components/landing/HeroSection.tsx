import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, ChevronDown } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { LayoutMetrics } from '@/constants/layout';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useResponsive } from '@/hooks/useResponsive';
import { FontFamilies } from '@/theme/tokens';
import { HeroBackground } from './HeroBackground';
import { HeroPhonePreview } from './HeroPhonePreview';

interface HeroSectionProps {
  onExploreRewards: () => void;
  onDiscoverHowItWorks: () => void;
}

export function HeroSection({ onExploreRewards, onDiscoverHowItWorks }: HeroSectionProps) {
  const { isMobile, isTablet } = useResponsive();
  const reducedMotion = useReducedMotion();
  const stacked = isMobile || isTablet;

  const eyebrowAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const titleAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const bodyAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const phoneAnim = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.stagger(110, [
      Animated.timing(eyebrowAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(titleAnim, { toValue: 1, duration: 460, useNativeDriver: true }),
      Animated.timing(bodyAnim, { toValue: 1, duration: 460, useNativeDriver: true }),
      Animated.timing(phoneAnim, { toValue: 1, duration: 520, useNativeDriver: true }),
    ]).start();
  }, [reducedMotion, eyebrowAnim, titleAnim, bodyAnim, phoneAnim]);

  return (
    <View style={[styles.heroOuter, { minHeight: stacked ? 760 : 690 }]}>
      <HeroBackground />

      <View
        style={[
          styles.heroInner,
          {
            maxWidth: LayoutMetrics.maxLandingWidth,
            paddingHorizontal: isMobile ? 20 : 32,
            paddingTop: isMobile ? 108 : 124,
            paddingBottom: isMobile ? 56 : 76,
            flexDirection: stacked ? 'column' : 'row',
            alignItems: stacked ? 'stretch' : 'center',
            gap: stacked ? 44 : 40,
          },
        ]}
      >
        <View style={[styles.copyCol, stacked ? styles.copyColCentered : undefined]}>
          <Animated.View
            style={{
              opacity: eyebrowAnim,
              transform: [
                {
                  translateY: eyebrowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            }}
          >
            <Text style={[styles.eyebrow, { fontFamily: FontFamilies.bodySemiBold }]}>
              LOYALTY, REIMAGINED
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            }}
          >
            <Text
              style={[
                styles.headline,
                {
                  fontSize: isMobile ? 38 : 54,
                  lineHeight: isMobile ? 44 : 60,
                  fontFamily: FontFamilies.headingBold,
                },
              ]}
            >
              Every purchase.{'\n'}A little more{' '}
              <Text style={[styles.editorialAccent, { fontFamily: FontFamilies.editorialItalic }]}>
                rewarding.
              </Text>
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: bodyAnim,
              transform: [
                {
                  translateY: bodyAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
              ],
            }}
          >
            <Text
              style={[
                styles.supporting,
                {
                  fontSize: isMobile ? 16 : 18,
                  lineHeight: isMobile ? 24 : 28,
                  fontFamily: FontFamilies.bodyRegular,
                },
              ]}
            >
              One simple place to see your rewards, follow your token balance, and stay connected to
              the value you earn.
            </Text>

            <View style={[styles.ctaRow, isMobile ? styles.ctaRowMobile : undefined]}>
              <Button
                label="Explore Your Rewards"
                variant="ivory"
                size="lg"
                rightIcon={<ArrowRight size={17} color="#19382E" />}
                onPress={onExploreRewards}
                fullWidth={isMobile}
              />
              <Button
                label="Discover How It Works"
                variant="outline"
                size="lg"
                rightIcon={<ChevronDown size={17} color="#F8F7F2" />}
                onPress={onDiscoverHowItWorks}
                fullWidth={isMobile}
                style={styles.secondaryBtn}
                textStyle={{ color: '#F8F7F2' }}
              />
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.visualCol,
            {
              opacity: phoneAnim,
              transform: [
                {
                  translateY: phoneAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <HeroPhonePreview onOpenApp={onExploreRewards} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroOuter: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#19382E',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroInner: {
    width: '100%',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  copyCol: {
    flex: 1.15,
    gap: 20,
    maxWidth: 620,
  },
  copyColCentered: {
    maxWidth: '100%',
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2.1,
    color: '#D8C294',
  },
  headline: {
    color: '#F8F7F2',
    letterSpacing: -1.1,
  },
  editorialAccent: {
    fontStyle: 'italic',
    color: '#E7D6B5',
    fontWeight: '500',
  },
  supporting: {
    color: 'rgba(248, 247, 242, 0.86)',
    maxWidth: 520,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 26,
  },
  ctaRowMobile: {
    flexDirection: 'column',
  },
  secondaryBtn: {
    borderColor: 'rgba(248, 247, 242, 0.36)',
    backgroundColor: 'rgba(248, 247, 242, 0.08)',
  },
  visualCol: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

