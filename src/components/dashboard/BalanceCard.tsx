import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { ArrowUpRight, RefreshCw, ShieldCheck, Wallet } from 'lucide-react-native';
import { Skeleton } from '@/components/common/Skeleton';
import { useResponsive } from '@/hooks/useResponsive';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, Shadows, TabularNumStyle } from '@/theme/tokens';
import { formatBalanceFixed, formatTokenAmount } from '@/utils/format';

interface BalanceCardProps {
  onPress: () => void;
}

export function BalanceCard({ onPress }: BalanceCardProps) {
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const status = useWalletStore((s) => s.status);
  const account = useWalletStore((s) => s.account);
  const summary = useWalletStore((s) => s.summary);
  const network = useWalletStore((s) => s.network);
  const isLoadingBalance = useWalletStore((s) => s.isLoadingBalance);
  const balanceError = useWalletStore((s) => s.balanceError);
  const refreshBalance = useWalletStore((s) => s.refreshBalance);
  const clearErrors = useWalletStore((s) => s.clearErrors);

  const isConnected = status === 'connected' && !!account;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Open reward balance and wallet details"
      style={({ pressed }) => [
        styles.card,
        Shadows.card,
        {
          backgroundColor: '#234B3B',
          padding: isMobile ? 20 : 26,
          opacity: pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.995 : 1 }],
        },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      {/* Subtle architectural contour lines */}
      <View pointerEvents="none" style={styles.patternLayer}>
        <Svg width="100%" height="100%" viewBox="0 0 600 260" preserveAspectRatio="xMaxYMid slice">
          <Path
            d="M320 -30 C 390 60, 480 40, 620 110"
            stroke="#F8F7F2"
            strokeWidth="1"
            strokeOpacity="0.10"
            fill="none"
          />
          <Path
            d="M270 280 C 370 170, 490 190, 630 130"
            stroke="#F8F7F2"
            strokeWidth="1"
            strokeOpacity="0.08"
            fill="none"
          />
          <Circle
            cx="515"
            cy="72"
            r="92"
            stroke="#B59A69"
            strokeWidth="1"
            strokeOpacity="0.18"
            fill="none"
          />
          <Circle
            cx="515"
            cy="72"
            r="56"
            stroke="#F8F7F2"
            strokeWidth="0.8"
            strokeOpacity="0.10"
            fill="none"
          />
        </Svg>
      </View>

      <View style={styles.topRow}>
        <View style={styles.eyebrowGroup}>
          <Text style={[styles.eyebrow, { fontFamily: FontFamilies.bodySemiBold }]}>
            TOTAL REWARD BALANCE
          </Text>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isConnected
                  ? 'rgba(117, 195, 150, 0.16)'
                  : 'rgba(248, 247, 242, 0.10)',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? '#86CFA3' : '#C69B58' },
              ]}
            />
            <Text style={[styles.statusText, { fontFamily: FontFamilies.bodyMedium }]}>
              {isConnected ? `Connected · ${account.truncatedAddress}` : 'Wallet Disconnected'}
            </Text>
          </View>
        </View>

        <View style={styles.topActions}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              refreshBalance();
            }}
            accessibilityRole="button"
            accessibilityLabel="Refresh reward balance"
            style={styles.iconBtn}
          >
            <RefreshCw size={15} color="#F8F7F2" />
          </Pressable>
          <View style={styles.arrowCircle}>
            <ArrowUpRight size={16} color="#19382E" />
          </View>
        </View>
      </View>

      {isLoadingBalance ? (
        <View style={styles.skeletonWrap}>
          <Skeleton width={220} height={44} style={{ backgroundColor: 'rgba(248,247,242,0.16)' }} />
          <Skeleton width={160} height={16} style={{ backgroundColor: 'rgba(248,247,242,0.12)' }} />
        </View>
      ) : balanceError ? (
        <View style={styles.errorBox}>
          <Text style={[styles.errorText, { fontFamily: FontFamilies.bodyMedium }]}>
            {balanceError}
          </Text>
          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              clearErrors();
              refreshBalance();
            }}
            style={styles.retryPill}
          >
            <Text style={[styles.retryText, { fontFamily: FontFamilies.bodySemiBold }]}>
              Reset & Retry
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.balanceSection}>
          <View style={styles.balanceRow}>
            <Text
              style={[
                styles.balanceNumber,
                TabularNumStyle,
                {
                  fontSize: isMobile ? 36 : 44,
                  fontFamily: FontFamilies.headingBold,
                },
              ]}
            >
              {formatBalanceFixed(summary.totalBalance)}
            </Text>
            <Text style={[styles.balanceUnit, { fontFamily: FontFamilies.headingSemiBold }]}>
              {summary.tokenSymbol}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { fontFamily: FontFamilies.bodyRegular }]}>
                Available
              </Text>
              <Text style={[styles.metaValue, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                {formatBalanceFixed(summary.availableBalance)} {summary.tokenSymbol}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { fontFamily: FontFamilies.bodyRegular }]}>
                Pending
              </Text>
              <Text style={[styles.metaValue, TabularNumStyle, { fontFamily: FontFamilies.bodySemiBold }]}>
                +{formatTokenAmount(summary.pendingBalance)} {summary.tokenSymbol}
              </Text>
            </View>
            {!isMobile ? <View style={styles.metaDivider} /> : null}
            <View style={[styles.metaItem, isMobile ? styles.metaItemFullMobile : undefined]}>
              <Text style={[styles.metaLabel, { fontFamily: FontFamilies.bodyRegular }]}>
                Network
              </Text>
              <View style={styles.networkLine}>
                {isConnected ? (
                  <ShieldCheck size={13} color="#B59A69" />
                ) : (
                  <Wallet size={13} color="rgba(248,247,242,0.72)" />
                )}
                <Text style={[styles.metaValue, { fontFamily: FontFamilies.bodyMedium }]}>
                  {isConnected ? network.name : 'Tap to connect wallet'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(248, 247, 242, 0.14)',
  },
  patternLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  eyebrowGroup: {
    gap: 8,
    flex: 1,
  },
  eyebrow: {
    color: 'rgba(248, 247, 242, 0.72)',
    fontSize: 11.5,
    letterSpacing: 1.2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: '#F8F7F2',
    fontSize: 12,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(248, 247, 242, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8F7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonWrap: {
    gap: 12,
    paddingVertical: 10,
  },
  errorBox: {
    backgroundColor: 'rgba(185, 109, 104, 0.25)',
    borderRadius: Radii.md,
    padding: 14,
    gap: 10,
  },
  errorText: {
    color: '#F8F7F2',
    fontSize: 13.5,
  },
  retryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F8F7F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  retryText: {
    color: '#19382E',
    fontSize: 12.5,
  },
  balanceSection: {
    gap: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    flexWrap: 'wrap',
  },
  balanceNumber: {
    color: '#F8F7F2',
    letterSpacing: -1.1,
  },
  balanceUnit: {
    color: '#B59A69',
    fontSize: 19,
    letterSpacing: 0.4,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(248, 247, 242, 0.14)',
  },
  metaItem: {
    gap: 3,
  },
  metaItemFullMobile: {
    width: '100%',
  },
  metaLabel: {
    color: 'rgba(248, 247, 242, 0.62)',
    fontSize: 11.5,
  },
  metaValue: {
    color: '#F8F7F2',
    fontSize: 13,
  },
  metaDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(248, 247, 242, 0.14)',
  },
  networkLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
