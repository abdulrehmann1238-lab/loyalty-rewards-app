import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HERO_IMAGE = require('../../../assets/images/hero-backdrop.jpg');

const STYLE_ID = 'verdant-hero-motion-styles';

/**
 * Web cinematic backdrop combining our editorial architectural photograph
 * with subtle moving sunlight caustics and slow optical Ken-Burns motion.
 */
export function HeroBackground() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes verdantKenBurns {
        0% { transform: scale(1) translate3d(0, 0, 0); }
        50% { transform: scale(1.055) translate3d(-1.2%, -0.8%, 0); }
        100% { transform: scale(1) translate3d(0, 0, 0); }
      }
      @keyframes verdantLightDrift {
        0% { opacity: 0.22; transform: translate3d(-4%, -2%, 0) rotate(-6deg); }
        50% { opacity: 0.36; transform: translate3d(4%, 2%, 0) rotate(-3deg); }
        100% { opacity: 0.22; transform: translate3d(-4%, -2%, 0) rotate(-6deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .verdant-hero-pan, .verdant-hero-light { animation: none !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <View pointerEvents="none" style={styles.root}>
      <div
        className={reducedMotion ? '' : 'verdant-hero-pan'}
        style={{
          position: 'absolute',
          inset: 0,
          animation: reducedMotion ? undefined : 'verdantKenBurns 22s ease-in-out infinite',
        }}
      >
        <Image source={HERO_IMAGE} style={styles.image} resizeMode="cover" />
      </div>

      {/* Subtle warm late-afternoon light sheen */}
      <div
        className={reducedMotion ? '' : 'verdant-hero-light'}
        style={{
          position: 'absolute',
          top: '-25%',
          right: '-10%',
          width: '72%',
          height: '140%',
          background:
            'radial-gradient(ellipse at 65% 38%, rgba(231, 214, 181, 0.28) 0%, rgba(181, 154, 105, 0.08) 42%, transparent 72%)',
          pointerEvents: 'none',
          animation: reducedMotion ? undefined : 'verdantLightDrift 16s ease-in-out infinite',
        }}
      />

      {/* Editorial deep-pine directional scrim for crisp readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(102deg, rgba(18, 37, 29, 0.84) 0%, rgba(21, 44, 34, 0.66) 48%, rgba(21, 44, 34, 0.42) 100%)',
          pointerEvents: 'none',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
