import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react-native';
import { Card } from '@/components/common/Card';
import { useResponsive } from '@/hooks/useResponsive';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, TabularNumStyle } from '@/theme/tokens';
import { formatTokenAmount } from '@/utils/format';

export function StatsRow() {
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const summary = useWalletStore((s) => s.summary);

  const items = [
    {
      label: 'Total Earned',
      value: `${formatTokenAmount(summary.totalEarned)} ${summary.tokenSymbol}`,
      caption: '+6.4% this week',
      icon: ArrowDownLeft,
      iconBg: colors.successSoft,
      iconColor: colors.success,
    },
    {
      label: 'Total Redeemed',
      value: `${formatTokenAmount(summary.totalRedeemed)} ${summary.tokenSymbol}`,
      caption: '6 partner redemptions',
      icon: ArrowUpRight,
      iconBg: colors.goldSoft,
      iconColor: colors.gold,
    },
    {
      label: 'Transactions',
      value: `${summary.transactionCount}`,
      caption: '1 pending confirmation',
      icon: Receipt,
      iconBg: colors.primarySoft,
      iconColor: colors.primary,
    },
  ];

  return (
    <View style={[styles.grid, isMobile ? styles.gridMobile : undefined]}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} padding={18} style={styles.statCard}>
            <View style={styles.topLine}>
              <Text
                style={[
                  styles.label,
                  { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium },
                ]}
              >
                {item.label}
              </Text>
              <View style={[styles.iconBadge, { backgroundColor: item.iconBg }]}>
                <Icon size={15} color={item.iconColor} />
              </View>
            </View>
            <Text
              style={[
                styles.value,
                TabularNumStyle,
                { color: colors.text, fontFamily: FontFamilies.headingBold },
              ]}
            >
              {item.value}
            </Text>
            <Text
              style={[
                styles.caption,
                { color: colors.textMuted, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              {item.caption}
            </Text>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 14,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  statCard: {
    flex: 1,
    gap: 8,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontSize: 13,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    letterSpacing: -0.4,
  },
  caption: {
    fontSize: 12,
  },
});

