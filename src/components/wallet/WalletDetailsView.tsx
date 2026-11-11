import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Check,
  Code2,
  Copy,
  RefreshCw,
  ShieldCheck,
  Unlink,
  Wallet,
} from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { blockchainService } from '@/services/blockchain/blockchainService';
import { useToastStore } from '@/store/toastStore';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { copyTextToClipboard } from '@/utils/clipboard';
import { formatBalanceFixed, truncateAddress } from '@/utils/format';

export function WalletDetailsView() {
  const { colors } = useAppTheme();
  const status = useWalletStore((s) => s.status);
  const account = useWalletStore((s) => s.account);
  const summary = useWalletStore((s) => s.summary);
  const network = useWalletStore((s) => s.network);
  const setWalletModalOpen = useWalletStore((s) => s.setWalletModalOpen);
  const setDisconnectModalOpen = useWalletStore((s) => s.setDisconnectModalOpen);
  const refreshBalance = useWalletStore((s) => s.refreshBalance);
  const isLoadingBalance = useWalletStore((s) => s.isLoadingBalance);
  const balanceError = useWalletStore((s) => s.balanceError);
  const showToast = useToastStore((s) => s.showToast);

  const [copied, setCopied] = useState(false);
  const [abiReading, setAbiReading] = useState(false);
  const [lastAbiRead, setLastAbiRead] = useState<string | null>(null);

  const isConnected = status === 'connected' && !!account;

  const handleCopyAddress = async () => {
    if (!account) return;
    const ok = await copyTextToClipboard(account.address);
    if (ok) {
      setCopied(true);
      showToast('Wallet address copied.', account.truncatedAddress, 'success');
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleRunAbiRead = async () => {
    setAbiReading(true);
    try {
      const res = await blockchainService.getTokenBalance(account?.address);
      setLastAbiRead(
        `balanceOf(${account?.truncatedAddress ?? '0x71C7...9A42'}) -> ${formatBalanceFixed(
          res.balance
        )} ${res.symbol} (${res.rawBalanceWei} wei)`
      );
      showToast('Smart contract read complete', 'Simulated ERC-20 view call returned.', 'info');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Contract read failed.';
      showToast('Contract read error', msg, 'error');
    } finally {
      setAbiReading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isConnected ? (
        <EmptyState
          kind="wallet"
          title="Your wallet is not connected"
          description="Connect a demo or simulated browser wallet to inspect your address, network status, and read-only smart contract metrics."
          actionLabel="Connect Wallet"
          onAction={() => setWalletModalOpen(true)}
        />
      ) : (
        <Card variant="forest" padding={24}>
          <View style={styles.walletTop}>
            <View style={styles.statusPill}>
              <View style={[styles.dot, { backgroundColor: '#75C396' }]} />
              <Text style={[styles.statusText, { fontFamily: FontFamilies.bodyMedium }]}>
                Connected · {network.name}
              </Text>
            </View>
            <Pressable
              onPress={refreshBalance}
              accessibilityRole="button"
              accessibilityLabel="Refresh wallet balance"
              style={styles.refreshIconBtn}
            >
              <RefreshCw size={15} color="#F8F7F2" />
            </Pressable>
          </View>

          <Text style={[styles.balanceLabel, { fontFamily: FontFamilies.bodyMedium }]}>
            ON-CHAIN REWARD BALANCE (DEMO)
          </Text>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceValue, TabularNumStyle, { fontFamily: FontFamilies.headingBold }]}>
              {isLoadingBalance ? 'Syncing...' : formatBalanceFixed(summary.totalBalance)}
            </Text>
            <Text style={[styles.balanceUnit, { fontFamily: FontFamilies.headingSemiBold }]}>
              {summary.tokenSymbol}
            </Text>
          </View>

          {balanceError ? (
            <View style={styles.inlineError}>
              <Text style={[styles.inlineErrorText, { fontFamily: FontFamilies.bodyRegular }]}>
                {balanceError}
              </Text>
            </View>
          ) : null}

          <View style={styles.addressBox}>
            <View style={styles.addressLeft}>
              <Text style={[styles.addressCaption, { fontFamily: FontFamilies.bodyRegular }]}>
                Wallet Address
              </Text>
              <Text style={[styles.addressFull, TabularNumStyle, { fontFamily: FontFamilies.mono }]}>
                {account.address}
              </Text>
            </View>
            <Pressable
              onPress={handleCopyAddress}
              accessibilityRole="button"
              accessibilityLabel="Copy wallet address"
              style={styles.copyBtn}
            >
              {copied ? (
                <Check size={15} color="#F8F7F2" />
              ) : (
                <Copy size={15} color="#F8F7F2" />
              )}
              <Text style={[styles.copyBtnText, { fontFamily: FontFamilies.bodyMedium }]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Button
              label="Disconnect Wallet"
              variant="ivory"
              size="sm"
              leftIcon={<Unlink size={14} color="#19382E" />}
              onPress={() => setDisconnectModalOpen(true)}
            />
          </View>
        </Card>
      )}

      <Card padding={22}>
        <View style={styles.contractHeader}>
          <View style={[styles.contractIcon, { backgroundColor: colors.primarySoft }]}>
            <Code2 size={18} color={colors.primary} />
          </View>
          <View style={styles.contractHeaderText}>
            <Text
              style={[
                styles.contractTitle,
                { color: colors.text, fontFamily: FontFamilies.headingSemiBold },
              ]}
            >
              Smart Contract Configuration (Demo)
            </Text>
            <Text
              style={[
                styles.contractSubtitle,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              Illustrative ERC-20 read interface ready for ethers.js or viem integration
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.specGrid,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <View style={styles.specRow}>
            <Text style={[styles.specKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              Contract Address
            </Text>
            <Text style={[styles.specVal, TabularNumStyle, { color: colors.text, fontFamily: FontFamilies.mono }]}>
              {truncateAddress(blockchainService.contractConfig.address, 8, 6)}
            </Text>
          </View>
          <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
          <View style={styles.specRow}>
            <Text style={[styles.specKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              Chain ID & Network
            </Text>
            <Text style={[styles.specVal, TabularNumStyle, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
              {blockchainService.contractConfig.chainId} · {network.name}
            </Text>
          </View>
          <View style={[styles.specDivider, { backgroundColor: colors.border }]} />
          <View style={styles.specRow}>
            <Text style={[styles.specKey, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              Token Standard
            </Text>
            <Text style={[styles.specVal, { color: colors.text, fontFamily: FontFamilies.bodyMedium }]}>
              ERC-20 ({blockchainService.contractConfig.symbol} · {blockchainService.contractConfig.decimals} decimals)
            </Text>
          </View>
        </View>

        <View style={styles.abiSection}>
          <Text style={[styles.abiHeading, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
            Read-Only ABI Methods
          </Text>
          <View style={styles.abiPills}>
            {blockchainService.abi.map((fn) => (
              <View
                key={fn.name}
                style={[
                  styles.abiPill,
                  { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.abiText, { color: colors.primary, fontFamily: FontFamilies.mono }]}>
                  {fn.name}({fn.inputs.map((i) => i.type).join(', ')})
                </Text>
              </View>
            ))}
          </View>
        </View>

        {lastAbiRead ? (
          <View
            style={[
              styles.abiOutput,
              { backgroundColor: colors.primarySoft, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.abiOutputLabel, { color: colors.primary, fontFamily: FontFamilies.bodySemiBold }]}>
              Simulated Call Output
            </Text>
            <Text style={[styles.abiOutputVal, TabularNumStyle, { color: colors.text, fontFamily: FontFamilies.mono }]}>
              {lastAbiRead}
            </Text>
          </View>
        ) : null}

        <View style={styles.contractFooter}>
          <View style={styles.disclaimerRow}>
            <ShieldCheck size={15} color={colors.textSecondary} />
            <Text
              style={[
                styles.disclaimerText,
                { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
              ]}
            >
              {blockchainService.disclaimer}
            </Text>
          </View>
          <Button
            label="Test balanceOf() Read"
            variant="secondary"
            size="sm"
            loading={abiReading}
            leftIcon={<Wallet size={14} color={colors.text} />}
            onPress={handleRunAbiRead}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  walletTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    backgroundColor: 'rgba(248, 247, 242, 0.12)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    color: '#F8F7F2',
    fontSize: 12,
  },
  refreshIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(248, 247, 242, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    color: 'rgba(248, 247, 242, 0.72)',
    fontSize: 11,
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  balanceValue: {
    color: '#F8F7F2',
    fontSize: 34,
    letterSpacing: -0.8,
  },
  balanceUnit: {
    color: '#B59A69',
    fontSize: 16,
  },
  inlineError: {
    backgroundColor: 'rgba(185, 109, 104, 0.25)',
    borderRadius: Radii.sm,
    padding: 10,
    marginBottom: 12,
  },
  inlineErrorText: {
    color: '#F8F7F2',
    fontSize: 12.5,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'rgba(25, 56, 46, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(248, 247, 242, 0.14)',
    borderRadius: Radii.md,
    padding: 13,
    marginBottom: 16,
  },
  addressLeft: {
    flex: 1,
    gap: 3,
  },
  addressCaption: {
    color: 'rgba(248, 247, 242, 0.65)',
    fontSize: 11,
  },
  addressFull: {
    color: '#F8F7F2',
    fontSize: 12,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radii.sm,
    backgroundColor: 'rgba(248, 247, 242, 0.14)',
  },
  copyBtnText: {
    color: '#F8F7F2',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  contractIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractHeaderText: {
    flex: 1,
    gap: 3,
  },
  contractTitle: {
    fontSize: 16,
  },
  contractSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  specGrid: {
    borderRadius: Radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
    flexWrap: 'wrap',
  },
  specKey: {
    fontSize: 13,
  },
  specVal: {
    fontSize: 13,
  },
  specDivider: {
    height: 1,
  },
  abiSection: {
    gap: 8,
    marginBottom: 16,
  },
  abiHeading: {
    fontSize: 13,
  },
  abiPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abiPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.sm,
    borderWidth: 1,
  },
  abiText: {
    fontSize: 12,
  },
  abiOutput: {
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    gap: 4,
    marginBottom: 16,
  },
  abiOutputLabel: {
    fontSize: 11.5,
  },
  abiOutputVal: {
    fontSize: 12,
    lineHeight: 18,
  },
  contractFooter: {
    gap: 12,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});

