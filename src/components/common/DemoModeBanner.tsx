import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlaskConical, RotateCcw, ShieldAlert } from 'lucide-react-native';
import { useToastStore } from '@/store/toastStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';
import { SimulatedErrorType } from '@/types/wallet';
import { Button } from './Button';
import { ModalShell } from './ModalShell';

const ERROR_OPTIONS: { code: SimulatedErrorType; label: string; detail: string }[] = [
  {
    code: 'none',
    label: 'Normal Demo State',
    detail: 'All simulated RPC, balance, and history reads succeed.',
  },
  {
    code: 'wallet_rejected',
    label: 'Wallet Connection Rejected',
    detail: 'Simulates user declining the wallet approval prompt.',
  },
  {
    code: 'network_unavailable',
    label: 'Network Unavailable',
    detail: 'Simulates an unreachable Sepolia demo RPC provider.',
  },
  {
    code: 'balance_failed',
    label: 'Balance Fetch Failed',
    detail: 'Simulates a failed balanceOf(address) smart contract read.',
  },
  {
    code: 'transactions_unavailable',
    label: 'Transaction History Unavailable',
    detail: 'Simulates an indexer error when loading token logs.',
  },
];

export function DemoModePill() {
  const { colors } = useAppTheme();
  const simulatedError = useWalletStore((s) => s.simulatedError);
  const setDemoControlsOpen = useWalletStore((s) => s.setDemoControlsOpen);

  const hasSimulatedFault = simulatedError !== 'none';

  return (
    <Pressable
      onPress={() => setDemoControlsOpen(true)}
      accessibilityRole="button"
      accessibilityLabel="Open Demo Mode controls"
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: hasSimulatedFault ? colors.warningSoft : colors.surfaceElevated,
          borderColor: hasSimulatedFault ? colors.warning : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
        Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
      ]}
    >
      <FlaskConical size={13} color={hasSimulatedFault ? colors.warning : colors.primary} />
      <Text
        style={[
          styles.pillText,
          {
            color: hasSimulatedFault ? colors.warning : colors.textSecondary,
            fontFamily: FontFamilies.bodyMedium,
          },
        ]}
      >
        {hasSimulatedFault ? 'Demo · Fault Active' : 'Demo Mode'}
      </Text>
    </Pressable>
  );
}

export function DemoControlsModal() {
  const { colors } = useAppTheme();
  const open = useWalletStore((s) => s.demoControlsOpen);
  const setOpen = useWalletStore((s) => s.setDemoControlsOpen);
  const simulatedError = useWalletStore((s) => s.simulatedError);
  const setSimulatedError = useWalletStore((s) => s.setSimulatedError);
  const clearErrors = useWalletStore((s) => s.clearErrors);
  const refreshDashboardData = useWalletStore((s) => s.refreshDashboardData);
  const showToast = useToastStore((s) => s.showToast);

  const handleSelectError = async (code: SimulatedErrorType, label: string) => {
    setSimulatedError(code);
    if (code === 'none') {
      clearErrors();
      showToast('Demo state restored', 'All simulated blockchain reads are healthy.', 'success');
      await refreshDashboardData();
    } else {
      showToast('Simulated error armed', `${label} will trigger on the next action.`, 'warning');
      if (code === 'balance_failed' || code === 'network_unavailable') {
        useWalletStore.getState().refreshBalance();
      }
      if (code === 'transactions_unavailable' || code === 'network_unavailable') {
        useWalletStore.getState().refreshTransactions();
      }
    }
  };

  return (
    <ModalShell
      visible={open}
      onClose={() => setOpen(false)}
      title="Demo & Simulation Controls"
      subtitle="Safely preview simulated blockchain error states without a live RPC node."
      maxWidth={500}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.notice,
            { backgroundColor: colors.goldSoft, borderColor: colors.border },
          ]}
        >
          <ShieldAlert size={16} color={colors.gold} />
          <Text
            style={[
              styles.noticeText,
              { color: colors.text, fontFamily: FontFamilies.bodyRegular },
            ]}
          >
            All wallet balances, smart contract reads, and transaction hashes in Phase One use local
            demonstration data.
          </Text>
        </View>

        <View style={styles.optionList}>
          {ERROR_OPTIONS.map((opt) => {
            const active = simulatedError === opt.code;
            return (
              <Pressable
                key={opt.code}
                onPress={() => handleSelectError(opt.code, opt.label)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: active ? colors.primarySoft : colors.surfaceElevated,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={styles.optionHeader}>
                  <Text
                    style={[
                      styles.optionTitle,
                      { color: colors.text, fontFamily: FontFamilies.bodySemiBold },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: active ? colors.primary : colors.borderStrong },
                    ]}
                  >
                    {active ? <View style={[styles.radioInner, { backgroundColor: colors.primary }]} /> : null}
                  </View>
                </View>
                <Text
                  style={[
                    styles.optionDetail,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                  ]}
                >
                  {opt.detail}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footerRow}>
          <Button
            label="Reset & Sync"
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw size={14} color={colors.text} />}
            onPress={async () => {
              clearErrors();
              await refreshDashboardData();
              showToast('Demo data synced', 'Balance and transaction logs refreshed.', 'success');
              setOpen(false);
            }}
          />
          <Button label="Done" size="sm" onPress={() => setOpen(false)} />
        </View>
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    minHeight: 32,
  },
  pillText: {
    fontSize: 12,
  },
  content: {
    gap: 16,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  optionList: {
    gap: 10,
  },
  optionCard: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 13,
    gap: 4,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 14,
  },
  optionDetail: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
});

