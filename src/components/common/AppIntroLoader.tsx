import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUserStore } from '@/store/userStore';
import { FontFamilies } from '@/theme/tokens';
import { BrandLogo } from './BrandLogo';

/**
 * 1.25-second calm luxury intro loader for initial landing entry.
 * Never repeats on subsequent navigation within the session.
 */
export function AppIntroLoader() {
  const hasSeenIntro = useUserStore((s) => s.hasSeenIntro);
  const markIntroSeen = useUserStore((s) => s.markIntroSeen);
  const reducedMotion = useReducedMotion();

  const containerOpacity = useRef(new Animated.Value(1)).current;
  const markOpacity = useRef(new Animated.Value(0.85)).current;
  const markScale = useRef(new Animated.Value(0.96)).current;
  const wordOpacity = useRef(new Animated.Value(0.4)).current;
  const progress = useRef(new Animated.Value(0.1)).current;

  useEffect(() => {
    if (hasSeenIntro) return;

    if (reducedMotion) {
      const timer = setTimeout(() => {
        markIntroSeen();
      }, 300);
      return () => clearTimeout(timer);
    }

    Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(markScale, {
          toValue: 1,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(wordOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 580,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
      markIntroSeen();
    });
  }, [hasSeenIntro, reducedMotion, containerOpacity, markOpacity, markScale, wordOpacity, progress, markIntroSeen]);

  if (hasSeenIntro) return null;

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['8%', '100%'],
  });

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.overlay,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      <View style={styles.center}>
        <Animated.View
          style={{
            opacity: markOpacity,
            transform: [{ scale: markScale }],
            alignItems: 'center',
          }}
        >
          <BrandLogo variant="dark" size="lg" showWordmark={false} />
        </Animated.View>

        <Animated.View style={[styles.wordWrap, { opacity: wordOpacity }]}>
          <Text style={[styles.wordmark, { fontFamily: FontFamilies.headingSemiBold }]}>
            verdant
          </Text>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, { width: progressWidth }]} />
          </View>
          <Text style={[styles.caption, { fontFamily: FontFamilies.bodyRegular }]}>
            Preparing your rewards experience
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#F8F7F2',
    zIndex: 9998,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  center: {
    alignItems: 'center',
    gap: 14,
  },
  wordWrap: {
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    fontSize: 26,
    letterSpacing: -0.6,
    color: '#252A27',
  },
  track: {
    width: 148,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#E7E0D3',
    overflow: 'hidden',
  },
  fill: {
    height: 2,
    backgroundColor: '#234B3B',
    borderRadius: 2,
  },
  caption: {
    fontSize: 12.5,
    color: '#777C75',
    letterSpacing: 0.2,
  },
});
