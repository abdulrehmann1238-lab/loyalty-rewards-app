import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { DemoModePill } from '@/components/common/DemoModeBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/common/Skeleton';
import { AppShell } from '@/components/navigation/AppShell';
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionRow } from '@/components/transactions/TransactionRow';
import { LayoutMetrics } from '@/constants/layout';
import { useResponsive } from '@/hooks/useResponsive';
import { useWalletStore } from '@/store/walletStore';
import { useAppTheme } from '@/theme/ThemeContext';
import { FontFamilies, Radii, TabularNumStyle } from '@/theme/tokens';
import { DateRangeFilter, TransactionFilterType, TransactionItem } from '@/types/transaction';
import { formatTokenAmount } from '@/utils/format';

const DATASET_ANCHOR_MS = Date.parse('2026-11-11T23:59:59Z');

export default function TransactionsScreen() {
  const { colors } = useAppTheme();
  const { isMobile } = useResponsive();
  const insets = useSafeAreaInsets();

  const transactions = useWalletStore((s) => s.transactions);
  const summary = useWalletStore((s) => s.summary);
  const isLoadingTransactions = useWalletStore((s) => s.isLoadingTransactions);
  const transactionsError = useWalletStore((s) => s.transactionsError);
  const refreshTransactions = useWalletStore((s) => s.refreshTransactions);
  const clearErrors = useWalletStore((s) => s.clearErrors);

  const [filterType, setFilterType] = useState<TransactionFilterType>('all');
  const [dateRange, setDateRange] = useState<DateRangeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (filterType === 'received' && tx.type !== 'received') return false;
      if (filterType === 'redeemed' && tx.type !== 'redeemed') return false;
      if (filterType === 'pending' && tx.status !== 'Pending') return false;

      if (dateRange !== 'all') {
        const txMs = Date.parse(`${tx.date}T12:00:00Z`);
        const diffDays = (DATASET_ANCHOR_MS - txMs) / (1000 * 60 * 60 * 24);
        if (dateRange === '7d' && diffDays > 7) return false;
        if (dateRange === '30d' && diffDays > 30) return false;
      }

      if (q) {
        const haystack = `${tx.merchant} ${tx.description} ${tx.id} ${tx.txHash} ${tx.typeLabel}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [transactions, filterType, dateRange, searchQuery]);

  const hasActiveFilters = filterType !== 'all' || dateRange !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setFilterType('all');
    setDateRange('all');
    setSearchQuery('');
  };

  const renderHeader = () => (
    <View style={styles.headerStack}>
      {isMobile ? (
        <View style={styles.mobileDemoRow}>
          <DemoModePill />
        </View>
      ) : null}

      {/* Summary Cards */}
      <View style={[styles.summaryGrid, isMobile ? styles.summaryGridMobile : undefined]}>
        <Card padding={16} style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium }]}>
            Total Received
          </Text>
          <Text
            style={[
              styles.summaryValue,
              TabularNumStyle,
              { color: colors.success, fontFamily: FontFamilies.headingBold },
            ]}
          >
            +{formatTokenAmount(summary.totalEarned)} {summary.tokenSymbol}
          </Text>
        </Card>

        <Card padding={16} style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium }]}>
            Total Redeemed
          </Text>
          <Text
            style={[
              styles.summaryValue,
              TabularNumStyle,
              { color: colors.text, fontFamily: FontFamilies.headingBold },
            ]}
          >
            -{formatTokenAmount(summary.totalRedeemed)} {summary.tokenSymbol}
          </Text>
        </Card>

        <Card padding={16} style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium }]}>
            Total Transactions
          </Text>
          <Text
            style={[
              styles.summaryValue,
              TabularNumStyle,
              { color: colors.primary, fontFamily: FontFamilies.headingBold },
            ]}
          >
            {summary.transactionCount}
          </Text>
        </Card>
      </View>

      <Card padding={18}>
        <TransactionFilters
          activeType={filterType}
          onChangeType={setFilterType}
          activeDateRange={dateRange}
          onChangeDateRange={setDateRange}
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
        />
      </Card>

      <View style={styles.resultsBar}>
        <Text style={[styles.resultsText, TabularNumStyle, { color: colors.textSecondary, fontFamily: FontFamilies.bodyMedium }]}>
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </Text>
        <Button
          label="Sync Logs"
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={14} color={colors.primary} />}
          textStyle={{ color: colors.primary }}
          onPress={refreshTransactions}
        />
      </View>

      {isLoadingTransactions ? (
        <Card padding={18}>
          <View style={styles.skeletonStack}>
            {[1, 2, 3, 4, 5].map((idx) => (
              <View key={idx} style={styles.skeletonRow}>
                <Skeleton width={42} height={42} borderRadius={14} />
                <View style={styles.skeletonText}>
                  <Skeleton width="52%" height={14} />
                  <Skeleton width="34%" height={12} />
                </View>
                <Skeleton width={76} height={16} />
              </View>
            ))}
          </View>
        </Card>
      ) : null}

      {!isLoadingTransactions && transactionsError ? (
        <Card padding={22} style={{ borderColor: colors.error }}>
          <View style={styles.errorWrap}>
            <Text style={[styles.errorTitle, { color: colors.text, fontFamily: FontFamilies.headingSemiBold }]}>
              Transaction history unavailable
            </Text>
            <Text style={[styles.errorDesc, { color: colors.textSecondary, fontFamily: FontFamilies.bodyRegular }]}>
              {transactionsError}
            </Text>
            <Button
              label="Clear Simulation Error & Retry"
              size="sm"
              onPress={() => {
                clearErrors();
                refreshTransactions();
              }}
            />
          </View>
        </Card>
      ) : null}
    </View>
  );

  const showRows = !isLoadingTransactions && !transactionsError;

  return (
    <AppShell
      activeTab="transactions"
      title="Transaction History"
      subtitle="Keep track of your recent reward token activity."
      scrollable={false}
    >
      <FlatList
        data={showRows ? filteredTransactions : []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: isMobile ? 16 : 28,
            paddingTop: isMobile ? 16 : 24,
            paddingBottom: isMobile
              ? LayoutMetrics.mobileBottomNavHeight + Math.max(insets.bottom, 12) + 28
              : 48,
          },
        ]}
        renderItem={({ item, index }) => {
          const isFirst = index === 0;
          const isLast = index === filteredTransactions.length - 1;
          return (
            <View
              style={[
                styles.rowContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderTopWidth: isFirst ? 1 : 0,
                  borderBottomWidth: isLast ? 1 : 0,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderTopLeftRadius: isFirst ? Radii.lg : 0,
                  borderTopRightRadius: isFirst ? Radii.lg : 0,
                  borderBottomLeftRadius: isLast ? Radii.lg : 0,
                  borderBottomRightRadius: isLast ? Radii.lg : 0,
                },
              ]}
            >
              <TransactionRow
                item={item}
                onPress={(tx) => setSelectedTx(tx)}
                showDivider={!isLast}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          showRows ? (
            <View style={styles.emptyWrap}>
              <EmptyState
                kind={hasActiveFilters ? 'search' : 'transactions'}
                title={hasActiveFilters ? 'Search returned no results' : 'No transactions yet'}
                description={
                  hasActiveFilters
                    ? 'No reward transactions match your active filters or search terms.'
                    : 'Your earned and redeemed reward activity will appear here.'
                }
                actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
                onAction={hasActiveFilters ? resetFilters : undefined}
              />
            </View>
          ) : undefined
        }
      />

      <TransactionDetailModal
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    alignItems: 'stretch',
  },
  headerStack: {
    width: '100%',
    maxWidth: LayoutMetrics.maxAppContentWidth,
    alignSelf: 'center',
    gap: 16,
    marginBottom: 10,
  },
  mobileDemoRow: {
    alignItems: 'flex-start',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  summaryGridMobile: {
    flexDirection: 'column',
  },
  summaryCard: {
    flex: 1,
    gap: 6,
  },
  summaryLabel: {
    fontSize: 12.5,
  },
  summaryValue: {
    fontSize: 21,
    letterSpacing: -0.4,
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  resultsText: {
    fontSize: 13,
  },
  rowContainer: {
    width: '100%',
    maxWidth: LayoutMetrics.maxAppContentWidth,
    alignSelf: 'center',
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  emptyWrap: {
    width: '100%',
    maxWidth: LayoutMetrics.maxAppContentWidth,
    alignSelf: 'center',
    marginTop: 6,
  },
  skeletonStack: {
    gap: 14,
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
  errorWrap: {
    gap: 10,
    alignItems: 'flex-start',
  },
  errorTitle: {
    fontSize: 16,
  },
  errorDesc: {
    fontSize: 13.5,
    lineHeight: 20,
  },
});
