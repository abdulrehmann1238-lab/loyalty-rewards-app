import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Coffee, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react-native';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FontFamilies, Radii, Shadows, TabularNumStyle } from '@/theme/tokens';

interface HeroPhonePreviewProps {
  onOpenApp: () => void;
}

export function HeroPhonePreview({ onOpenApp }: HeroPhonePreviewProps) {
  const reducedMotion = useReducedMotion();
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -6,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, floatY]);

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY: floatY }] }]}>
      <Pressable
        onPress={onOpenApp}
        accessibilityRole="button"
        accessibilityLabel="Open interactive Verdant mobile wallet demo"
        style={({ pressed }) => [
          styles.deviceFrame,
          Shadows.floating,
          { opacity: pressed ? 0.96 : 1 },
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
        ]}
      >
        <View style={styles.screen}>
          {/* Notch / Speaker bar */}
          <View style={styles.notchRow}>
            <View style={styles.notchPill} />
          </View>

          {/* App Header */}
          <View style={styles.appHeader}>
            <View>
              <Text style={[styles.greeting, { fontFamily: FontFamilies.bodyRegular }]}>
                Good morning, Alex
              </Text>
              <Text style={[styles.brandTitle, { fontFamily: FontFamilies.headingSemiBold }]}>
                Verdant Wallet
              </Text>
            </View>
            <View style={styles.connectedBadge}>
              <View style={styles.liveDot} />
              <Text style={[styles.connectedText, TabularNumStyle, { fontFamily: FontFamilies.mono }]}>
                0x71C7...9A42
              </Text>
            </View>
          </View>

          {/* Deep Forest Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceTop}>
              <Text style={[styles.balanceLabel, { fontFamily: FontFamilies.bodySemiBold }]}>
                AVAILABLE REWARDS
              </Text>
              <ShieldCheck size={14} color="#B59A69" />
            </View>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceVal, TabularNumStyle, { fontFamily: FontFamilies.headingBold }]}>
                12,840.50
              </Text>
              <Text style={[styles.balanceUnit, { fontFamily: FontFamilies.headingSemiBold }]}>
                RWD
              </Text>
            </View>
            <Text style={[styles.networkText, { fontFamily: FontFamilies.bodyRegular }]}>
              Ethereum Sepolia (Demo) · Synced
            </Text>
          </View>

          {/* Mini Trend Visualization */}
          <View style={styles.trendCard}>
            <View style={styles.trendHead}>
              <Text style={[styles.trendTitle, { fontFamily: FontFamilies.bodySemiBold }]}>
                7-Day Balance Trend
              </Text>
              <Text style={[styles.trendDelta, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                +6.4%
              </Text>
            </View>
            <Svg width="100%" height={48} viewBox="0 0 240 48">
              <Defs>
                <LinearGradient id="heroMiniGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#234B3B" stopOpacity="0.22" />
                  <Stop offset="100%" stopColor="#234B3B" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path
                d="M 4 36 C 40 38, 70 28, 105 22 C 140 16, 172 24, 204 12 L 236 8 L 236 46 L 4 46 Z"
                fill="url(#heroMiniGrad)"
              />
              <Path
                d="M 4 36 C 40 38, 70 28, 105 22 C 140 16, 172 24, 204 12 L 236 8"
                fill="none"
                stroke="#234B3B"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Recent Activity Preview */}
          <View style={styles.activitySection}>
            <Text style={[styles.activityHeader, { fontFamily: FontFamilies.bodySemiBold }]}>
              RECENT ACTIVITY
            </Text>
            <View style={styles.txItem}>
              <View style={styles.txIcon}>
                <Coffee size={14} color="#234B3B" />
              </View>
              <View style={styles.txMeta}>
                <Text style={[styles.txTitle, { fontFamily: FontFamilies.bodySemiBold }]}>
                  Coffee House
                </Text>
                <Text style={[styles.txSub, { fontFamily: FontFamilies.bodyRegular }]}>
                  Purchase Reward · Today
                </Text>
              </View>
              <Text style={[styles.txAmount, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                +120 RWD
              </Text>
            </View>

            <View style={[styles.txItem, styles.txItemLast]}>
              <View style={styles.txIcon}>
                <ShoppingCart size={14} color="#234B3B" />
              </View>
              <View style={styles.txMeta}>
                <Text style={[styles.txTitle, { fontFamily: FontFamilies.bodySemiBold }]}>
                  Fresh Market
                </Text>
                <Text style={[styles.txSub, { fontFamily: FontFamilies.bodyRegular }]}>
                  Purchase Reward · Yesterday
                </Text>
              </View>
              <Text style={[styles.txAmount, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                +250 RWD
              </Text>
            </View>
          </View>

          <View style={styles.tapHint}>
            <Sparkles size={12} color="#234B3B" />
            <Text style={[styles.tapHintText, { fontFamily: FontFamilies.bodyMedium }]}>
              Tap to launch interactive app
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceFrame: {
    width: 318,
    maxWidth: '100%',
    borderRadius: 34,
    padding: 9,
    backgroundColor: '#1E2521',
    borderWidth: 1,
    borderColor: 'rgba(248, 247, 242, 0.22)',
  },
  screen: {
    backgroundColor: '#F8F7F2',
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  notchRow: {
    alignItems: 'center',
    marginBottom: 2,
  },
  notchPill: {
    width: 72,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D5CCB9',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  greeting: {
    fontSize: 11,
    color: '#777C75',
  },
  brandTitle: {
    fontSize: 15,
    color: '#252A27',
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    backgroundColor: '#EAF0EC',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F8065',
  },
  connectedText: {
    fontSize: 10.5,
    color: '#234B3B',
  },
  balanceCard: {
    backgroundColor: '#234B3B',
    borderRadius: 16,
    padding: 15,
    gap: 5,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 9.5,
    letterSpacing: 0.9,
    color: 'rgba(248, 247, 242, 0.72)',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  balanceVal: {
    fontSize: 26,
    color: '#F8F7F2',
    letterSpacing: -0.6,
  },
  balanceUnit: {
    fontSize: 13,
    color: '#B59A69',
  },
  networkText: {
    fontSize: 10.5,
    color: 'rgba(248, 247, 242, 0.74)',
    marginTop: 2,
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 12,
    gap: 6,
  },
  trendHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendTitle: {
    fontSize: 11.5,
    color: '#252A27',
  },
  trendDelta: {
    fontSize: 11.5,
    color: '#4F8065',
  },
  activitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E0D3',
    padding: 12,
    gap: 8,
  },
  activityHeader: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#777C75',
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE3',
  },
  txItemLast: {
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  txIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#EAF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txMeta: {
    flex: 1,
    gap: 1,
  },
  txTitle: {
    fontSize: 12,
    color: '#252A27',
  },
  txSub: {
    fontSize: 10.5,
    color: '#777C75',
  },
  txAmount: {
    fontSize: 12,
    color: '#4F8065',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: '#F2F0E8',
  },
  tapHintText: {
    fontSize: 11.5,
    color: '#234B3B',
  },
});

