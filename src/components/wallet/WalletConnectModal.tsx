import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Globe,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ModalShell } from '@/components/common/ModalShell';
import { useToastStore } from '@/store/toastStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { WalletProviderOption } from '@/types/wallet';

type FlowStep = 'select' | 'connecting' | 'success' | 'error';

export function WalletConnectModal() {
  const { colors } = useAppTheme();
  const visible = useWalletStore((s) => s.walletModalOpen);
  const setVisible = useWalletStore((s) => s.setWalletModalOpen);
  const connectWallet = useWalletStore((s) => s.connectWallet);
  const account = useWalletStore((s) => s.account);
  const walletError = useWalletStore((s) => s.walletError);
  const clearErrors = useWalletStore((s) => s.clearErrors);
  const showToast = useToastStore((s) => s.showToast);

  const [step, setStep] = useState<FlowStep>('select');
  const [selectedProvider, setSelectedProvider] = useState<WalletProviderOption>('demo');

  useEffect(() => {
    if (visible) {
      setStep('select');
    }
  }, [visible]);

  const handleChooseProvider = async (provider: WalletProviderOption) => {
    setSelectedProvider(provider);
    setStep('connecting');
    const ok = await connectWallet(provider);
    if (ok) {
      setStep('success');
      showToast('Wallet connected', 'Ethereum Sepolia (Demo) synced.', 'success');
    } else {
      setStep('error');
    }
  };

  const handleFinish = () => {
    setVisible(false);
  };

  return (
    <ModalShell
      visible={visible}
      onClose={handleFinish}
      title={
        step === 'success'
          ? 'Wallet connected'
          : step === 'connecting'
          ? 'Establishing connection'
          : 'Connect your wallet'
      }
      subtitle={
        step === 'select'
          ? 'Connect a compatible wallet to view your reward tokens and transaction activity.'
          : undefined
      }
      maxWidth={460}
    >
      {step === 'select' ? (
        <View style={styles.section}>
          <View style={styles.optionsList}>
            <Pressable
              onPress={() => handleChooseProvider('demo')}
              accessibilityRole="button"
              accessibilityLabel="Connect with Demo Wallet"
              style={({ pressed }) => [
                styles.providerCard,
                {
                  backgroundColor: colors.primarySoft,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={[styles.providerIcon, { backgroundColor: colors.primary }]}>
                <Sparkles size={18} color="#F8F7F2" />
              </View>
              <View style={styles.providerMeta}>
                <View style={styles.providerTitleRow}>
                  <Text
                    style={[
                      styles.providerName,
                      { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
                    ]}
                  >
                    Demo Wallet
                  </Text>
                  <View style={[styles.recBadge, { backgroundColor: colors.surface }]}>
                    <Text
                      style={[
                        styles.recText,
                        { color: colors.primary, fontFamily: FontFamilies.bodySemiBold },
                      ]}
                    >
                      Recommended
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.providerDesc,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                  ]}
                >
                  Instant preconfigured Sepolia demo wallet (0x71C7...9A42)
                </Text>
              </View>
              <ChevronRight size={18} color={colors.primary} />
            </Pressable>

            <Pressable
              onPress={() => handleChooseProvider('browser')}
              accessibilityRole="button"
              accessibilityLabel="Connect with Browser Wallet"
              style={({ pressed }) => [
                styles.providerCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={[styles.providerIcon, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                <Globe size={18} color={colors.text} />
              </View>
              <View style={styles.providerMeta}>
                <Text
                  style={[
                    styles.providerName,
                    { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
                  ]}
                >
                  Browser Wallet
                </Text>
                <Text
                  style={[
                    styles.providerDesc,
                    { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                  ]}
                >
                  Simulated browser extension connection prompt
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View
            style={[
              styles.safetyBanner,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}
          >
            <ShieldCheck size={16} color={colors.primary} />
            <Text
              style={[
                styles.safetyText,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              Read-only demonstration mode. We never request private keys, seed phrases, or real
              signatures.
            </Text>
          </View>
        </View>
      ) : null}

      {step === 'connecting' ? (
        <View style={styles.centerState}>
          <View style={[styles.pulseCircle, { backgroundColor: colors.primarySoft, borderColor: colors.border }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text style={[styles.stateTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
            Connecting to {selectedProvider === 'demo' ? 'Demo Wallet' : 'Browser Wallet'}
          </Text>
          <Text
            style={[
              styles.stateDesc,
              { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
            ]}
          >
            Reading reward balance and network status on Ethereum Sepolia (Demo)...
          </Text>
        </View>
      ) : null}

      {step === 'success' && account ? (
        <View style={styles.section}>
          <View style={styles.centerStateCompact}>
            <View style={[styles.statusBadge, { backgroundColor: colors.successSoft }]}>
              <CheckCircle2 size={28} color={colors.success} />
            </View>
            <Text style={[styles.stateTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Ready to view rewards
            </Text>
            <Text
              style={[
                styles.stateDesc,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              Your wallet is paired with the simulated Verdant Rewards contract.
            </Text>
          </View>

          <View
            style={[
              styles.summaryBox,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}
          >
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Address
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  TabularNumStyle,
                  { color: colors.text, fontFamily: FontFamilies.mono },
                ]}
              >
                {account.truncatedAddress}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Network
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
                {account.network.name}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
                Token Balance
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  TabularNumStyle,
                  { color: colors.primary, fontFamily: FontFamilies.headingSemiBold },
                ]}
              >
                {account.formattedBalance} {account.symbol}
              </Text>
            </View>
          </View>

          <Button label="Return to Dashboard" fullWidth onPress={handleFinish} />
        </View>
      ) : null}

      {step === 'error' ? (
        <View style={styles.section}>
          <View style={styles.centerStateCompact}>
            <View style={[styles.statusBadge, { backgroundColor: colors.errorSoft }]}>
              <AlertCircle size={28} color={colors.error} />
            </View>
            <Text style={[styles.stateTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Connection interrupted
            </Text>
            <Text
              style={[
                styles.stateDesc,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              {walletError || 'The wallet request could not be completed.'}
            </Text>
          </View>

          <View style={styles.errorActions}>
            <Button
              label="Clear Fault & Retry"
              fullWidth
              leftIcon={<Wallet size={16} color={colors.textOnPrimary} />}
              onPress={() => {
                clearErrors();
                handleChooseProvider(selectedProvider);
              }}
            />
            <Button
              label="Back to Wallet Options"
              variant="outline"
              fullWidth
              onPress={() => setStep('select')}
            />
          </View>
        </View>
      ) : null}
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 18,
  },
  optionsList: {
    gap: 12,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: 13,
  },
  providerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerMeta: {
    flex: 1,
    gap: 3,
  },
  providerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  providerName: {
    fontSize: 15,
  },
  recBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  recText: {
    fontSize: 11,
  },
  providerDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  safetyText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  centerState: {
    alignItems: 'center',
    paddingVertical: 26,
    gap: 14,
  },
  centerStateCompact: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  pulseCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stateTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  stateDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 330,
  },
  summaryBox: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    gap: 12,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13.5,
  },
  divider: {
    height: 1,
  },
  errorActions: {
    gap: 10,
  },
});

