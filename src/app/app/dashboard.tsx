import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Code2, Sparkles } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { RecentTransactionsCard } from '@/components/dashboard/RecentTransactionsCard';
import { RewardActivityChart } from '@/components/dashboard/RewardActivityChart';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { WalletStatusCard } from '@/components/dashboard/WalletStatusCard';
import { AppShell } from '@/components/navigation/AppShell';
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal';
import { useResponsive } from '@/hooks/useResponsive';
import { useUserStore } from '@/store/userStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';
import { TransactionItem } from '@/types/transaction';

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { isMobile, isTablet } = useResponsive();
  const stacked = isMobile || isTablet;

  const user = useUserStore((s) => s.user);
  const status = useWalletStore((s) => s.status);
  const setWalletModalOpen = useWalletStore((s) => s.setWalletModalOpen);
  const setDemoControlsOpen = useWalletStore((s) => s.setDemoControlsOpen);

  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  const handleBalanceCardPress = () => {
    if (status === 'connected') {
      router.push('/app/wallet');
    } else {
      setWalletModalOpen(true);
    }
  };

  return (
    <AppShell
      activeTab="dashboard"
      title={`Good morning, ${user.firstName}.`}
      subtitle="Here's an overview of your rewards."
    >
      <View style={[styles.layoutGrid, stacked ? styles.layoutStacked : undefined]}>
        {/* Main Primary Column */}
        <View style={styles.primaryCol}>
          <BalanceCard onPress={handleBalanceCardPress} />

          {stacked ? (
            <WalletStatusCard onOpenWalletPage={() => router.push('/app/wallet')} />
          ) : null}

          <StatsRow />

          <RewardActivityChart />

          <RecentTransactionsCard
            onSelectTransaction={(tx) => setSelectedTx(tx)}
            onViewAll={() => router.push('/app/transactions')}
          />
        </View>

        {/* Desktop Right Rail */}
        {!stacked ? (
          <View style={styles.secondaryCol}>
            <WalletStatusCard onOpenWalletPage={() => router.push('/app/wallet')} />

            <Card padding={22}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: colors.goldSoft }]}>
                  <Sparkles size={16} color={colors.gold} />
                </View>
                <Text
                  style={[
                    styles.insightTitle,
                    { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
                  ]}
                >
                  Member Tier Summary
                </Text>
              </View>
              <Text
                style={[
                  styles.insightBody,
                  { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                ]}
              >
                You are active as a {user.membershipTier} since {user.memberSince}. Partner dining,
                coffee, and travel purchases accrue RWD tokens directly into your ledger.
              </Text>
              <View style={styles.insightStats}>
                <View
                  style={[
                    styles.insightBox,
                    { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.insightKey,
                      { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                    ]}
                  >
                    Standard Rate
                  </Text>
                  <Text
                    style={[
                      styles.insightVal,
                      { color: colors.primary, fontFamily: FontFamilies.headingSemiBold },
                    ]}
                  >
                    5 RWD / $1
                  </Text>
                </View>
                <View
                  style={[
                    styles.insightBox,
                    { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.insightKey,
                      { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                    ]}
                  >
                    Token Standard
                  </Text>
                  <Text
                    style={[
                      styles.insightVal,
                      { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
                    ]}
                  >
                    ERC-20 Demo
                  </Text>
                </View>
              </View>
              <Button
                label="Explore Full History"
                variant="secondary"
                size="sm"
                fullWidth
                rightIcon={<ArrowRight size={14} color={colors.text} />}
                onPress={() => router.push('/app/transactions')}
              />
            </Card>

            <Card variant="cream" padding={20}>
              <View style={styles.insightHeader}>
                <View style={[styles.insightIcon, { backgroundColor: colors.primarySoft }]}>
                  <Code2 size={16} color={colors.primary} />
                </View>
                <Text
                  style={[
                    styles.insightTitle,
                    { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
                  ]}
                >
                  Simulated Error Testing
                </Text>
              </View>
              <Text
                style={[
                  styles.insightBody,
                  { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                ]}
              >
                Review how the interface handles rejected wallet prompts, RPC timeouts, or failed
                balance reads.
              </Text>
              <Button
                label="Open Simulation Controls"
                variant="outline"
                size="sm"
                fullWidth
                onPress={() => setDemoControlsOpen(true)}
              />
            </Card>
          </View>
        ) : null}
      </View>

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  layoutGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  layoutStacked: {
    flexDirection: 'column',
  },
  primaryCol: {
    flex: 1.8,
    minWidth: 0,
    gap: 20,
    width: '100%',
  },
  secondaryCol: {
    flex: 1,
    minWidth: 290,
    gap: 18,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: 15.5,
  },
  insightBody: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 14,
  },
  insightStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  insightBox: {
    flex: 1,
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 11,
    gap: 3,
  },
  insightKey: {
    fontSize: 11.5,
  },
  insightVal: {
    fontSize: 14,
  },
});

