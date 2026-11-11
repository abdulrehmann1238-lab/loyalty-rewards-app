import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowRight, RefreshCw } from 'lucide-react-native';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii } from '@/theme/tokens';
import { TransactionItem } from '@/types/transaction';

interface RecentTransactionsCardProps {
  onSelectTransaction: (tx: TransactionItem) => void;
  onViewAll: () => void;
}

export function RecentTransactionsCard({
  onSelectTransaction,
  onViewAll,
}: RecentTransactionsCardProps) {
  const { colors } = useAppTheme();
  const transactions = useWalletStore((s) => s.transactions);
  const isLoadingTransactions = useWalletStore((s) => s.isLoadingTransactions);
  const transactionsError = useWalletStore((s) => s.transactionsError);
  const refreshTransactions = useWalletStore((s) => s.refreshTransactions);
  const clearErrors = useWalletStore((s) => s.clearErrors);

  const recentFive = transactions.slice(0, 5);

  return (
    <Card padding={22}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
            Recent Transactions
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
            ]}
          >
            Latest reward credits and redemptions
          </Text>
        </View>
        <Button
          label="View All"
          variant="ghost"
          size="sm"
          rightIcon={<ArrowRight size={14} color={colors.primary} />}
          textStyle={{ color: colors.primary }}
          onPress={onViewAll}
        />
      </View>

      {isLoadingTransactions ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3, 4].map((idx) => (
            <View key={idx} style={styles.skeletonRow}>
              <Skeleton width={40} height={40} borderRadius={14} />
              <View style={styles.skeletonText}>
                <Skeleton width="55%" height={14} />
                <Skeleton width="35%" height={12} />
              </View>
              <Skeleton width={70} height={16} />
            </View>
          ))}
        </View>
      ) : transactionsError ? (
        <View
          style={[
            styles.errorState,
            { backgroundColor: colors.errorSoft, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.errorTitle, { color: colors.text, fontFamily: FontFamilies.bodySemiBold }]}>
            Transaction feed unavailable
          </Text>
          <Text
            style={[
              styles.errorDesc,
              { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular },
            ]}
          >
            {transactionsError}
          </Text>
          <Button
            label="Reset & Reload"
            size="sm"
            variant="secondary"
            leftIcon={<RefreshCw size={14} color={colors.text} />}
            onPress={() => {
              clearErrors();
              refreshTransactions();
            }}
          />
        </View>
      ) : recentFive.length === 0 ? (
        <EmptyState
          kind="transactions"
          title="No recent transactions"
          description="Your reward activity will appear here once purchases or redemptions are recorded."
        />
      ) : (
        <View style={styles.list}>
          {recentFive.map((tx, idx) => (
            <TransactionRow
              key={tx.id}
              item={tx}
              onPress={onSelectTransaction}
              showDivider={idx < recentFive.length - 1}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  titleBlock: {
    gap: 2,
    flex: 1,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 12.5,
  },
  list: {
    marginHorizontal: -6,
  },
  skeletonList: {
    gap: 14,
    paddingVertical: 8,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skeletonText: {
    flex: 1,
    gap: 6,
  },
  errorState: {
    borderRadius: Radii.md,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    alignItems: 'flex-start',
  },
  errorTitle: {
    fontSize: 14,
  },
  errorDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});

