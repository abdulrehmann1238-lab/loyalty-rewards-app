import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, Copy, ExternalLink, Info } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { ModalShell } from '@/components/common/ModalShell';
import { useToastStore } from '@/store/toastStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { TransactionItem } from '@/types/transaction';
import { copyTextToClipboard } from '@/utils/clipboard';
import { formatSignedRwd, truncateAddress, truncateHash } from '@/utils/format';
import { TransactionIcon } from './TransactionIcon';

interface TransactionDetailModalProps {
  transaction: TransactionItem | null;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, onClose }: TransactionDetailModalProps) {
  const { colors } = useAppTheme();
  const showToast = useToastStore((s) => s.showToast);

  const [copiedHash, setCopiedHash] = useState(false);
  const [showExplorerNotice, setShowExplorerNotice] = useState(false);

  useEffect(() => {
    setCopiedHash(false);
    setShowExplorerNotice(false);
  }, [transaction]);

  if (!transaction) return null;

  const isPositive = transaction.type === 'received';
  const isPending = transaction.status === 'Pending';

  const handleCopyHash = async () => {
    const ok = await copyTextToClipboard(transaction.txHash);
    if (ok) {
      setCopiedHash(true);
      showToast('Transaction hash copied.', truncateHash(transaction.txHash), 'success');
      setTimeout(() => setCopiedHash(false), 1800);
    }
  };

  return (
    <ModalShell
      visible={!!transaction}
      onClose={onClose}
      title="Transaction Details"
      subtitle={`Reference ID ${transaction.id.toUpperCase()}`}
      maxWidth={510}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.heroBox,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
          ]}
        >
          <TransactionIcon category={transaction.category} type={transaction.type} size={46} />
          <View style={styles.heroText}>
            <Text style={[styles.merchant, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              {transaction.merchant}
            </Text>
            <Text style={[styles.desc, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              {transaction.description}
            </Text>
          </View>
          <View style={styles.heroRight}>
            <Text
              style={[
                styles.amount,
                TabularNumStyle,
                {
                  color: isPositive ? colors.success : colors.text,
                  fontFamily: FontFamilies.headingBold,
                },
              ]}
            >
              {formatSignedRwd(transaction.amount, transaction.type)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isPending ? colors.warningSoft : colors.successSoft },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color: isPending ? colors.warning : colors.success,
                    fontFamily: FontFamilies.bodySemiBold,
                  },
                ]}
              >
                {transaction.status}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.detailCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <DetailRow label="Transaction Type" value={transaction.typeLabel} />
          <DetailRow label="Date & Time" value={`${transaction.displayDate} · ${transaction.time}`} />
          {transaction.purchaseTotal ? (
            <DetailRow label="Eligible Purchase" value={transaction.purchaseTotal} tabular />
          ) : null}
          <DetailRow label="Transaction Hash" value={truncateHash(transaction.txHash, 12, 10)} mono />
          <DetailRow label="From Address" value={truncateAddress(transaction.fromAddress, 8, 6)} mono />
          <DetailRow label="To Address" value={truncateAddress(transaction.toAddress, 8, 6)} mono />
          <DetailRow label="Network" value={transaction.network} />
          <DetailRow
            label="Block Number"
            value={`#${transaction.blockNumber.toLocaleString('en-US')}`}
            tabular
          />
          <DetailRow
            label="Confirmations"
            value={`${transaction.confirmations} confirmations`}
            tabular
            last
          />
        </View>

        {showExplorerNotice ? (
          <View
            style={[
              styles.demoNotice,
              { backgroundColor: colors.goldSoft, borderColor: colors.border },
            ]}
          >
            <Info size={16} color={colors.gold} />
            <View style={styles.noticeBody}>
              <Text style={[styles.noticeTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
                Simulated Explorer Notice
              </Text>
              <Text
                style={[
                  styles.noticeDesc,
                  { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
                ]}
              >
                This transaction hash is generated from fictional demo data and is not published on
                a live blockchain explorer. In Phase Two, this action links directly to Etherscan
                Sepolia or Mainnet.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Button
            label={copiedHash ? 'Hash Copied' : 'Copy Transaction Hash'}
            variant="secondary"
            leftIcon={
              copiedHash ? (
                <Check size={15} color={colors.success} />
              ) : (
                <Copy size={15} color={colors.text} />
              )
            }
            onPress={handleCopyHash}
            style={styles.flexBtn}
          />
          <Button
            label="View on Explorer"
            variant="outline"
            leftIcon={<ExternalLink size={15} color={colors.text} />}
            onPress={() => {
              setShowExplorerNotice(true);
              showToast('Demo Explorer Notice', 'Simulated transaction — not broadcast on-chain.', 'info');
            }}
            style={styles.flexBtn}
          />
        </View>
      </View>
    </ModalShell>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
  tabular = false,
  last = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tabular?: boolean;
  last?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.detailRow,
        !last ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined,
      ]}
    >
      <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.detailValue,
          tabular || mono ? TabularNumStyle : undefined,
          {
            color: colors.text,
            fontFamily: mono ? FontFamilies.mono : FontFamilies.bodyMedium,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: Radii.lg,
    borderWidth: 1,
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  merchant: {
    fontSize: 16,
  },
  desc: {
    fontSize: 13,
  },
  heroRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  amount: {
    fontSize: 17,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  statusText: {
    fontSize: 11,
  },
  detailCard: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 13,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  noticeBody: {
    flex: 1,
    gap: 3,
  },
  noticeTitle: {
    fontSize: 13,
  },
  noticeDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  flexBtn: {
    flex: 1,
    minWidth: 180,
  },
});

