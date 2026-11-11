import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Copy, Link2, ShieldCheck, Unlink, Wallet } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useToastStore } from '@/store/toastStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { copyTextToClipboard } from '@/utils/clipboard';

interface WalletStatusCardProps {
  onOpenWalletPage?: () => void;
}

export function WalletStatusCard({ onOpenWalletPage }: WalletStatusCardProps) {
  const { colors } = useAppTheme();
  const status = useWalletStore((s) => s.status);
  const account = useWalletStore((s) => s.account);
  const network = useWalletStore((s) => s.network);
  const setWalletModalOpen = useWalletStore((s) => s.setWalletModalOpen);
  const setDisconnectModalOpen = useWalletStore((s) => s.setDisconnectModalOpen);
  const showToast = useToastStore((s) => s.showToast);

  const [copied, setCopied] = useState(false);
  const isConnected = status === 'connected' && !!account;

  const handleCopy = async () => {
    if (!account) return;
    const ok = await copyTextToClipboard(account.address);
    if (ok) {
      setCopied(true);
      showToast('Wallet address copied.', account.truncatedAddress, 'success');
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (!isConnected) {
    return (
      <Card variant="cream" padding={22}>
        <View style={styles.disconnectedTop}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Wallet size={20} color={colors.primary} />
          </View>
          <View style={styles.statusChipMuted}>
            <View style={[styles.dot, { backgroundColor: colors.warning }]} />
            <Text
              style={[
                styles.statusChipText,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium },
              ]}
            >
              Disconnected
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
          Your wallet is not connected.
        </Text>
        <Text
          style={[
            styles.desc,
            { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
          ]}
        >
          Pair a simulated browser or demo wallet to inspect your on-chain token balance and read
          smart contract details.
        </Text>

        <View style={styles.ctaWrap}>
          <Button
            label="Connect Wallet"
            leftIcon={<Link2 size={15} color={colors.textOnPrimary} />}
            fullWidth
            onPress={() => setWalletModalOpen(true)}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card padding={22}>
      <View style={styles.connectedTop}>
        <View style={styles.connectedHeading}>
          <View style={[styles.iconBox, { backgroundColor: colors.primarySoft, borderColor: 'transparent' }]}>
            <ShieldCheck size={20} color={colors.primary} />
          </View>
          <View style={styles.titleMeta}>
            <Text style={[styles.title, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Wallet Connected
            </Text>
            <Text
              style={[
                styles.networkLabel,
                { color: colors.success, fontFamily: FontFamilies.bodyMedium },
              ]}
            >
              {network.name}
            </Text>
          </View>
        </View>

        <View style={[styles.livePill, { backgroundColor: colors.successSoft }]}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={[styles.liveText, { color: colors.success, fontFamily: FontFamilies.bodySemiBold }]}>
            Active
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
        ]}
      >
        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
            Address
          </Text>
          <Pressable onPress={handleCopy} style={styles.copyInline} accessibilityRole="button" accessibilityLabel="Copy wallet address">
            <Text style={[styles.infoVal, TabularNumStyle, { color: colors.text, fontFamily: FontFamilies.mono }]}>
              {account.truncatedAddress}
            </Text>
            {copied ? (
              <Check size={14} color={colors.success} />
            ) : (
              <Copy size={14} color={colors.textSecondary} />
            )}
          </Pressable>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
            Token Balance
          </Text>
          <Text
            style={[
              styles.infoVal,
              TabularNumStyle,
              { color: colors.primary, fontFamily: FontFamilies.headingSemiBold },
            ]}
          >
            {account.formattedBalance} {account.symbol}
          </Text>
        </View>
      </View>

      <View style={styles.connectedActions}>
        {onOpenWalletPage ? (
          <Button
            label="Contract Details"
            variant="secondary"
            size="sm"
            onPress={onOpenWalletPage}
            style={styles.flexBtn}
          />
        ) : null}
        <Button
          label="Disconnect"
          variant="outline"
          size="sm"
          leftIcon={<Unlink size={14} color={colors.error} />}
          textStyle={{ color: colors.error }}
          onPress={() => setDisconnectModalOpen(true)}
          style={styles.flexBtn}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  disconnectedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  connectedTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  connectedHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleMeta: {
    gap: 2,
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipMuted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 12,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  liveText: {
    fontSize: 11.5,
  },
  title: {
    fontSize: 16.5,
  },
  networkLabel: {
    fontSize: 12.5,
  },
  desc: {
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 6,
  },
  ctaWrap: {
    marginTop: 18,
  },
  infoBox: {
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    gap: 10,
  },
  infoKey: {
    fontSize: 13,
  },
  infoVal: {
    fontSize: 13.5,
  },
  copyInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  divider: {
    height: 1,
  },
  connectedActions: {
    flexDirection: 'row',
    gap: 10,
  },
  flexBtn: {
    flex: 1,
  },
});

